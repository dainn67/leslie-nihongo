import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage, createChatMessage, MessageStatus, MessageType, Sender, SuggestedAction } from "../../models/chatMessage";
import { Question } from "../../models/question";
import { ApiConfig } from "../../constants/apiConfig";
import { ChatbotService } from "../../service/chatbotService";
import Constants from "expo-constants";

const { DIFY_EXTRACT_CONTEXT_API_KEY } = Constants.expoConfig?.extra ?? {};

export const extractContext = createAsyncThunk(
  ApiConfig.difyServerUrl,
  async ({ message, conversationSummary }: { message: string; conversationSummary: string }) => {
    const result = await ChatbotService.sendMessage({
      message,
      token: DIFY_EXTRACT_CONTEXT_API_KEY,
      data: {
        conversation_summary: conversationSummary,
      },
    });

    return result.trim();
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
          status: MessageStatus.LOADING,
          sender: Sender.BOT,
        }),
      );
    },
    updateConversationId: (state, action: PayloadAction<string>) => {
      state.conversationId = action.payload;
    },
    updateConversationSummary: (state, action: PayloadAction<string>) => {
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
        hasError?: boolean;
      }>,
    ) => {
      const message = getLatestMessage(state);
      if (message) {
        // Loop through the payload and map to fields if exist
        Object.entries(action.payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === "nextWord") {
              message.words.push(value as string);
            } else {
              // @ts-ignore: dynamic gán thuộc tính
              message[key] = value;
            }
          }
        });
      }
    },

    clearChat: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(extractContext.fulfilled, (state, action) => {
      if (action.payload) {
        state.conversationSummary = action.payload;
      }
    });
  },
});

export const { clearChat, addMessage, addLoading, updateLastMessageData, updateConversationId, updateConversationSummary } =
  chatbotSlice.actions;

export default chatbotSlice.reducer;
