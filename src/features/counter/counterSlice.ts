import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialCounterState: CounterState = {
  value: 0,
};

interface WalletState {
  balance: number;
}

const initialWalletState: WalletState = {
  balance: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState: initialCounterState,
  reducers: {
    counterIncrement: (state) => {
      state.value += 1;
    },
    counterDecrement: (state) => {
      state.value -= 1;
    },
    counterIncrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    counterDecrementByAmount: (state, action) => {
      state.value -= action.payload;
    },
  },
});

const walletSlice = createSlice({
  name: "wallet",
  initialState: initialWalletState,
  reducers: {
    incrementWallet: (state) => {
      state.balance += 1;
    },
    decrementWallet: (state) => {
      state.balance -= 1;
    },
  },
});

export const {
  counterIncrement,
  counterDecrement,
  counterIncrementByAmount,
  counterDecrementByAmount,
} = counterSlice.actions;

export const { incrementWallet, decrementWallet } = walletSlice.actions;

export { counterSlice, walletSlice };
