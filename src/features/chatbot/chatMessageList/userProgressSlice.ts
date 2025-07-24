import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProgress } from "../../../models/userProgress";

interface UserProgressState {
  userProgress: ReturnType<UserProgress["toJSON"]>;
}

const initialState: UserProgressState = {
  userProgress: new UserProgress().toJSON(),
};

const userProgressSlice = createSlice({
  name: "userProgress",
  initialState,
  reducers: {
    setUserLevel: (state, action: PayloadAction<string>) => {
      state.userProgress.level = action.payload;
      state.userProgress.lastUpdated = Date.now();
    },
    setUserTarget: (state, action: PayloadAction<string>) => {
      state.userProgress.target = action.payload;
      state.userProgress.lastUpdated = Date.now();
    },
    setUserStartDate: (state, action: PayloadAction<number>) => {
      state.userProgress.startDate = action.payload;
      state.userProgress.lastUpdated = Date.now();
    },
    setUserExamDate: (state, action: PayloadAction<number>) => {
      state.userProgress.examDate = action.payload;
      state.userProgress.lastUpdated = Date.now();
    },
    clearUserProgress: () => initialState,
  },
});

export const {
  setUserLevel,
  setUserTarget,
  setUserStartDate,
  setUserExamDate,
  clearUserProgress,
} = userProgressSlice.actions;
export default userProgressSlice.reducer;
