import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "../../models/chatMessage";

type ChatAssistantState = {
  messages: ChatMessage[];
  conversationId?: string;
  suggestedPropmpt: string[];
  conversationSummary: string;
};

const initialState: ChatAssistantState = {
  messages: [],
  conversationId: undefined,
  suggestedPropmpt: [],
  conversationSummary: "",
};

const getLatestMessage = (state: ChatAssistantState) => {
  const index = state.messages.length - 1;
  if (index !== -1) {
    return state.messages[index];
  }
  return null;
};

const chatbotAssistantSlice = createSlice({
  name: "chatbotAssistantState",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { addMessage } = chatbotAssistantSlice.actions;
export default chatbotAssistantSlice.reducer;
