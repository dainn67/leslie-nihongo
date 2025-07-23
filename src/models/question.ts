export type Question = {
  question: string;
  answer: {
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
};
