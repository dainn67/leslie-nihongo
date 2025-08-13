import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppTheme } from "../../../../theme";
import { WordComponent } from "../../../../components/streamingText/WordComponent";
import { LoadingMessage } from "./LoadingMessage";
import { ChatActionButtons } from "../ChatActionButtons";
import { QuestionsMessage } from "./QuestionsMessage";
import { ChatMessage, Sender, MessageType, MessageStatus } from "../../../../models/chatMessage";
import { CustomText } from "../../../../components/text/customText";

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
  const { colors } = useAppTheme();

  const isUser = message.sender === Sender.USER;

  const styles = getStyle(colors, isUser, componentHeight, isLastMessage);

  const isLoading = message.status == MessageStatus.LOADING;
  const hasError = message.status == MessageStatus.ERROR;
  const isStreamText = !isLoading && !hasError && message.messageType === MessageType.STREAM_TEXT;
  const isLoadingQuestion = isLoading && !hasError && message.messageType === MessageType.QUESTIONS;
  const isQuestions = !isLoading && !hasError && message.messageType === MessageType.QUESTIONS && message.fullText.length > 0;
  const showButtons = isStreamText && message.suggestedActions.length > 0;

  return (
    <View id={message.id} style={styles.container}>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {hasError && <CustomText>Vui lòng thử lại sau...</CustomText>}

        {!hasError && isLoading && <LoadingMessage isQuestion={isLoadingQuestion} />}

        {/* Streaming text */}
        {isStreamText &&
          message.words.map((word, index) => (
            <WordComponent
              key={index}
              fontSize={16}
              word={word}
              color={isUser ? colors.userChatMessageText : colors.botChatMessageText}
            />
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
      minHeight: isUser || !isLastMessage ? 0 : componentHeight * 0.88,
      borderRadius: 16,
      paddingHorizontal: 16,
      ...(isUser
        ? {
            backgroundColor: colors.secondary,
            paddingVertical: 12,
            alignItems: "flex-end",
            alignSelf: "flex-end",
            marginLeft: 32,
            borderTopRightRadius: 6,
          }
        : {
            alignItems: "flex-start",
            paddingVertical: 12,
            borderTopLeftRadius: 6,
            marginRight: 0,
          }),
    },
    text: {
      fontSize: 16,
      lineHeight: 22,
      letterSpacing: 0.2,
    },
  });
};
