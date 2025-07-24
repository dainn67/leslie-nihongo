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
      console.log("setUserLevel", action.payload);
      state.userProgress.level = action.payload;
      state.userProgress.lastUpdated = Date.now();
    },
    setUserTarget: (state, action: PayloadAction<string>) => {
      console.log("setUserTarget", action.payload);
      state.userProgress.target = action.payload;
      state.userProgress.lastUpdated = Date.now();
    },
    setUserStartDate: (state, action: PayloadAction<number>) => {
      console.log("setUserStartDate", action.payload);
      state.userProgress.startDate = action.payload;
      state.userProgress.lastUpdated = Date.now();
    },
    setUserExamDate: (state, action: PayloadAction<number>) => {
      console.log("setUserExamDate", action.payload);
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
