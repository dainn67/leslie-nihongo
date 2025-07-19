import React from "react";
import { ChatBubble } from "./chatBubble";

import { ScrollView } from "react-native";
import { useAppSelector } from "../../../hooks/hooks";

export const ChatMessageList = () => {
  const messages = useAppSelector((state) => state.chatbot.messages);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      contentContainerStyle={{
        paddingHorizontal: 8,
      }}
    >
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          id={message.id}
          text={message.text}
          sender={message.sender}
        />
      ))}
    </ScrollView>
  );
};
