import React from "react";
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface IconButtonProps {
  icon: ImageSourcePropType;
  width?: number;
  height?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

export const IconButton = ({ icon, width, height, style, onPress }: IconButtonProps) => {
  const styles = getStyles(width, height);

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
    </TouchableOpacity>
  );
};

const getStyles = (width?: number, height?: number) =>
  StyleSheet.create({
    button: {
      backgroundColor: "#F0F8FF",
      borderRadius: 12,
      padding: 8,
    },
    icon: {
      width: width ?? 20,
      height: height ?? 20,
    },
  });
