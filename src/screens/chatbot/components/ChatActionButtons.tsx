import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { useTheme } from "../../../theme";
import { SuggestedAction } from "../../../models/chatMessage";
import MainButton from "../../../components/buttons/MainButton";

interface ChatActionButtonsProps {
  suggestedActions: SuggestedAction[];
  onClickAction: (title: string, actionId?: string) => void;
}

export const ChatActionButtons = ({ suggestedActions, onClickAction }: ChatActionButtonsProps) => {
  const { colors } = useTheme();

  const handleClickAction = (title: string, actionId?: string) => {
    if (onClickAction) onClickAction(title, actionId);
  };

  const fadeInAnim = Array.from({ length: suggestedActions.length }, () => useRef(new Animated.Value(0)).current);
  const scaleAnim = Array.from({ length: suggestedActions.length }, () => useRef(new Animated.Value(0.8)).current);

  useEffect(() => {
    for (let i = 0; i < suggestedActions.length; i++) {
      setTimeout(() => {
        startAnimation(i);
      }, i * 100);
    }
  }, []);

  const startAnimation = (index: number) => {
    const animation = Animated.timing(fadeInAnim[index], {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    });

    const scaleAnimation = Animated.timing(scaleAnim[index], {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    });

    animation.start();
    scaleAnimation.start();

    return () => {
      animation.stop();
    };
  };

  return (
    <View style={{ flexDirection: "column" }}>
      {suggestedActions.map((e, i) => {
        return (
          <Animated.View style={{ opacity: fadeInAnim[i], transform: [{ scale: scaleAnim[i] }] }} key={i}>
            <MainButton
              key={i}
              title={e.title.trim()}
              radius={100}
              paddingVertical={8}
              paddingHorizontal={12}
              marginHorizontal={4}
              marginVertical={4}
              backgroundColor={`${colors.primary}15`}
              onPress={() => handleClickAction(e.title, e.id)}
            />
          </Animated.View>
        );
      })}
    </View>
  );
};
