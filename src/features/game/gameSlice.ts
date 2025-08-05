import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Question } from "../../models/question";
import { shuffleQuestionAnswers } from "../../service/questionService";

type GameState = {
  currentQuestionIndex: number;
  currenQuestionIndex: number;
  questions: Question[];
  selectedAnswers: { [key: number]: number };
  bookmarkedQuestions: number[];
};

const initialState: GameState = {
  currentQuestionIndex: 0,
  currenQuestionIndex: 0,
  questions: [],
  selectedAnswers: {},
  bookmarkedQuestions: [],
};

const gameSlice = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    initGame: (state, action: PayloadAction<Question[]>) => {
      state.questions = shuffleQuestionAnswers(action.payload);
      state.currentQuestionIndex = 0;
      state.currenQuestionIndex = state.questions[state.currentQuestionIndex].questionId;
      state.selectedAnswers = {};
      state.bookmarkedQuestions = action.payload.map((q) => q.questionId);
    },
    setIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
      state.currenQuestionIndex = state.questions[state.currentQuestionIndex].questionId;
    },
    setSelectedAnswer: (state, action: PayloadAction<number>) => {
      state.selectedAnswers[state.currenQuestionIndex] = action.payload;
    },
    updateBookmark: (state, action: PayloadAction<{ questionId: number; isBookmarked: boolean }>) => {
      if (action.payload.isBookmarked) {
        state.bookmarkedQuestions.push(action.payload.questionId);
      } else {
        state.bookmarkedQuestions = state.bookmarkedQuestions.filter((id) => id !== action.payload.questionId);
      }
    },
    resetGame: () => initialState,
  },
});

export const { initGame, setIndex, setSelectedAnswer, updateBookmark, resetGame } = gameSlice.actions;

export default gameSlice.reducer;
