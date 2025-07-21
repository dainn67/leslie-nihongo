import { ApiConfig } from "../../../config/apiConfig";
import { connectSSE } from "../../../api/sseClient";
import { setIsStreaming, updateMessage } from "./chatMessageSlice";
import { AppDispatch } from "../../../app/store";
import { splitCustomWords } from "../../../utils/utils";

export const sendStreamMessageThunk = (
  message: string,
  dispatch: AppDispatch
) => {
  const tmpToken = "app-2ZcpMxM7MQsCZiyt2lCI8dTb";

  let fullText = "";
  let wordIndex = 0;
  let wordLength = 0;

  connectSSE(
    ApiConfig.difyServerUrl,
    tmpToken,
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
      console.log("fullText:", fullText);
    },
    () => {
      wordLength = splitCustomWords(fullText).length;
      console.log("wordLength:", wordLength);
    },
    (error) => {
      console.log("SSE error", error);
    }
  );

  //   console.log("Looping...");

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
