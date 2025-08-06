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

export enum MessageStatus {
  USER,
  LOADING,
  STREAMING,
  DONE,
}

export type ChatMessage = {
  id: string;

  // Streaming text
  words: string[];
  fullText: string;
  wordsLength: number;

  // Data
  questions: Question[];
  suggestedActions: SuggestedAction[];

  // Type and sender
  messageType: MessageType;
  sender: Sender;
  status: MessageStatus;

  // Id when click suggested action
  actionId: number;
  summary: string;

  hasError: boolean;

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
    wordsLength: partial?.wordsLength ?? words.length,
    questions: partial?.questions ?? [],
    suggestedActions: partial?.suggestedActions ?? [],
    sender: partial?.sender ?? Sender.USER,
    actionId: partial?.actionId ?? 0,
    summary: partial?.summary ?? "",
    messageType: partial?.messageType ?? MessageType.STREAM_TEXT,
    status: partial?.status ?? MessageStatus.USER,
    hasError: partial?.hasError ?? false,
    createdAt: partial?.createdAt ?? timestamp,
  };
};

export type SuggestedAction = {
  id?: string;
  title: string;
};
