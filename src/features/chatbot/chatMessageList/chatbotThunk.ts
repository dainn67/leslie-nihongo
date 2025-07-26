import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiConfig } from "../../../config/apiConfig";
import { ChatMessage, createChatMessage, Sender } from "../../../models/chatMessage";
import Constants from "expo-constants";

const { DIFY_API_KEY } = Constants.expoConfig?.extra ?? {};

export const sendMessageThunk = createAsyncThunk("chatbot/sendMessage", async (message: ChatMessage): Promise<ChatMessage> => {
  const res = await fetch(ApiConfig.difyServerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DIFY_API_KEY}`,
    },
    body: JSON.stringify({
      query: message.fullText,
      inputs: {},
      response_mode: "blocking",
      user: "dainn",
      auto_generate_name: false,
    }),
  });

  const data = await res.json();

  const usage = data.metadata.usage;

  console.log(`Tokens: ${usage.prompt_tokens} prompt, ${usage.completion_tokens} completions => ${usage.total_price} ${usage.currency}`);

  return createChatMessage({
    id: data.message_id,
    fullText: data.answer.trim(),
    sender: Sender.BOT,
    createdAt: new Date().toISOString(),
  });
});
