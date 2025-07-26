import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage, createChatMessage, MessageType, Sender, SuggestedAction } from "../../../models/chatMessage";

type ChatState = {
  messages: ChatMessage[];
  suggestedPropmpt: string[];
  isLoading: boolean;
};

const initialState: ChatState = {
  messages: [],
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
    updateLastMessageData: (
      state,
      action: PayloadAction<{
        messageId?: string;
        nextWord?: string;
        loading?: boolean;
        messageType?: MessageType;
        fullText?: string;
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
        if (action.payload.suggestedActions !== undefined) {
          message.suggestedActions = action.payload.suggestedActions.map((action) => ({
            id: action["id"],
            title: action["title"],
          }));
        }
      }
    },

    clearChat: () => initialState,
  },
});

export const { clearChat, addMessage, addLoading, updateLastMessageData } = chatbotSlice.actions;

export default chatbotSlice.reducer;
