import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatMessage, Sender } from "./types";

export const sendMessageThunk = createAsyncThunk(
  "chatbot/sendMessage",
  async (message: ChatMessage): Promise<ChatMessage> => {
    const tmpToken = "app-2ZcpMxM7MQsCZiyt2lCI8dTb";
    const res = await fetch(
      "http://test-practice-test.abc-elearning.org/v1/chat-messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tmpToken}`,
        },
        body: JSON.stringify({
          query: message.text,
          inputs: {},
          response_mode: "blocking",
          user: "dainn",
          auto_generate_name: false,
        }),
      }
    );

    const data = await res.json();

    const usage = data.metadata.usage;

    console.log(
      `Tokens: ${usage.prompt_tokens} prompt, ${usage.completion_tokens} completions => ${usage.total_price} ${usage.currency}`
    );

    return {
      id: data.message_id,
      text: data.answer.trim(),
      sender: Sender.BOT,
      createdAt: new Date().toISOString(),
    };
  }
);
