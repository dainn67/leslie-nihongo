import { splitCustomWords } from "../utils/utils";

export enum Sender {
  USER = "user",
  BOT = "bot",
}

export enum MessageType {
  STREAM_TEXT = "stream_text",
  QUESTION_JSON = "question_json",
}

export type ChatMessage = {
  id: string;

  // Streaming text
  words: string[];
  currentIndex: number;
  fullText: string;
  wordsLength: number;

  // Loading status
  loading: boolean;
  loadingText: string;

  // Suggested actions
  suggestedActions: SuggestedAction[];

  // Type and sender
  messageType: MessageType;
  sender: Sender;

  // Id when click suggested action
  actionId: number;

  // Timestamp
  createdAt: string;
};

export const createChatMessage = (partial?: Partial<ChatMessage>): ChatMessage => {
  const fullText = partial?.fullText ?? "";
  const words = partial?.words ?? splitCustomWords(fullText);
  const timestamp = new Date().toISOString();
  return {
    id: partial?.id ?? timestamp,
    fullText,
    words,
    currentIndex: partial?.currentIndex ?? 0,
    wordsLength: partial?.wordsLength ?? words.length,
    suggestedActions: partial?.suggestedActions ?? [],
    sender: partial?.sender ?? Sender.USER,
    actionId: partial?.actionId ?? 0,
    loading: partial?.loading ?? false,
    loadingText: partial?.loadingText ?? "Thinking",
    messageType: partial?.messageType ?? MessageType.STREAM_TEXT,
    createdAt: partial?.createdAt ?? timestamp,
  };
};

export type SuggestedAction = {
  id: string;
  title: string;
};

export const Delimiter = "--//--";
