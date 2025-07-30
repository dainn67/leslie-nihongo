import { Answer, createAnswer } from "./answer";

export enum QuestionType {
  Vocabulary = "vocabulary",
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
    explanation: partial?.explanation ?? "",
    bookmarked: partial?.bookmarked ?? false,
    type: partial?.type ?? QuestionType.Vocabulary,
    answers: partial?.answers ? partial.answers.map((a) => createAnswer(a)).sort(() => Math.random() - 0.5) : [],
  };
};
