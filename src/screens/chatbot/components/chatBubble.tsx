import React from "react";
import { View, StyleSheet } from "react-native";
import { Sender } from "../../../features/chatbot/types";
import { useTheme } from "../../../theme";
import { WordComponent } from "../../../components/streamingText/WordComponent";
import { ChatMessage } from "../../../features/chatbot/types";
import { LoadingText } from "./LoadingText";
import { ChatActionButtons } from "./ChatActionButtons";
import { CustomText } from "../../../components/text/customText";

interface ChatBubbleProps {
  message: ChatMessage;
  isInitialMessage?: boolean;
  onClickAction: (actionId: number, title: string) => void;
}

export const ChatBubble = ({ message, onClickAction }: ChatBubbleProps) => {
  const { colors } = useTheme();
  const isUser = message.sender === Sender.USER;

  const bubbleStyle = [
    styles.bubble,
    isUser ? styles.userBubble : styles.botBubble,
    {
      backgroundColor: isUser ? colors.primary : colors.card,
      paddingHorizontal: isUser ? 16 : 0,
    },
  ];

  const handleClickAction = (actionId: number, title: string) => {
    if (onClickAction) onClickAction(actionId, title);
  };

  return (
    <View
      id={message.id}
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
      ]}
    >
      <View style={bubbleStyle}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {message.loading && <LoadingText text={message.loadingText} />}

          {/* Streaming text */}
          {!message.loading &&
            !message.isQuestionJson &&
            message.words.map((word, index) => (
              <WordComponent
                key={index}
                fontSize={16}
                word={word}
                color={isUser ? "white" : "black"}
              />
            ))}

          {message.isQuestionJson && (
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <CustomText>{message.fullText}</CustomText>
            </View>
          )}
        </View>
        {message.suggestedActions.length > 0 && !message.isQuestionJson && (
          <ChatActionButtons
            suggestedActions={message.suggestedActions}
            onClickAction={handleClickAction}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  userContainer: {
    alignItems: "flex-end",
    marginLeft: 32,
  },
  botContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  userBubble: {
    borderTopRightRadius: 6,
  },
  botBubble: {
    borderTopLeftRadius: 6,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
});
