import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Question } from "../../models/question";

type GameState = {
  currentIndex: number;
  currenQuestionIndex: number;
  questions: Question[];
  selectedAnswers: { [key: number]: number };
  bookmarkedQuestions: { [key: number]: boolean };
};

const initialState: GameState = {
  currentIndex: 0,
  currenQuestionIndex: 0,
  questions: [],
  selectedAnswers: {},
  bookmarkedQuestions: {},
};

const gameSlice = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    initGame: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
      state.currentIndex = 0;
      state.currenQuestionIndex = state.questions[state.currentIndex].questionId;
      state.selectedAnswers = {};
      state.bookmarkedQuestions = {};
    },
    setIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
      state.currenQuestionIndex = state.questions[state.currentIndex].questionId;
    },
    setSelectedAnswer: (state, action: PayloadAction<number>) => {
      state.selectedAnswers[state.currenQuestionIndex] = action.payload;
    },
    resetGame: () => initialState,
  },
});

export const { initGame, setIndex, setSelectedAnswer, resetGame } = gameSlice.actions;

export default gameSlice.reducer;
