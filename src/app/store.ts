import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import chatbotReducer from "../features/chatbot/chatMessageList/chatbotSlice";
import themeReducer from "../features/theme/themeSlice";
import chatMessageReducer from "../features/chatbot/chatMessageStream/chatMessageSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    chatbot: chatbotReducer,
    chatMessage: chatMessageReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
