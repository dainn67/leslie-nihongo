import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Question } from "../../models/question";

type GameState = {
  currentQuestionIndex: number;
  currenQuestionIndex: number;
  questions: Question[];
  selectedAnswers: { [key: number]: number };
  bookmarkedQuestions: { [key: number]: boolean };
};

const initialState: GameState = {
  currentQuestionIndex: 0,
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
      state.currentQuestionIndex = 0;
      state.currenQuestionIndex = state.questions[state.currentQuestionIndex].questionId;
      state.selectedAnswers = {};
      state.bookmarkedQuestions = {};
    },
    setIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
      state.currenQuestionIndex = state.questions[state.currentQuestionIndex].questionId;
    },
    setSelectedAnswer: (state, action: PayloadAction<number>) => {
      state.selectedAnswers[state.currenQuestionIndex] = action.payload;
    },
    resetGame: () => initialState,
  },
});

export const { initGame, setIndex, setSelectedAnswer, resetGame } = gameSlice.actions;

export default gameSlice.reducer;
