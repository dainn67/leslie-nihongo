import { configureStore } from "@reduxjs/toolkit";
import chatbotReducer from "../features/chatbot/chatbotSlice";
import chatbotAssistantReducer from "../features/chatbot/chatbotAssistantSlice";
import themeReducer from "../features/theme/themeSlice";
import userProgressReducer from "../features/userProgress/userProgressSlice";
import questionReducer from "../features/questions/questionSlice";
import gameReducer from "../features/game/gameSlice";

export const store = configureStore({
  reducer: {
    chatbot: chatbotReducer,
    chatbotAssistant: chatbotAssistantReducer,
    userProgress: userProgressReducer,
    theme: themeReducer,
    questions: questionReducer,
    game: gameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
