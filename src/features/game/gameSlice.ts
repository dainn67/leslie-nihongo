import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Question } from "../../models/question";

type GameState = {
  currentIndex: number;
  currenQuestionIndex: number;
  questions: Question[];
  selectedAnswers: { [key: number]: number };
  bookmarkedQuestions: { [key: number]: boolean };
  showExplanations: { [key: number]: boolean };
};

const initialState: GameState = {
  currentIndex: 0,
  currenQuestionIndex: 0,
  questions: [],
  selectedAnswers: {},
  bookmarkedQuestions: {},
  showExplanations: {},
};

const gameSlice = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    setCurrentIndex: (state, action: PayloadAction<{ index: number; questionIndex: number }>) => {
      state.currentIndex = action.payload.index;
      state.currenQuestionIndex = action.payload.questionIndex;
    },
    setSelectedAnswer: (state, action: PayloadAction<number>) => {
      state.selectedAnswers[state.currenQuestionIndex] = action.payload;
      console.log(state.selectedAnswers);
    },
    resetGame: () => initialState,
  },
});

export const { setCurrentIndex, setSelectedAnswer, resetGame } = gameSlice.actions;

export default gameSlice.reducer;
