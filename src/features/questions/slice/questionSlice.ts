import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Question } from '../../../models/question';

type QuestionsState = {
  questions: Question[];
};

const initialState: QuestionsState = {
  questions: [],
};

const questionSlice = createSlice({
  name: 'QuestionsState',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
  },
});

export const { setQuestions } = questionSlice.actions;
export default questionSlice.reducer;
