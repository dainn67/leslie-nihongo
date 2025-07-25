import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../../../../theme";
import { WordComponent } from "../../../../components/streamingText/WordComponent";
import { LoadingMessage } from "./LoadingMessage";
import { ChatActionButtons } from "../ChatActionButtons";
import { QuestionsMessage } from "./QuestionsMessage";
import { ChatMessage, Sender, MessageType } from "../../../../models/chatMessage";

interface MainChatMessageProps {
  message: ChatMessage;
  isInitialMessage?: boolean;
  onClickAction: (actionId: string, title: string) => void;
}

export const MainChatMessage = ({ message, onClickAction }: MainChatMessageProps) => {
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

  const handleClickAction = (actionId: string, title: string) => {
    if (onClickAction) onClickAction(actionId, title);
  };

  const isLoading = message.loading;
  const isStreaming = !message.loading && message.messageType === MessageType.STREAM_TEXT;
  const isQuestions = message.messageType === MessageType.QUESTION_JSON && message.fullText.length > 0;
  const showButtons = message.suggestedActions.length > 0 && message.messageType === MessageType.STREAM_TEXT;

  console.log("================");
  console.log(message.words);
  console.log(message.fullText);
  console.log(message.suggestedActions);

  return (
    <View id={message.id} style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      <View style={bubbleStyle}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {isLoading && <LoadingMessage />}

          {/* Streaming text */}
          {isStreaming &&
            message.words.map((word, index) => (
              <WordComponent key={index} fontSize={16} word={word} color={isUser ? "white" : "black"} />
            ))}

          {/* Generated questions */}
          {isQuestions && (
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <QuestionsMessage questionJson={message.fullText} />
            </View>
          )}
        </View>

        {/* Action buttons */}
        {showButtons && (
          <ChatActionButtons suggestedActions={message.suggestedActions} onClickAction={handleClickAction} />
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
