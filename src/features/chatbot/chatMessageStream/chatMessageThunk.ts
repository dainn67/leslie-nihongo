import { ApiConfig } from "../../../config/apiConfig";
import { connectSSE } from "../../../api/sseClient";
import { setIsStreaming } from "./chatMessageSlice";
import { AppDispatch } from "../../../app/store";
import { splitCustomWords } from "../../../utils/utils";
import Constants from "expo-constants";

const { DIFY_API_KEY } = Constants.expoConfig?.extra ?? {};

export const sendStreamMessageThunk = (
  message: string,
  dispatch: AppDispatch
) => {
  let fullText = "";
  let wordIndex = 0;
  let wordLength = 0;

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
      console.log("SSE connected");
    },
    (data) => {
      const type = data["event"];
      const text = data["answer"];

      if (type === "message") fullText += text;
    },
    () => {
      wordLength = splitCustomWords(fullText).length;
    },
    (error) => {
      console.log("SSE error", error);
    }
  );

  const interval = setInterval(() => {
    const words = splitCustomWords(fullText);

    // Skip if new text haven't arrived yet
    if (words.length > wordIndex + 1) {
      const nextWord = words[wordIndex];
      console.log("NEXT WORD:", nextWord);

      wordIndex++;
    }

    if (wordLength > 0 && wordIndex == words.length - 1) {
      console.log("Last word: ", words[wordIndex]);
      clearInterval(interval);
    }
  }, 100);
};
