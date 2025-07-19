import React from "react";
import { View, Text } from "react-native";

export enum Sender {
  USER = "user",
  BOT = "bot",
}

interface ChatBubbleProps {
  message: {
    id: number;
    text: string;
    sender: Sender;
  };
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  return (
    <View
      style={{
        backgroundColor: message.sender === Sender.USER ? "#007AFF" : "#E5E5E5",
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        alignSelf: message.sender === Sender.USER ? "flex-end" : "flex-start",
      }}
    >
      <Text
        style={{ color: message.sender === Sender.USER ? "white" : "black" }}
      >
        {message.text}
      </Text>
    </View>
  );
};
