import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Question } from "../../models/question";
import { shuffleQuestionAnswers } from "../../service/questionService";

type GameState = {
  currentQuestionIndex: number;
  questions: Question[];
  selectedAnswers: { [key: number]: number };
  bookmarkedQuestions: number[];
};

const initialState: GameState = {
  currentQuestionIndex: 0,
  questions: [],
  selectedAnswers: {},
  bookmarkedQuestions: [],
};

const gameSlice = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    initGame: (state, action: PayloadAction<Question[]>) => {
      const shuffledQuestions = shuffleQuestionAnswers(action.payload);
      return {
        ...state,
        questions: shuffledQuestions,
        currentQuestionIndex: 0,
        selectedAnswers: {},
        bookmarkedQuestions: action.payload.map((q) => q.questionId),
      };
    },
    setIndex: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        currentQuestionIndex: action.payload,
      };
    },
    setSelectedAnswer: (state, action: PayloadAction<number>) => {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      if (currentQuestion) {
        return {
          ...state,
          selectedAnswers: {
            ...state.selectedAnswers,
            [currentQuestion.questionId]: action.payload,
          },
        };
      }
      return state;
    },
    updateBookmark: (state, action: PayloadAction<{ questionId: number; isBookmarked: boolean }>) => {
      const { questionId, isBookmarked } = action.payload;
      return {
        ...state,
        bookmarkedQuestions: isBookmarked
          ? [...state.bookmarkedQuestions, questionId]
          : state.bookmarkedQuestions.filter((id) => id !== questionId),
      };
    },
    resetGame: () => initialState,
  },
});

export const { initGame, setIndex, setSelectedAnswer, updateBookmark, resetGame } = gameSlice.actions;

export default gameSlice.reducer;
