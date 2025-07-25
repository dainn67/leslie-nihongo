import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { MainButton } from "../../../components/buttons";
import { useTheme } from "../../../theme";
import { SuggestedAction } from "../../../models/chatMessage";

interface ChatActionButtonsProps {
  suggestedActions: SuggestedAction[];
  onClickAction: (actionId: string, title: string) => void;
}

export const ChatActionButtons = ({ suggestedActions, onClickAction }: ChatActionButtonsProps) => {
  const { colors } = useTheme();

  const handleClickAction = (actionId: string, title: string) => {
    if (onClickAction) onClickAction(actionId, title);
  };

  const fadeInAnim = Array.from(
    { length: suggestedActions.length },
    () => useRef(new Animated.Value(0)).current
  );

  useEffect(() => {
    startAnimation(0);
    for (let i = 1; i < suggestedActions.length; i++) {
      setTimeout(() => {
        startAnimation(i);
      }, i * 150);
    }
  }, []);

  const startAnimation = (index: number) => {
    const animation = Animated.timing(fadeInAnim[index], {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  };

  return (
    <View style={{ flexDirection: "column" }}>
      {suggestedActions.map((e, i) => {
        return (
          <Animated.View style={{ opacity: fadeInAnim[i] }} key={i}>
            <MainButton
              key={i}
              title={e.title.trim()}
              radius={16}
              paddingVertical={12}
              paddingHorizontal={4}
              marginHorizontal={4}
              marginVertical={4}
              borderColor={colors.primary}
              borderWidth={1}
              onPress={() => handleClickAction(e.id, e.title)}
            />
          </Animated.View>
        );
      })}
    </View>
  );
};
