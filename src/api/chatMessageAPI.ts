import { connectSSE } from "./sseClient";
import { AppDispatch } from "../app/store";
import { ApiConfig } from "../constants/apiConfig";
import { updateConversationId, updateLastMessageData } from "../features/chatbot/chatbotSlice";
import { MessageType } from "../models/chatMessage";
import { extractQuestionsFromJson, extractSuggestedActions } from "../service/questionService";
import { Delimiter, splitCustomWords } from "../service/chatMessageService";
import { convertDateToDDMMYYYY } from "../utils/utils";
import Constants from "expo-constants";

const { DIFY_API_KEY } = Constants.expoConfig?.extra ?? {};

export const sendStreamMessage = ({
  message,
  conversationHistory,
  actionId,
  level,
  target,
  examDate,
  conversationId,
  dispatch,
}: {
  message?: string;
  conversationHistory?: string;
  actionId?: string;
  level?: string;
  target?: string;
  examDate?: number;
  conversationId?: string;
  dispatch: AppDispatch;
}) => {
  let fullText = "";
  let wordIndex = 0;
  let wordLength = 0;
  let isQuestionJson = false;
  let startReceiveMessage = false;

  const now = convertDateToDDMMYYYY(new Date());

  let examDateString = "";
  if (examDate == 0) {
    examDateString = "User hasn't decided exam date yet";
  } else if (examDate) {
    examDateString = `Current date is ${now} and user JLPT exam date is ${convertDateToDDMMYYYY(new Date(examDate))}`;
  }

  // Original stream
  connectSSE({
    url: ApiConfig.difyServerUrl,
    token: DIFY_API_KEY,
    body: {
      query: message ?? "<init>",
      inputs: {
        level: level,
        target: target,
        action_id: actionId,
        conversation_history: conversationHistory,
        current_date: now,
        exam_date: examDateString,
      },
      conversation_id: conversationId,
      response_mode: "streaming",
      user: "dainn",
      auto_generate_name: false,
    },
    onMessage: (data) => {
      const type = data["event"];
      const messageId = data["message_id"];
      const text = data["answer"];
      const conversationId = data["conversation_id"];

      if (type === "message") {
        const jsonPattern = "``";

        if (!isQuestionJson && text.includes(jsonPattern)) {
          dispatch(updateLastMessageData({ messageType: MessageType.QUESTION_JSON }));
          isQuestionJson = true;
        }

        fullText += text;
      } else if (type === "workflow_started") {
        startReceiveMessage = true;
        dispatch(updateLastMessageData({ messageId }));
        dispatch(updateConversationId(conversationId));
      }
    },
    onDone: () => {
      wordLength = splitCustomWords(fullText).length;
      dispatch(updateLastMessageData({ fullText: fullText, loading: false }));
      if (isQuestionJson) {
        const { questions, summary } = extractQuestionsFromJson(fullText);
        dispatch(updateLastMessageData({ questions, summary }));
      }
    },
    onError: (error) => console.log("SSE error", error),
  });

  const waitCondition = setInterval(() => {
    if (startReceiveMessage) {
      clearInterval(waitCondition);

      let startStreaming = false;
      const interval = setInterval(() => {
        if (isQuestionJson) clearInterval(interval);

        // Split word every time update to find latest words
        const words = splitCustomWords(fullText);

        // Skip if new text haven't arrived yet
        if (words.length >= wordIndex + 1) {
          // Start streaming
          if (!startStreaming) {
            if (!isQuestionJson) dispatch(updateLastMessageData({ loading: false }));
            startStreaming = true;
          }

          const nextWord = words[wordIndex];
          dispatch(updateLastMessageData({ nextWord }));

          wordIndex++;

          // Stop interval at lastword, after original stream is done
          if (wordLength > 0 && wordIndex == wordLength - 1) {
            const lastWord = words[wordIndex];
            dispatch(updateLastMessageData({ nextWord: lastWord }));

            const splittedText = fullText.split(Delimiter);
            // Extract the suggested actions here to wait for the stream to finish
            const suggestedActions = extractSuggestedActions(fullText);
            dispatch(updateLastMessageData({ suggestedActions }));

            // Extract the summary when finished
            const summary = splittedText[splittedText.length - 1].trim();
            dispatch(updateLastMessageData({ summary }));

            clearInterval(interval);
          }
        }

        if (wordLength > 0 && wordIndex + 1 > wordLength) {
          const splittedText = fullText.split(Delimiter);
          // Extract the suggested actions here to wait for the stream to finish
          const suggestedActions = extractSuggestedActions(fullText);
          dispatch(updateLastMessageData({ suggestedActions }));

          // Extract the summary when finished
          const summary = splittedText[splittedText.length - 1].trim();
          dispatch(updateLastMessageData({ summary }));

          clearInterval(interval);
        }
      }, 20);
    }
  }, 200);
};
