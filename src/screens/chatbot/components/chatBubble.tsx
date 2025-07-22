import React from "react";
import { View, StyleSheet } from "react-native";
import { Sender } from "../../../features/chatbot/types";
import { useTheme } from "../../../theme";
import { WordComponent } from "../../../components/streamingText/WordComponent";
import { MainButton } from "../../../components/buttons";
import { ChatMessage } from "../../../features/chatbot/types";
import { LoadingText } from "./loadingText";

interface ChatBubbleProps {
  message: ChatMessage;
  isInitialMessage?: boolean;
  onClickAction: (actionId: number) => void;
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

  const handleClickAction = (actionId: number) => {
    if (onClickAction) onClickAction(actionId);
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
          {!message.loading &&
            message.words.map((word, index) => (
              <WordComponent
                key={index}
                fontSize={16}
                word={word}
                color={isUser ? "white" : "black"}
              />
            ))}
        </View>
        <View style={{ flexDirection: "column", flexWrap: "wrap" }}>
          {message.suggestedActions.map((e, i) => {
            return (
              <MainButton
                key={i}
                title={e.title}
                radius={16}
                paddingVertical={12}
                paddingHorizontal={4}
                marginHorizontal={4}
                marginVertical={4}
                backgroundColor={colors.primary}
                textColor="white"
                onPress={() => handleClickAction(e.id)}
              />
            );
          })}
        </View>
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
