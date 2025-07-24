export type Question = {
  id: string;
  question: string;
  answers: {
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
};
