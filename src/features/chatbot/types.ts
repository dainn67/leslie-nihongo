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
  suggestedActions: SuggestedAction[];
  sender: Sender;
  loadingText: string;
  actionId: number;
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
    suggestedActions: partial?.suggestedActions ?? [],
    sender: partial?.sender ?? Sender.USER,
    actionId: partial?.actionId ?? 0,
    loading: partial?.loading ?? false,
    loadingText: partial?.loadingText ?? "Thinking",
    createdAt: partial?.createdAt ?? timestamp,
  };
};

export type SuggestedAction = {
  id: number;
  title: string;
};

export const Delimiter = "--//--";
