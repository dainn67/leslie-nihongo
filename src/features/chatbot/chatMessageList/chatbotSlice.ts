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
    updateLastStream: (state, action: PayloadAction<{ word: string }>) => {
      const message = getLastMessage(state);
      if (message) message.words.push(action.payload.word);
    },
    updateLastMessageId: (state, action: PayloadAction<{ messageId: string }>) => {
      const message = getLastMessage(state);
      if (message) message.id = action.payload.messageId;
    },
    updateLastSuggestedActions: (state, action: PayloadAction<{ suggestedActions: SuggestedAction[] }>) => {
      const message = getLastMessage(state);
      if (message) {
        message.suggestedActions = action.payload.suggestedActions.map((action) => ({
          id: action["id"],
          title: action["title"],
        }));
      }
    },
    updateLastMessageType: (state) => {
      const message = getLastMessage(state);
      if (message) message.messageType = MessageType.QUESTION_JSON;
    },
    updateLastLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      const message = getLastMessage(state);
      if (message) message.loading = action.payload.loading;
    },
    updateLastFullText: (state, action: PayloadAction<{ fullText: string }>) => {
      const message = getLastMessage(state);
      if (message) message.fullText = action.payload.fullText;
    },
    clearChat: () => initialState,
  },
});

export const {
  clearChat,
  addMessage,
  addLoading,
  updateLastStream,
  updateLastMessageId,
  updateLastSuggestedActions,
  updateLastMessageType,
  updateLastLoading,
  updateLastFullText,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
