import React from "react";
import { View, Text } from "react-native";
import { RenderHTML } from "react-native-render-html";

interface WordComponentProps {
  word: string;
  fontSize?: number;
}

export const WordComponent = ({ word, fontSize }: WordComponentProps) => {
  // Kiểm tra xem có phải là HTML không
  const isHTML = (text: string) => {
    const htmlPattern = /<[^>]*>/g;
    return htmlPattern.test(text);
  };

  // Xử lý hiển thị nội dung
  const renderContent = () => {
    if (word == "\n") {
      return <View style={{ width: 1000, height: 5 }} />;
    }

    if (!word || word.trim() === "") {
      return <View style={{ width: 0, height: 0 }} />;
    }

    if (isHTML(word)) {
      return (
        <RenderHTML
          contentWidth={300}
          source={{ html: word }}
          tagsStyles={{
            b: { fontWeight: "bold" },
            i: { fontStyle: "italic" },
            u: { textDecorationLine: "underline" },
            strong: { fontWeight: "bold" },
            em: { fontStyle: "italic" },
            code: {
              fontFamily: "monospace",
              backgroundColor: "#f0f0f0",
              padding: 2,
              borderRadius: 3,
              fontSize: fontSize || 14,
            },
            pre: {
              fontFamily: "monospace",
              backgroundColor: "#f0f0f0",
              padding: 8,
              borderRadius: 5,
              marginVertical: 4,
              fontSize: fontSize || 14,
            },
            p: { margin: 0, fontSize: fontSize || 14 },
            div: { margin: 0, fontSize: fontSize || 14 },
          }}
        />
      );
    } else if (word.startsWith("**") && word.endsWith("**")) {
      return (
        <Text style={{ fontWeight: "bold", fontSize: fontSize || 14 }}>
          {word.slice(2, -2)}
        </Text>
      );
    } else {
      // Văn bản thường
      return <Text style={{ fontSize: fontSize || 14 }}>{word}</Text>;
    }
  };

  return (
    <View
      style={{
        // flexDirection: "row",
        // alignItems: "center",
        marginRight: 3,
      }}
    >
      {renderContent()}
    </View>
  );
};
