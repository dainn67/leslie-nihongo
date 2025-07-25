import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createUserProgress, UserProgress } from "../../models/userProgress";
import { setUserProgressToStorage } from "../../service/userProgressSerivice";

interface UserProgressState {
  userProgress: UserProgress;
}

const initialState: UserProgressState = {
  userProgress: createUserProgress(),
};

const userProgressSlice = createSlice({
  name: "userProgress",
  initialState,
  reducers: {
    setUserProgress: (state, action: PayloadAction<UserProgress>) => {
      state.userProgress = { ...action.payload };
      setUserProgressToStorage(state.userProgress);
    },
    setUserLevel: (state, action: PayloadAction<string>) => {
      state.userProgress.level = action.payload;
      state.userProgress.lastUpdated = Date.now();

      setUserProgressToStorage(state.userProgress);
    },
    setUserTarget: (state, action: PayloadAction<string>) => {
      state.userProgress.target = action.payload;
      state.userProgress.lastUpdated = Date.now();

      setUserProgressToStorage(state.userProgress);
    },
    setUserStartDate: (state, action: PayloadAction<number>) => {
      state.userProgress.startDate = action.payload;
      state.userProgress.lastUpdated = Date.now();

      setUserProgressToStorage(state.userProgress);
    },
    setUserExamDate: (state, action: PayloadAction<number>) => {
      state.userProgress.examDate = action.payload;
      state.userProgress.lastUpdated = Date.now();

      setUserProgressToStorage(state.userProgress);
    },
    clearUserProgress: (state) => {
      state.userProgress = initialState.userProgress;
      setUserProgressToStorage(state.userProgress);
    },
  },
});

export const { setUserProgress, setUserLevel, setUserTarget, setUserStartDate, setUserExamDate, clearUserProgress } = userProgressSlice.actions;
export default userProgressSlice.reducer;
