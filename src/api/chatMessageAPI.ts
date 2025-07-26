import { connectSSE } from "./sseClient";
import { AppDispatch } from "../app/store";
import { ApiConfig } from "../config/apiConfig";
import { splitCustomWords } from "../utils/utils";
import { updateLastMessageData } from "../features/chatbot/chatMessageList/chatbotSlice";
import { Delimiter, MessageType } from "../models/chatMessage";
import Constants from "expo-constants";

const { DIFY_API_KEY } = Constants.expoConfig?.extra ?? {};

export const sendStreamMessage = ({
  message,
  dispatch,
  level,
  target,
}: {
  message: string;
  dispatch: AppDispatch;
  level?: string;
  target?: string;
}) => {
  let fullText = "";
  let wordIndex = 0;
  let wordLength = 0;
  let isQuestionJson = false;

  // Original stream
  connectSSE({
    url: ApiConfig.difyServerUrl,
    token: DIFY_API_KEY,
    body: {
      query: message,
      inputs: {
        level: level,
        target: target,
      },
      response_mode: "streaming",
      user: "dainn",
      auto_generate_name: false,
    },
    onOpen: () => {},
    onMessage: (data) => {
      const type = data["event"];
      const messageId = data["message_id"];
      const text = data["answer"];

      if (type === "message") {
        const jsonPattern = "``";

        if (!isQuestionJson && text.includes(jsonPattern)) {
          dispatch(updateLastMessageData({ messageType: MessageType.QUESTION_JSON }));
          isQuestionJson = true;
        }

        fullText += text;
      } else if (type === "workflow_started") {
        dispatch(updateLastMessageData({ messageId }));
      }
    },
    onClose: () => {
      wordLength = splitCustomWords(fullText).length;
      dispatch(updateLastMessageData({ fullText }));
    },
    onError: (error) => console.log("SSE error", error),
  });

  let start = false;

  const interval = setInterval(() => {
    // Split word every time update to find latest words
    const words = splitCustomWords(fullText);

    // Skip if new text haven't arrived yet
    if (words.length > wordIndex + 1) {
      // Start streaming
      if (!start) {
        dispatch(updateLastMessageData({ loading: false }));
        start = true;
      }

      const nextWord = words[wordIndex];
      dispatch(updateLastMessageData({ nextWord }));

      wordIndex++;

      // Stop interval at lastword, after original stream is done
      if (wordLength > 0 && wordIndex == words.length - 1) {
        const lastWord = words[wordIndex];
        dispatch(updateLastMessageData({ nextWord: lastWord }));

        const splittedText = fullText.split(Delimiter);
        if (splittedText.length > 3) {
          const suggestedActions = splittedText
            .slice(1)
            .map((text) => {
              const [id, title] = text.split("-");
              return { id, title };
            })
            .filter((action) => action.id !== undefined && action.id !== null && action.title !== undefined && action.title !== null);

          dispatch(updateLastMessageData({ suggestedActions }));
        }

        clearInterval(interval);
      }
    }
  }, 20);
};
