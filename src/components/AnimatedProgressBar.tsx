import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

interface AnimatedProgressBarProps {
  progress: number; // 0-100
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  borderRadius?: number;
  duration?: number;
}

export const AnimatedProgressBar = ({
  progress,
  height = 6,
  backgroundColor = "#E8E8E8",
  fillColor = "#4A90E2",
  borderRadius = 3,
  duration = 500,
}: AnimatedProgressBarProps) => {
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
        {
          height,
          backgroundColor,
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
            backgroundColor: fillColor,
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
