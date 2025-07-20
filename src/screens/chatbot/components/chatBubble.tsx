import React from "react";
import { View, StyleSheet } from "react-native";
import { Sender } from "../../../features/chatbot/types";
import { useTheme } from "../../../theme";
import { WordComponent } from "../../../components/streamingText/WordComponent";
import { splitCustomWords } from "../../../utils/utils";
import { MainButton } from "../../../components/buttons";

interface ChatBubbleProps {
  id: string;
  text: string;
  sender: Sender;
  showButtons?: boolean;
}

export const ChatBubble = ({
  id,
  text,
  sender,
  showButtons,
}: ChatBubbleProps) => {
  const { colors } = useTheme();
  const isUser = sender === Sender.USER;

  const bubbleStyle = [
    styles.bubble,
    isUser ? styles.userBubble : styles.botBubble,
    {
      backgroundColor: isUser ? colors.primary : colors.card,
      shadowColor: colors.cardShadow,
      paddingHorizontal: isUser ? 16 : 0,
    },
  ];

  const words = splitCustomWords(text);

  return (
    <View
      id={id}
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
      ]}
    >
      <View style={bubbleStyle}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {words.map((word, index) => (
            <WordComponent
              key={index}
              word={word}
              color={isUser ? "white" : "black"}
            />
          ))}
        </View>
        {showButtons && (
          <View style={{ flexDirection: "row" }}>
            {[1, 2, 3].map((e, i) => {
              return (
                <MainButton
                  key={i}
                  title={`Button ${e.toString()}`}
                  radius={16}
                  width={100}
                  paddingVertical={12}
                  marginHorizontal={4}
                  marginVertical={4}
                  backgroundColor={colors.primary}
                  textColor="white"
                  onPress={() => {}}
                />
              );
            })}
          </View>
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
  },
  botContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
