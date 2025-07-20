import React from "react";
import { View, Text } from "react-native";
import { RenderHTML } from "react-native-render-html";

interface WordComponentProps {
  word: string;
  fontSize?: number;
  color?: string;
}

export const WordComponent = ({
  word,
  fontSize,
  color,
}: WordComponentProps) => {
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
              color: color || "black",
            },
            pre: {
              fontFamily: "monospace",
              backgroundColor: "#f0f0f0",
              padding: 8,
              borderRadius: 5,
              marginVertical: 4,
              fontSize: fontSize || 14,
              color: color || "black",
            },
            p: { margin: 0, fontSize: fontSize || 14, color: color || "black" },
            div: {
              margin: 0,
              fontSize: fontSize || 14,
              color: color || "black",
            },
          }}
        />
      );
    } else if (word.startsWith("**") && word.endsWith("**")) {
      return (
        <Text
          style={{
            fontWeight: "bold",
            fontSize: fontSize || 14,
            color: color || "black",
          }}
        >
          {word.slice(2, -2)}
        </Text>
      );
    } else {
      // Văn bản thường
      return (
        <Text style={{ fontSize: fontSize || 14, color: color || "black" }}>
          {word}
        </Text>
      );
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
