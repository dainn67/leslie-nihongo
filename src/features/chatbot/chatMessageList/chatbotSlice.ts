import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage, createChatMessage, Sender } from "../types";
import { sendMessageThunk } from "./chatbotThunk";

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
    addInitialMessage: (state) => {
      state.messages = [
        createChatMessage({
          fullText: "Hello, how can I help you today?",
          sender: Sender.BOT,
        }),
      ];
    },
    addLoading: (state) => {
      state.messages.push(
        createChatMessage({ loading: true, sender: Sender.BOT })
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
    updateLatestMessageIndex: (
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
    clearChat: () => initialState,
  },
});

export const {
  clearChat,
  addMessage,
  addLoading,
  addInitialMessage,
  updateLatestStream,
  updateLatestMessageIndex,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
