import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage, createChatMessage, MessageType, Sender, SuggestedAction } from "../types";

type ChatState = {
  messages: ChatMessage[];
  isLoading: boolean;
};

const initialState: ChatState = {
  messages: [],
  isLoading: false,
};

const chatbotSlice = createSlice({
  name: "chatbotState",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    addLoading: (state, action: PayloadAction<{ loadingText: string }>) => {
      state.messages.push(
        createChatMessage({
          loading: true,
          sender: Sender.BOT,
          loadingText: action.payload.loadingText,
        })
      );
    },
    updateLastStream: (state, action: PayloadAction<{ word: string }>) => {
      const index = state.messages.length - 1;
      if (index !== -1) {
        const message = state.messages[index];
        message.words.push(action.payload.word);
      }
    },
    updateLastMessageId: (state, action: PayloadAction<{ messageId: string }>) => {
      const index = state.messages.length - 1;
      if (index !== -1) {
        const message = state.messages[index];
        message.id = action.payload.messageId;
      }
    },
    updateLastSuggestedActions: (
      state,
      action: PayloadAction<{ suggestedActions: SuggestedAction[] }>
    ) => {
      const index = state.messages.length - 1;
      if (index !== -1) {
        const message = state.messages[index];
        message.suggestedActions = action.payload.suggestedActions.map((action) => ({
          id: action["id"],
          title: action["title"],
        }));
      }
    },
    updateLastMessageType: (state) => {
      const index = state.messages.length - 1;
      if (index !== -1) {
        const message = state.messages[index];

        // Only update if not already a question json
        if (message.messageType === MessageType.STREAM_TEXT)
          message.messageType = MessageType.QUESTION_JSON;
      }
    },
    updateLastLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      const index = state.messages.length - 1;
      if (index !== -1) {
        const message = state.messages[index];
        message.loading = action.payload.loading;
      }
    },
    updateLastFullText: (state, action: PayloadAction<{ fullText: string }>) => {
      const index = state.messages.length - 1;
      if (index !== -1) {
        const message = state.messages[index];
        message.fullText = action.payload.fullText;
      }
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
