import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiConfig } from "../../../config/apiConfig";
import { connectSSE } from "../../../api/sseClient";
import { setIsStreaming, updateMessage } from "./chatMessageSlice";

export const sendStreamMessageThunk = createAsyncThunk(
  "chatbot/sendStreamMessage",
  async (message: string, { dispatch }) => {
    const tmpToken = "app-2ZcpMxM7MQsCZiyt2lCI8dTb";

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
        dispatch(updateMessage(data));
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
);
