import { Answer } from "./answer";

export type Question = {
  questionId: number;
  question: string;
  answers: Answer[];
  explanation: string;
  bookmarked: boolean;
  type: "vocab" | "grammar" | "reading_comprehension" | "listening";
};

export const createQuestion = (partial?: Partial<Question>): Question => {
  return {
    questionId: partial?.questionId ?? Date.now(),
    question: partial?.question ?? "",
    answers: partial?.answers ?? [],
    explanation: partial?.explanation ?? "",
    bookmarked: partial?.bookmarked ?? false,
    type: partial?.type ?? "vocab",
  };
};
