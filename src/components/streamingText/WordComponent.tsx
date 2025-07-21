import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { RenderHTML } from "react-native-render-html";
import { AppConfig } from "../../config/appConfig";
import { CustomText } from "../text/customText";

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
  const isHTML = (text: string) => {
    const htmlPattern = /<[^>]*>/g;
    return htmlPattern.test(text);
  };

  const renderContent = () => {
    if (word == "\n") return <View style={{ width: 1000, height: 5 }} />;

    if (!word || word.trim() === "")
      return <View style={{ width: 0, height: 0 }} />;

    if (isHTML(word)) {
      return (
        <RenderHTML
          contentWidth={300}
          source={{ html: word }}
          tagsStyles={{
            b: { fontWeight: "bold", fontFamily: AppConfig.fontFamily },
            i: { fontStyle: "italic", fontFamily: AppConfig.fontFamily },
            u: { textDecorationLine: "underline" },
            strong: { fontWeight: "bold", fontFamily: AppConfig.fontFamily },
            em: { fontStyle: "italic", fontFamily: AppConfig.fontFamily },
            code: {
              backgroundColor: "#f0f0f0",
              padding: 2,
              borderRadius: 3,
              fontSize: fontSize || 14,
              color: color || "black",
              fontFamily: AppConfig.fontFamily,
            },
            pre: {
              backgroundColor: "#f0f0f0",
              padding: 8,
              borderRadius: 5,
              marginVertical: 4,
              fontSize: fontSize || 14,
              color: color || "black",
              fontFamily: AppConfig.fontFamily,
            },
            p: {
              margin: 0,
              fontSize: fontSize || 14,
              color: color || "black",
              fontFamily: AppConfig.fontFamily,
            },
            div: {
              margin: 0,
              fontSize: fontSize || 14,
              color: color || "black",
              fontFamily: AppConfig.fontFamily,
            },
          }}
        />
      );
    } else if (word.startsWith("**") && word.endsWith("**")) {
      return (
        <CustomText
          weight="Bold"
          style={{
            fontSize: fontSize || 14,
            color: color || "black",
          }}
        >
          {word.slice(2, -2)}
        </CustomText>
      );
    } else {
      return (
        <CustomText
          weight="Regular"
          style={{ fontSize: fontSize, color: color }}
        >
          {word}
        </CustomText>
      );
    }
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ marginRight: 3, opacity: fadeAnim }}>
      {renderContent()}
    </Animated.View>
  );
};
