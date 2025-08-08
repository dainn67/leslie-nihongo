import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, StyleProp, ViewStyle } from "react-native";
import { useAppTheme } from "../theme";

interface AnimatedProgressBarProps {
  progress: number; // 0-100
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  borderRadius?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export const AnimatedProgressBar = ({
  progress,
  height = 6,
  backgroundColor,
  fillColor,
  borderRadius = 3,
  duration = 500,
  style,
}: AnimatedProgressBarProps) => {
  const { colors, isDarkMode } = useAppTheme();
  const bgColor = backgroundColor || (isDarkMode ? colors.backgroundTertiary : "#FCE4EC");
  const fColor = fillColor || (isDarkMode ? colors.secondary : colors.secondary);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [progress, duration]);

  return (
    <View
      style={[
        styles.progressBar,
        style,
        {
          height,
          backgroundColor: bgColor,
          borderRadius,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.progressFill,
          {
            // Use interpolate to convert the value from 0-100 to percentage width
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            backgroundColor: fColor,
            borderRadius,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
  },
});
