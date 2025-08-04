import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../../../../theme";
import { WordComponent } from "../../../../components/streamingText/WordComponent";
import { LoadingMessage } from "./LoadingMessage";
import { ChatActionButtons } from "../ChatActionButtons";
import { QuestionsMessage } from "./QuestionsMessage";
import { ChatMessage, Sender, MessageType, MessageStatus } from "../../../../models/chatMessage";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isLastMessage?: boolean;
  componentHeight: number;
  onClickAction: (title: string, actionId?: string) => void;
  onAnalyze: (summary: string) => void;
}

export const ChatMessageBubble = ({
  message,
  componentHeight,
  isLastMessage,
  onClickAction,
  onAnalyze,
}: ChatMessageBubbleProps) => {
  const { colors } = useTheme();
  const isUser = message.sender === Sender.USER;

  const styles = getStyle(colors, isUser, componentHeight, isLastMessage);

  const isLoading = message.messageStatus == MessageStatus.LOADING;
  const isStreaming = !isLoading && message.messageType === MessageType.STREAM_TEXT;
  const isLoadingQuestion = isLoading && message.messageType === MessageType.QUESTION_JSON;
  const isQuestions = !isLoading && message.messageType === MessageType.QUESTION_JSON && message.fullText.length > 0;
  const showButtons = !isLoading && message.suggestedActions.length > 0 && message.messageType === MessageType.STREAM_TEXT;

  return (
    <View id={message.id} style={[styles.container]}>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {isLoading && <LoadingMessage isQuestion={isLoadingQuestion} />}

        {/* Streaming text */}
        {isStreaming &&
          message.words.map((word, index) => (
            <WordComponent key={index} fontSize={16} word={word} color={isUser ? "white" : "black"} />
          ))}

        {/* Generated questions */}
        {isQuestions && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", flex: 1 }}>
            <QuestionsMessage questions={message.questions} onAnalyze={onAnalyze} />
          </View>
        )}
      </View>

      {/* Action buttons */}
      {showButtons && <ChatActionButtons suggestedActions={message.suggestedActions} onClickAction={onClickAction} />}
    </View>
  );
};

const getStyle = (colors: any, isUser: boolean, componentHeight: number, isLastMessage?: boolean) => {
  return StyleSheet.create({
    container: {
      marginTop: 16,
      minHeight: isUser || !isLastMessage ? 0 : componentHeight * 0.86,
      borderRadius: 16,
      paddingHorizontal: 16,
      ...(isUser
        ? {
            backgroundColor: colors.primary,
            paddingVertical: 12,
            alignItems: "flex-end",
            alignSelf: "flex-end",
            marginLeft: 32,
            borderTopRightRadius: 6,
          }
        : {
            alignItems: "flex-start",
          }),
    },
    text: {
      fontSize: 16,
      lineHeight: 22,
      letterSpacing: 0.2,
    },
  });
};
