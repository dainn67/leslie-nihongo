import { configureStore } from "@reduxjs/toolkit";
import chatbotReducer from "../features/chatbot/chatMessageList/chatbotSlice";
import themeReducer from "../features/theme/themeSlice";
import chatMessageReducer from "../features/chatbot/chatMessageStream/chatMessageSlice";
import userProgressReducer from "../features/chatbot/chatMessageList/userProgressSlice";

export const store = configureStore({
  reducer: {
    chatbot: chatbotReducer,
    chatMessage: chatMessageReducer,
    userProgress: userProgressReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
