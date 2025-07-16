import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const testCounterSlice = createSlice({
  name: "testCounter",
  initialState,
  reducers: {
    testIncrement: (state) => {
      state.value + 1;
    },
    testDecrement: (state) => {
      state.value - 1;
    },
    testAdd: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { testIncrement, testDecrement, testAdd } =
  testCounterSlice.actions;

export default testCounterSlice.reducer;
