import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

export const LoadingMessage = () => {
  const dots = Array.from(
    { length: 3 },
    () => useRef(new Animated.Value(0)).current
  );

  useEffect(() => {
    startDotAnimation(0);
    setTimeout(() => {
      startDotAnimation(1);
    }, 150);
    setTimeout(() => {
      startDotAnimation(2);
    }, 300);
  }, []);

  const startDotAnimation = (index: number) => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(dots[index], {
          toValue: -3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(dots[index], {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(dots[index], {
          toValue: 0,
          duration: 1000,
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
    <View style={styles.loadingContainer}>
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
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    color: "grey",
    borderRadius: 100,
    padding: 10,
    backgroundColor: "lightgrey",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 100,
    marginHorizontal: 3,
    backgroundColor: "white",
  },
});
