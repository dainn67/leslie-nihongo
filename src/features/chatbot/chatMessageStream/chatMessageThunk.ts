import { ApiConfig } from "../../../config/apiConfig";
import { connectSSE } from "../../../api/sseClient";
import { setIsStreaming } from "./chatMessageSlice";
import { AppDispatch } from "../../../app/store";
import { splitCustomWords } from "../../../utils/utils";
import Constants from "expo-constants";
import {
  updateLatestStream,
  updateLatestMessageIndex,
} from "../chatMessageList/chatbotSlice";

const { DIFY_API_KEY } = Constants.expoConfig?.extra ?? {};

export const sendStreamMessageThunk = (
  message: string,
  dispatch: AppDispatch
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
      inputs: {},
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
        dispatch(updateLatestMessageIndex({ messageId }));
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
      clearInterval(interval);
    }
  }, 20);
};
