import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ChatMessageState = {
  words: string[];
  isStreaming: boolean;
};

const initialState: ChatMessageState = {
  words: [],
  isStreaming: false,
};

const chatMessageSlice = createSlice({
  name: "chatMessageState",
  initialState,
  reducers: {
    setIsStreaming: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
    },
    updateMessage: (state, action: PayloadAction<string>) => {
      state.words.push(action.payload);
    },
    clearMessage: (state) => {
      state.words = [];
    },
  },
});

export const { setIsStreaming, updateMessage, clearMessage } =
  chatMessageSlice.actions;

export default chatMessageSlice.reducer;
