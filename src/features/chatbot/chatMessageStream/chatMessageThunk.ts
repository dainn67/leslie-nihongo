import { ApiConfig } from "../../../config/apiConfig";
import { connectSSE } from "../../../api/sseClient";
import { setIsStreaming } from "./chatMessageSlice";
import { AppDispatch } from "../../../app/store";
import { splitCustomWords } from "../../../utils/utils";
import Constants from "expo-constants";
import {
  updateLatestStream,
  updateLatestMessageId,
  updateLatestSuggestedActions,
} from "../chatMessageList/chatbotSlice";
import { Delimiter } from "../types";

const { DIFY_API_KEY } = Constants.expoConfig?.extra ?? {};

export const sendStreamMessageThunk = (
  message: string,
  dispatch: AppDispatch,
  isInitial?: boolean
) => {
  let fullText = "";
  let wordIndex = 0;
  let wordLength = 0;

  // Original stream
  connectSSE(
    ApiConfig.difyServerUrl,
    DIFY_API_KEY,
    {
      query: message,
      inputs: {
        is_initial: isInitial ? 1 : 0,
      },
      response_mode: "streaming",
      user: "dainn",
      auto_generate_name: false,
    },
    () => {
      dispatch(setIsStreaming(true));
    },
    (data) => {
      const type = data["event"];
      const messageId = data["message_id"];
      const text = data["answer"];

      if (type === "message") fullText += text;
      else if (type === "workflow_started") {
        dispatch(updateLatestMessageId({ messageId }));
      }
    },
    () => {
      wordLength = splitCustomWords(fullText).length;
    },
    (error) => {
      console.log("SSE error", error);
    }
  );

  const interval = setInterval(() => {
    // Split word every time update to find latest words
    const words = splitCustomWords(fullText);

    // Skip if new text haven't arrived yet
    if (words.length > wordIndex + 1) {
      const nextWord = words[wordIndex];
      dispatch(updateLatestStream({ word: nextWord }));

      wordIndex++;
    }

    // Stop interval at lastword, after original stream is done
    if (wordLength > 0 && wordIndex == words.length - 1) {
      dispatch(updateLatestStream({ word: words[wordIndex] }));

      const splittedText = fullText.split(Delimiter);
      if (splittedText.length > 3) {
        const suggestedActions = splittedText.slice(1).map((text) => {
          const [id, title] = text.split("-");
          return { id: parseInt(id), title };
        });
        dispatch(updateLatestSuggestedActions({ suggestedActions }));
      }

      clearInterval(interval);
    }
  }, 20);
};
