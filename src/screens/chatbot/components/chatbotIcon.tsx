import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../../../theme";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

interface ChatbotIconProps {
  shape?: "circle" | "square" | "rounded";
  backgroundColor?: string;
  primaryColor?: string;
  size?: number;
  children: React.ReactNode;
}

export const ChatbotIcon = ({
  shape,
  backgroundColor,
  primaryColor,
  size,
  children,
}: ChatbotIconProps) => {
  const getShapeStyle = () => {
    switch (shape) {
      case "circle":
        return styles.circle;
      case "square":
        return styles.square;
      case "rounded":
        return styles.rounded;
      default:
        return styles.circle;
    }
  };

  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.iconContainer,
        getShapeStyle(),
        {
          backgroundColor: backgroundColor ?? colors.primary,
          opacity: 0.2,
          borderColor: primaryColor ?? colors.primary,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  circle: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  square: {
    width: 50,
    height: 50,
  },
  rounded: {
    borderRadius: 10,
    width: 50,
    height: 50,
  },
});
