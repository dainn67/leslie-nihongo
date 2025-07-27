export type Question = {
  questionId: number;
  question: string;
  answers: {
    text: string;
    isCorrect: boolean;
  }[];
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
