import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage, createChatMessage, MessageType, Sender, SuggestedAction } from "../../../models/chatMessage";
import { Question } from "../../../models/question";

type ChatState = {
  messages: ChatMessage[];
  conversationId?: string;
  suggestedPropmpt: string[];
  isLoading: boolean;
};

const initialState: ChatState = {
  messages: [],
  conversationId: undefined,
  suggestedPropmpt: [],
  isLoading: false,
};

const getLastMessage = (state: ChatState) => {
  const index = state.messages.length - 1;
  if (index !== -1) {
    return state.messages[index];
  }
  return null;
};

const chatbotSlice = createSlice({
  name: "chatbotState",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    addLoading: (state) => {
      state.messages.push(
        createChatMessage({
          loading: true,
          sender: Sender.BOT,
        })
      );
    },
    updateConversationId: (state, action: PayloadAction<string>) => {
      state.conversationId = action.payload;
    },
    updateLastMessageData: (
      state,
      action: PayloadAction<{
        messageId?: string;
        nextWord?: string;
        loading?: boolean;
        messageType?: MessageType;
        fullText?: string;
        questions?: Question[];
        suggestedActions?: SuggestedAction[];
      }>
    ) => {
      const message = getLastMessage(state);
      if (message) {
        if (action.payload.messageId !== undefined) message.id = action.payload.messageId;
        if (action.payload.loading !== undefined) message.loading = action.payload.loading;
        if (action.payload.messageType !== undefined) message.messageType = action.payload.messageType;
        if (action.payload.fullText !== undefined) message.fullText = action.payload.fullText;
        if (action.payload.nextWord !== undefined) message.words.push(action.payload.nextWord);
        if (action.payload.questions !== undefined) message.questions = action.payload.questions;
        if (action.payload.suggestedActions !== undefined) message.suggestedActions = action.payload.suggestedActions;
      }
    },

    clearChat: () => initialState,
  },
});

export const { clearChat, addMessage, addLoading, updateLastMessageData, updateConversationId } = chatbotSlice.actions;

export default chatbotSlice.reducer;
