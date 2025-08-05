import { ChatMessage, Sender } from "../models/chatMessage";
import { createQuestion, Question } from "../models/question";
import { Delimiter } from "./chatMessageService";

export const extractQuestionsFromJson = (json: string): { questions: Question[]; summary: string } => {
  const dataString = json.replaceAll("```json", "").replaceAll("```", "").trim();
  const data = JSON.parse(dataString);
  const questions: Question[] = data["questions"].map((question: any, index: number) =>
    createQuestion({ ...question, questionId: Date.now() + index }),
  );
  const summary = data["summary"];

  return { questions, summary };
};

export const extractSuggestedActions = (fullText: string) => {
  const splittedText = fullText.split(Delimiter);
  if (splittedText.length > 2) {
    const suggestedActions = splittedText
      .slice(1, -1) // Remove the response and the summary
      .map((text) => {
        // Split by "-" or ":"
        let data = text.split("-");
        if (data.length < 2) data = text.split(":");
        if (data.length < 2) return { title: text };

        const [id, title] = data;
        return { id: id.trim(), title: title.trim() };
      })
      .filter((action) => action.title !== undefined && action.title !== null);

    return suggestedActions;
  }

  return [];
};

export const createConversationHistory = (messages: ChatMessage[]) => {
  return messages
    .slice(-10)
    .map((m) => {
      const senderString = m.sender == Sender.BOT ? "Chatbot" : "User";
      let text = `(${senderString}): ${m.sender == Sender.BOT ? m.summary : m.fullText}`;
      if (text.endsWith(".")) text = text.slice(0, -1);
      return text;
    })
    .join(". ");
};

export const createReviseQuestionSet = (questions: Question[], amount: number): Question[] => {
  return questions.sort(() => Math.random() - 0.5).slice(0, amount);
};

export const createResultSummary = (questions: Question[], mapAnswers: { [key: number]: number }) => {
  let summary = "";

  for (const [index, question] of questions.entries()) {
    let questionString = `Question ${index + 1}: ${question.question}`.replaceAll("\n", " ");
    let answerString = "";

    const answerId = mapAnswers[question.questionId];

    const correctAnswer = question.answers.find((a) => a.isCorrect);
    const userAnswer = question.answers.find((a) => a.answerId === answerId);

    if (answerId === undefined) {
      answerString = "User skip this question";
    } else if (answerId === correctAnswer?.answerId) {
      answerString = `User correctly answered ${userAnswer?.text}`;
    } else {
      answerString = `User answered ${userAnswer?.text} but correct answer is ${correctAnswer?.text}`;
    }

    summary += `${questionString}. ${answerString}. `;
  }

  return summary;
};
