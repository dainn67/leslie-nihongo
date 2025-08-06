import { connectSSE } from "./sseClient";
import { AppDispatch } from "../app/store";
import { ApiConfig } from "../constants/apiConfig";
import { updateConversationId, updateLastMessageData } from "../features/chatbot/chatbotSlice";
import { MessageStatus, MessageType } from "../models/chatMessage";
import { extractQuestionsFromJson, extractSuggestedActions } from "../service/questionService";
import { Delimiter, splitCustomWords } from "../service/chatMessageService";
import { convertDateToDDMMYYYY } from "../utils/utils";
import { postData } from "./apiClient";
import Constants from "expo-constants";

const { DIFY_API_KEY } = Constants.expoConfig?.extra ?? {};

const user = "dainn";

export const sendStreamMessage = ({
  message,
  conversationHistory,
  actionId,
  level,
  target,
  examDate,
  analyzeChatGame,
  conversationSummary,
  conversationId,
  dispatch,
}: {
  message?: string;
  conversationHistory?: string;
  conversationSummary?: string;
  actionId?: string;
  level?: string;
  target?: string;
  examDate?: number;
  analyzeChatGame?: boolean;
  conversationId?: string;
  dispatch: AppDispatch;
}) => {
  let fullText = "";
  let wordIndex = 0;
  let wordLength = 0;
  let isQuestionJson = false;
  let startReceiveMessage = false;
  let hasError = false;

  const now = convertDateToDDMMYYYY(new Date());

  let examDateString = "";
  if (examDate == 0) {
    examDateString = "User hasn't decided exam date yet";
  } else if (examDate) {
    const formattedExamDate = convertDateToDDMMYYYY(new Date(examDate));
    examDateString = `Current date is ${now} (d/m/y format) and user JLPT exam date is ${formattedExamDate}`;
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
        conversation_summary: conversationSummary,
        current_date: now,
        exam_date: examDateString,
        analyze_chat_game: analyzeChatGame ? 1 : 0,
      },
      conversation_id: conversationId,
      response_mode: "streaming",
      user: user,
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
      } else if (type === "message_end") {
        const usage = data["metadata"]["usage"];
        console.log(
          `Tokens: ${usage["total_tokens"]} (${usage["prompt_tokens"]} input, ${usage["completion_tokens"]} completion) => ${usage["total_price"]} ${usage["currency"]}`
        );
      }
    },
    onDone: () => {
      wordLength = splitCustomWords(fullText).length;
      dispatch(updateLastMessageData({ fullText: fullText }));
      if (isQuestionJson) {
        const { questions, summary } = extractQuestionsFromJson(fullText);
        dispatch(updateLastMessageData({ questions, summary, status: MessageStatus.DONE }));
      }
    },
    onError: (error) => {
      console.log("SSE error", error);
      if (!hasError) {
        hasError = true;
        dispatch(updateLastMessageData({ hasError: true }));
      }
    },
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
            if (!isQuestionJson) dispatch(updateLastMessageData({ status: MessageStatus.STREAMING }));
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
            dispatch(updateLastMessageData({ status: MessageStatus.DONE }));

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
          dispatch(updateLastMessageData({ status: MessageStatus.DONE }));

          clearInterval(interval);
        }
      }, 20);
    }
  }, 200);
};

export const sendMessage = async ({
  message,
  data,
}: {
  message: string;
  data?: { [key: string]: any };
  conversationId: string;
}) => {
  const result = await postData({
    url: ApiConfig.difyServerUrl,
    token: DIFY_API_KEY,
    body: {
      query: message,
      inputs: data ?? {},
      response_mode: "blocking",
      user: user,
      auto_generate_name: false,
    },
  });

  return result["answer"];
};
