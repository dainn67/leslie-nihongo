import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import chatbotReducer from "../features/chatbot/chatbotSlice";

export const store = configureStore({
  reducer: { counter: counterReducer, chatbot: chatbotReducer },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
