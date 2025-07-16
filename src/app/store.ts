import { configureStore } from "@reduxjs/toolkit";
import { counterSlice, walletSlice } from "../features/counter/counterSlice";
import testCounterSlice from "../features/testCounter/testCounterSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    wallet: walletSlice.reducer,
  },
});

export const testStore = configureStore({
  reducer: {
    testCounter: testCounterSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
