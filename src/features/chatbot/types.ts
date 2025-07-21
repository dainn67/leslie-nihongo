import { splitCustomWords } from "../../utils/utils";

export enum Sender {
  USER = "user",
  BOT = "bot",
}

export type ChatMessage = {
  id: string;
  words: string[];
  fullText: string;
  currentIndex: number;
  wordsLength: number;
  sender: Sender;
  loading: boolean;
  createdAt: string;
};

export const createChatMessage = (
  partial?: Partial<ChatMessage>
): ChatMessage => {
  const fullText = partial?.fullText ?? "";
  const words = partial?.words ?? splitCustomWords(fullText);
  const timestamp = new Date().toISOString();
  return {
    id: partial?.id ?? timestamp,
    fullText,
    words,
    currentIndex: partial?.currentIndex ?? 0,
    wordsLength: partial?.wordsLength ?? words.length,
    sender: partial?.sender ?? Sender.USER,
    loading: partial?.loading ?? false,
    createdAt: partial?.createdAt ?? timestamp,
  };
};
