import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { CustomText } from "../../../components/text/customText";

interface LoadingTextProps {
  text: string;
}

export const LoadingText = ({ text }: LoadingTextProps) => {
  const dots = Array.from(
    { length: 3 },
    () => useRef(new Animated.Value(0)).current
  );

  useEffect(() => {
    startDotAnimation(0);
    setTimeout(() => {
      startDotAnimation(1);
    }, 200);
    setTimeout(() => {
      startDotAnimation(2);
    }, 400);
  }, []);

  const startDotAnimation = (index: number) => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(dots[index], {
          toValue: -2,
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
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <CustomText>{text}</CustomText>
      <Animated.Text style={{ transform: [{ translateY: dots[0] }] }}>
        .
      </Animated.Text>
      <Animated.Text style={{ transform: [{ translateY: dots[1] }] }}>
        .
      </Animated.Text>
      <Animated.Text style={{ transform: [{ translateY: dots[2] }] }}>
        .
      </Animated.Text>
    </View>
  );
};
