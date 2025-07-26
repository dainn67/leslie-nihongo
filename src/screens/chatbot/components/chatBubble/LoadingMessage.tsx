import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CustomText } from "../../../../components/text/customText";
import { useTheme } from "../../../../theme";

interface LoadingMessageProps {
  isQuestion?: boolean;
}

export const LoadingMessage = ({ isQuestion }: LoadingMessageProps) => {
  const dots = Array.from({ length: 3 }, () => useRef(new Animated.Value(0)).current);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Pulse animation for the container
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Start dot animations with staggered timing
    startDotAnimation(0);
    setTimeout(() => {
      startDotAnimation(1);
    }, 200);
    setTimeout(() => {
      startDotAnimation(2);
    }, 400);

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const startDotAnimation = (index: number) => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(dots[index], {
          toValue: -8,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dots[index], {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dots[index], {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  };

  return (
    <Animated.View
      style={[
        styles.loadingContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <LinearGradient colors={[colors.primary, colors.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientBackground}>
        <View style={styles.contentContainer}>
          {isQuestion && <CustomText style={styles.loadingText}>Đang tạo câu hỏi</CustomText>}
          <View style={[styles.dotsContainer, { marginLeft: isQuestion ? 8 : 0 }]}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    transform: [{ translateY: dots[index] }],
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    borderRadius: 100,
  },
  gradientBackground: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
