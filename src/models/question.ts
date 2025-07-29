import { Answer } from "./answer";

export enum QuestionType {
  Vocab = "vocab",
  Grammar = "grammar",
  ReadingComprehension = "reading_comprehension",
  Listening = "listening",
}

export type Question = {
  questionId: number;
  question: string;
  answers: Answer[];
  explanation: string;
  bookmarked: boolean;
  type: QuestionType;
};

export const createQuestion = (partial?: Partial<Question>): Question => {
  return {
    questionId: partial?.questionId ?? Date.now(),
    question: partial?.question ?? "",
    answers: partial?.answers ?? [],
    explanation: partial?.explanation ?? "",
    bookmarked: partial?.bookmarked ?? false,
    type: partial?.type ?? QuestionType.Vocab,
  };
};
