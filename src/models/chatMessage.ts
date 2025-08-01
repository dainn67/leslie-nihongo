import { splitCustomWords } from "../service/chatMessageService";
import { Question } from "./question";

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

  // Data
  questions: Question[];
  suggestedActions: SuggestedAction[];

  // Type and sender
  messageType: MessageType;
  sender: Sender;

  // Id when click suggested action
  actionId: number;
  summary: string;

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
    questions: partial?.questions ?? [],
    suggestedActions: partial?.suggestedActions ?? [],
    sender: partial?.sender ?? Sender.USER,
    actionId: partial?.actionId ?? 0,
    summary: partial?.summary ?? "",
    loading: partial?.loading ?? false,
    messageType: partial?.messageType ?? MessageType.STREAM_TEXT,
    createdAt: partial?.createdAt ?? timestamp,
  };
};

export type SuggestedAction = {
  id?: string;
  title: string;
};
