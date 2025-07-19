import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "./types";
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
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
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

export const { clearChat, addMessage, setIsLoading } = chatbotSlice.actions;

export default chatbotSlice.reducer;
