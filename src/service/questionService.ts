import { ChatMessage, Sender } from "../models/chatMessage";
import { createQuestion, Question, QuestionType } from "../models/question";
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
