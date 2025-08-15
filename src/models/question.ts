import { Answer, createAnswer } from "./answer";

export enum QuestionType {
  Vocabulary = "vocabulary",
  Grammar = "grammar",
  Reading = "reading",
  Listening = "listening",
}

export const QuestionTypeTitles: Record<QuestionType, string> = {
  [QuestionType.Vocabulary]: "Từ Vựng",
  [QuestionType.Grammar]: "Ngữ Pháp",
  [QuestionType.Reading]: "Đọc Hiểu",
  [QuestionType.Listening]: "Nghe Hiểu",
};

export type Question = {
  questionId: number;
  question: string;
  answers: Answer[];
  explanation: string;
  audio: string;
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
    audio: partial?.audio ?? "",
    answers: partial?.answers
      ? [...partial.answers]
          .sort(() => Math.random() - 0.5)
          .map((a, index) => createAnswer({ ...a, answerId: index, questionId: partial.questionId }))
      : [],
  };
};

export const createQuestionString = (question: Question) => {
  return `Question: ${question.question}. Answers: ${question.answers.map((a) => `${a.text}${a.isCorrect ? " (Correct)" : ""}`).join(". ")}. Explanation: ${question.explanation}`;
};
