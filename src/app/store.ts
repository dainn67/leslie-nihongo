import { configureStore } from "@reduxjs/toolkit";
import chatbotReducer from "../features/chatbot/chatbotSlice";
import themeReducer from "../features/theme/themeSlice";
import userProgressReducer from "../features/userProgress/userProgressSlice";
import questionReducer from "../features/questions/questionSlice";

export const store = configureStore({
  reducer: {
    chatbot: chatbotReducer,
    userProgress: userProgressReducer,
    theme: themeReducer,
    questions: questionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
