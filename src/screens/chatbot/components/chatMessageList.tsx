import React, { useRef, useEffect } from "react";
import { ChatBubble } from "./chatBubble";
import { ScrollView } from "react-native";
import { useAppSelector } from "../../../hooks/hooks";
import { useTheme } from "../../../theme";

export interface ChatMessageListRef {
  scrollToBottom: () => void;
}

export const ChatMessageList = () => {
  const messages = useAppSelector((state) => state.chatbot.messages);
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useTheme();

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingBottom: 20, // Add some padding at bottom for better UX
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
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
    </>
  );
};
