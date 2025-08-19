import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createUserProgress, UserProgress } from "../../models/userProgress";
import { setUserProgressToStorage } from "../../service/userProgressSerivice";
import { normalizeDate } from "../../utils";

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
    updateUserProgress: (state, action: PayloadAction<Partial<UserProgress>>) => {
      const { analytic, ...rest } = action.payload;

      state.userProgress = { ...state.userProgress, ...rest };

      if (analytic) {
        const now = normalizeDate(new Date());
        state.userProgress.analytic = {
          ...state.userProgress.analytic,
          [now]: analytic,
        };
      }

      state.userProgress.lastUpdated = Date.now();
      setUserProgressToStorage(state.userProgress);
    },
    clearUserProgress: (state) => {
      state.userProgress = initialState.userProgress;
      setUserProgressToStorage(state.userProgress);
    },
  },
});

export const { setUserProgress, updateUserProgress, clearUserProgress } = userProgressSlice.actions;
export default userProgressSlice.reducer;
