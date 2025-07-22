import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { MainButton } from "../../../components/buttons";
import { useTheme } from "../../../theme";
import { SuggestedAction } from "../../../features/chatbot/types";

interface ChatActionButtonsProps {
  suggestedActions: SuggestedAction[];
  onClickAction: (actionId: number, title: string) => void;
}

export const ChatActionButtons = ({
  suggestedActions,
  onClickAction,
}: ChatActionButtonsProps) => {
  const { colors } = useTheme();

  const handleClickAction = (actionId: number, title: string) => {
    if (onClickAction) onClickAction(actionId, title);
  };

  const fadeInAnim = Array.from(
    { length: 3 },
    () => useRef(new Animated.Value(0)).current
  );

  useEffect(() => {
    startAnimation(0);
    setTimeout(() => {
      startAnimation(1);
    }, 100);
    setTimeout(() => {
      startAnimation(2);
    }, 200);
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
              backgroundColor={colors.primary}
              textColor="white"
              onPress={() => handleClickAction(e.id, e.title)}
            />
          </Animated.View>
        );
      })}
    </View>
  );
};
