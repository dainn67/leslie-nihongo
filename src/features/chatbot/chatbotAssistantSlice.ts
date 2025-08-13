import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "../../models/chatMessage";

type ChatAssistantState = {
  messages: { [key: string]: ChatMessage[] };
  conversationId?: string;
  suggestedPropmpt: string[];
  conversationSummary: string;
};

const initialState: ChatAssistantState = {
  messages: {},
  conversationId: undefined,
  suggestedPropmpt: [],
  conversationSummary: "",
};

export const getMessagesByQuestionId = (state: ChatAssistantState, questionId: string) => state.messages[questionId] || [];

export const getLatestMessageByQuestionId = (state: ChatAssistantState, questionId: string) => {
  const messages = getMessagesByQuestionId(state, questionId);
  return messages.length > 0 ? messages[messages.length - 1] : null;
};

const chatbotAssistantSlice = createSlice({
  name: "chatbotAssistantState",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<{ questionId: string; message: ChatMessage }>) => {
      const { questionId, message } = action.payload;
      state.messages[questionId] = [...getMessagesByQuestionId(state, questionId), message];
    },
  },
});

export const { addMessage } = chatbotAssistantSlice.actions;
export default chatbotAssistantSlice.reducer;
