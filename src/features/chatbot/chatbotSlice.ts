import { createSlice, PayloadAction, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { ChatMessage, createChatMessage, MessageStatus, MessageType, Sender, SuggestedAction } from "../../models/chatMessage";
import { Question } from "../../models/question";
import { ApiConfig } from "../../constants/apiConfig";
import { ChatbotService } from "../../service/chatbotService";
import { DifyConfig } from "../../constants/difyConfig";
import Constants from "expo-constants";

const { DIFY_EXTRACT_CONTEXT_API_KEY } = Constants.expoConfig?.extra ?? {};

const mainCID = DifyConfig.mainChatbotConversationId;

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

type ChatbotState = {
  messages: { [key: string]: ChatMessage[] };
  conversationId: { [key: string]: string | undefined };
  conversationSummary: { [key: string]: string | undefined };
  suggestedPropmpt: string[];
};

const initialState: ChatbotState = {
  messages: {},
  conversationId: {},
  conversationSummary: {},
  suggestedPropmpt: [],
};

export const getMessagesByCID = createSelector(
  [(state: ChatbotState) => state, (state: ChatbotState, cid?: string) => cid],
  (state, cid) => state.messages[cid ?? mainCID] || [],
);

export const getLatestMessageByCID = createSelector(
  [(state: ChatbotState) => state, (state: ChatbotState, cid?: string) => cid],
  (state, cid) => {
    const messages = state.messages[cid ?? mainCID] || [];
    return messages.length > 0 ? messages[messages.length - 1] : null;
  },
);

export const getConversationIdByCID = createSelector(
  [(state: ChatbotState) => state, (state: ChatbotState, cid?: string) => cid],
  (state, cid) => state.conversationId[cid ?? mainCID] || "",
);

export const getConversationSummaryByCID = createSelector(
  [(state: ChatbotState) => state, (state: ChatbotState, cid?: string) => cid],
  (state, cid) => state.conversationSummary[cid ?? mainCID] || "",
);

const chatbotSlice = createSlice({
  name: "chatbotState",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<{ cid?: string; message: ChatMessage }>) => {
      const cid = action.payload.cid ?? mainCID;
      state.messages[cid] = [...(state.messages[cid] || []), action.payload.message];
    },
    addLoading: (state, action: PayloadAction<{ cid?: string }>) => {
      const cid = action.payload.cid ?? mainCID;
      state.messages[cid] = [
        ...(state.messages[cid] || []),
        createChatMessage({
          status: MessageStatus.LOADING,
          sender: Sender.BOT,
        }),
      ];
    },
    updateConversationId: (state, action: PayloadAction<{ cid?: string; conversationId: string }>) => {
      const cid = action.payload.cid ?? mainCID;
      state.conversationId[cid] = action.payload.conversationId;
    },
    updateConversationSummary: (state, action: PayloadAction<{ cid?: string; conversationSummary: string }>) => {
      const cid = action.payload.cid ?? mainCID;
      if (action.payload.conversationSummary.trim().length != 0) {
        state.conversationSummary[cid] = action.payload.conversationSummary;
      }
    },
    updateLastMessageData: (
      state,
      action: PayloadAction<{
        cid?: string;
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
      const cid = action.payload.cid ?? mainCID;
      const message = state.messages[cid]?.at(-1);
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
    clearChat: (state, action: PayloadAction<{ cid?: string }>) => {
      const cid = action.payload.cid ?? mainCID;
      state.messages[cid] = [];
      state.conversationId[cid] = undefined;
      state.conversationSummary[cid] = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(extractContext.fulfilled, (state, action: PayloadAction<{ cid: string; conversationSummary: string }>) => {
      if (action.payload) {
        state.conversationSummary[action.payload.cid] = action.payload.conversationSummary;
      }
    });
  },
});

export const { addMessage, addLoading, updateConversationId, updateConversationSummary, updateLastMessageData, clearChat } =
  chatbotSlice.actions;
export default chatbotSlice.reducer;
