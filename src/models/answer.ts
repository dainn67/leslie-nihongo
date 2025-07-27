export type Answer = {
  answerId: number;
  text: string;
  questionId: number;
  isCorrect: boolean;
};

export const createAnswer = (partial?: Partial<Answer>): Answer => {
  return {
    answerId: partial?.answerId ?? Date.now(),
    text: partial?.text ?? "",
    questionId: partial?.questionId ?? 0,
    isCorrect: partial?.isCorrect ?? false,
  };
};
