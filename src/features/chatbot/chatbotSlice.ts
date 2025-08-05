import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage, createChatMessage, MessageStatus, MessageType, Sender, SuggestedAction } from "../../models/chatMessage";
import { Question } from "../../models/question";
import { ApiConfig } from "../../constants/apiConfig";
import { postData } from "../../api/apiClient";
import Constants from "expo-constants";

const { DIFY_API_KEY } = Constants.expoConfig?.extra ?? {};
const user = "dainn";

export const extractInformation = createAsyncThunk(
  ApiConfig.difyServerUrl,
  async ({ message, previous_information }: { message: string; previous_information: string }) => {
    const result = await postData({
      url: ApiConfig.difyServerUrl,
      token: DIFY_API_KEY,
      body: {
        query: message,
        inputs: {
          extract_information: 1,
          previous_information: previous_information,
        },
        response_mode: "blocking",
        user: user,
        auto_generate_name: false,
      },
    });

    return result["answer"].trim();
  },
);

type ChatState = {
  messages: ChatMessage[];
  conversationId?: string;
  suggestedPropmpt: string[];
  conversationSummary: string;
};

const initialState: ChatState = {
  messages: [],
  conversationId: undefined,
  suggestedPropmpt: [],
  conversationSummary: "",
};

const getLatestMessage = (state: ChatState) => {
  const index = state.messages.length - 1;
  if (index !== -1) {
    return state.messages[index];
  }
  return null;
};

const chatbotSlice = createSlice({
  name: "chatbotState",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    addLoading: (state) => {
      state.messages.push(
        createChatMessage({
          messageStatus: MessageStatus.LOADING,
          sender: Sender.BOT,
        }),
      );
    },
    updateConversationId: (state, action: PayloadAction<string>) => {
      state.conversationId = action.payload;
    },
    updateSummary: (state, action: PayloadAction<string>) => {
      if (action.payload.trim().length != 0) {
        state.conversationSummary = action.payload;
      }
    },
    updateLastMessageData: (
      state,
      action: PayloadAction<{
        messageId?: string;
        nextWord?: string;
        status?: MessageStatus;
        messageType?: MessageType;
        fullText?: string;
        questions?: Question[];
        suggestedActions?: SuggestedAction[];
        summary?: string;
      }>,
    ) => {
      const message = getLatestMessage(state);
      if (message) {
        if (action.payload.messageId !== undefined) message.id = action.payload.messageId;
        if (action.payload.status !== undefined) message.messageStatus = action.payload.status;
        if (action.payload.messageType !== undefined) message.messageType = action.payload.messageType;
        if (action.payload.fullText !== undefined) message.fullText = action.payload.fullText;
        if (action.payload.nextWord !== undefined) message.words.push(action.payload.nextWord);
        if (action.payload.questions !== undefined) message.questions = action.payload.questions;
        if (action.payload.suggestedActions !== undefined) message.suggestedActions = action.payload.suggestedActions;
        if (action.payload.summary !== undefined) message.summary = action.payload.summary;
      }
    },

    clearChat: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(extractInformation.fulfilled, (state, action) => {
      if (action.payload) {
        state.conversationSummary = action.payload;
      }
    });
  },
});

export const { clearChat, addMessage, addLoading, updateLastMessageData, updateConversationId, updateSummary } =
  chatbotSlice.actions;

export default chatbotSlice.reducer;
