import { useTheme } from "@react-navigation/native";
import React from "react";
import { View, Text } from "react-native";
import { Sender } from "../../../features/chatbot/types";

interface ChatBubbleProps {
  id: string;
  text: string;
  sender: Sender;
}

export const ChatBubble = ({ id, text, sender }: ChatBubbleProps) => {
  const { colors } = useTheme();
  const isUser = sender === Sender.USER;
  return (
    <View
      id={id}
      style={{
        backgroundColor: isUser ? colors.primary : colors.background,
        borderTopLeftRadius: isUser ? 16 : 4,
        borderTopRightRadius: isUser ? 4 : 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        padding: 16,
        marginLeft: isUser ? 48 : 0,
        marginRight: isUser ? 0 : 48,
        marginVertical: 8,
        alignSelf: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Text style={{ color: isUser ? "white" : "black" }}>{text}</Text>
    </View>
  );
};
