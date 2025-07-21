import React, { useRef, useEffect } from "react";
import { ChatBubble } from "./chatBubble";
import { ScrollView, View, StyleSheet } from "react-native";
import { useAppSelector } from "../../../hooks/hooks";
import { useTheme } from "../../../theme";

export const ChatMessageList = () => {
  const messages = useAppSelector((state) => state.chatbot.messages);
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useTheme();

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages.length]);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {messages.map((message, index) => (
          <ChatBubble key={index} message={message} />
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
