import { createQuestion, Question } from "../models/question";

export const extractQuestionsFromJson = (json: string): Question[] => {
  const data = json.replaceAll("```json", "").replaceAll("```", "");
  const questions: Question[] = JSON.parse(data).map((question: any, index: number) =>
    createQuestion({ ...question, questionId: Date.now() + index })
  );

  return questions;
};
