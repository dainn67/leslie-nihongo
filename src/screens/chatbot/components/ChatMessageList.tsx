import React, { useRef, useEffect, useState } from "react";
import { ChatMessageBubble } from "./chatBubble/ChatMessageBubble";
import { ScrollView, View, StyleSheet, LayoutChangeEvent } from "react-native";
import { useAppSelector } from "../../../hooks/hooks";
import { useTheme } from "../../../theme";
import { ChatMessage } from "../../../models/chatMessage";

interface ChatMessageListProps {
  messages: ChatMessage[];
  handleClickAction: (actionId: string, title: string) => void;
}

export const ChatMessageList = ({ messages, handleClickAction }: ChatMessageListProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useTheme();
  const [componentHeight, setComponentHeight] = useState(0);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages.length]);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setComponentHeight(height);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} onLayout={handleLayout}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {messages.map((message, index) => (
          <ChatMessageBubble
            key={index}
            isLastMessage={index === messages.length - 1}
            message={message}
            onClickAction={handleClickAction}
            componentHeight={componentHeight}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 8,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    borderRadius: 20,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
