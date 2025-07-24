import React, { useRef, useEffect } from "react";
import { MainChatMessage } from "./chatBubble/MainChatMessage";
import { ScrollView, View, StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useTheme } from "../../../theme";

interface ChatMessageListProps {
  handleClickAction: (actionId: string, title: string) => void;
}

export const ChatMessageList = ({ handleClickAction }: ChatMessageListProps) => {
  const messages = useAppSelector((state) => state.chatbot.messages);
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useTheme();

  const dispatch = useAppDispatch();

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
          <MainChatMessage
            key={index}
            isInitialMessage={index === 0}
            message={message}
            onClickAction={handleClickAction}
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
