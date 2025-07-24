import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { splitCustomWords } from "../../../utils/utils";

type ChatMessageState = {
  currentIndex: number;
  fullText: string;
  words: string[];
  isStreaming: boolean;
};

const initialState: ChatMessageState = {
  currentIndex: 0,
  fullText: "",
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
      state.fullText += action.payload;
      const splittedWords = splitCustomWords(state.fullText);

      const nextWord = splittedWords[state.currentIndex];
      state.words.push(nextWord);
      state.currentIndex++;
    },
    clearMessage: (state) => {
      state.words = [];
    },
  },
});

export const { setIsStreaming, updateMessage, clearMessage } = chatMessageSlice.actions;

export default chatMessageSlice.reducer;
