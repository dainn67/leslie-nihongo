import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage, Sender } from "../types";
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
      state.messages = [];
      state.messages.push({
        id: "initial_message",
        text: "Hello, how can I help you today?",
        sender: Sender.BOT,
        createdAt: new Date().toISOString(),
      });
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateMessage: (state, action: PayloadAction<ChatMessage>) => {
      const index = state.messages.findIndex(
        (message) => message.id === action.payload.id
      );
      if (index !== -1) {
        state.messages[index].text = action.payload.text;
      }
    },
    streamAppendToMessage: (
      state,
      action: PayloadAction<{ id: string; delta: string }>
    ) => {
      const index = state.messages.findIndex(
        (msg) => msg.id === action.payload.id
      );
      if (index !== -1) {
        state.messages[index].text += action.payload.delta;
      }
    },
    clearChat: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.messages.push(action.payload);
        state.isLoading = false;
      })
      .addCase(sendMessageThunk.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  clearChat,
  addMessage,
  setIsLoading,
  addInitialMessage,
  updateMessage,
  streamAppendToMessage,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
