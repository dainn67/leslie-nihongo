import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet, ViewStyle, TextStyle, StyleProp, ActivityIndicator } from "react-native";
import { CustomText } from "../text/customText";

interface MainButtonProps {
  title: string;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress: () => void;
}

// Component MainButton
const MainButton = ({ title, onPress, disabled = false, loading = false, style, textStyle }: MainButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => setIsPressed(true);
  const handlePressOut = () => setIsPressed(false);

  const text = title.replaceAll("**", "").replace(/<[^>]*>/g, "");

  // Get passed in border radius
  const flattenedStyle = StyleSheet.flatten(style || {});
  const borderRadius = flattenedStyle?.borderRadius ?? 8;

  const containerStyles = [{ borderRadius }];

  const buttonStyles = [
    styles.button,
    {
      backgroundColor: disabled ? "#E5E7EB" : "#F48FB1",
      opacity: isPressed ? 0.9 : 1,
      transform: isPressed ? [{ scale: 0.98 }] : [],
      borderRadius,
    },
    style,
  ];

  const labelStyles = [styles.text, { color: disabled ? "#9CA3AF" : "#4A4A4A" }, textStyle];

  return (
    <View style={containerStyles}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={buttonStyles}
        activeOpacity={0.8}
      >
        {loading ? <ActivityIndicator color="#4A4A4A" /> : <CustomText style={labelStyles}>{text}</CustomText>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MainButton;
