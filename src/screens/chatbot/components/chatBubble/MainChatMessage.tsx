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
  componentHeight: number;
  onClickAction: (actionId: string, title: string) => void;
}

export const MainChatMessage = ({ message, onClickAction, componentHeight }: MainChatMessageProps) => {
  const { colors } = useTheme();
  const isUser = message.sender === Sender.USER;

  const handleClickAction = (actionId: string, title: string) => {
    if (onClickAction) onClickAction(actionId, title);
  };

  const styles = getStyle(colors, isUser, componentHeight);

  const isLoading = message.loading;
  const isStreaming = !message.loading && message.messageType === MessageType.STREAM_TEXT;
  const isQuestions = message.messageType === MessageType.QUESTION_JSON && message.fullText.length > 0;
  const showButtons = message.suggestedActions.length > 0 && message.messageType === MessageType.STREAM_TEXT;

  return (
    <View id={message.id} style={[styles.container]}>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {isLoading && <LoadingMessage />}

        {/* Streaming text */}
        {isStreaming &&
          message.words.map((word, index) => <WordComponent key={index} fontSize={16} word={word} color={isUser ? "white" : "black"} />)}

        {/* Generated questions */}
        {isQuestions && (
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <QuestionsMessage questionJson={message.fullText} />
          </View>
        )}
      </View>

      {/* Action buttons */}
      {showButtons && <ChatActionButtons suggestedActions={message.suggestedActions} onClickAction={handleClickAction} />}
    </View>
  );
};

const getStyle = (colors: any, isUser: boolean, componentHeight: number) => {
  return StyleSheet.create({
    container: {
      marginTop: 16,
      minHeight: isUser ? 0 : componentHeight * 0.86,

      borderRadius: 16,
      ...(isUser
        ? {
            backgroundColor: colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 16,
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
