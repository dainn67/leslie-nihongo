import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ChatMessage,
  createChatMessage,
  Sender,
  SuggestedAction,
} from "../types";

type ChatState = {
  messages: ChatMessage[];
  isLoading: boolean;
};

const initialState: ChatState = {
  messages: [],
  isLoading: false,
};

const chatbotSlice = createSlice({
  name: "chatbotState",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    addLoading: (state, action: PayloadAction<{ loadingText: string }>) => {
      state.messages.push(
        createChatMessage({
          loading: true,
          sender: Sender.BOT,
          loadingText: action.payload.loadingText,
        })
      );
    },
    updateLatestStream: (state, action: PayloadAction<{ word: string }>) => {
      const index = state.messages.length - 1;
      if (index !== -1) {
        const message = state.messages[index];
        message.loading = false;
        message.words.push(action.payload.word);
      }
    },
    updateLatestMessageId: (
      state,
      action: PayloadAction<{ messageId: string }>
    ) => {
      const index = state.messages.length - 1;
      if (index !== -1) {
        const message = state.messages[index];
        message.loading = false;
        message.id = action.payload.messageId;
      }
    },
    updateLatestSuggestedActions: (
      state,
      action: PayloadAction<{ suggestedActions: SuggestedAction[] }>
    ) => {
      const index = state.messages.length - 1;
      if (index !== -1) {
        const message = state.messages[index];
        message.suggestedActions = action.payload.suggestedActions.map(
          (action) => ({
            id: action["id"],
            title: action["title"],
          })
        );
      }
    },
    clearChat: () => initialState,
  },
});

export const {
  clearChat,
  addMessage,
  addLoading,
  updateLatestStream,
  updateLatestMessageId,
  updateLatestSuggestedActions,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
