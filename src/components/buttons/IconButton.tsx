import React from "react";
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface IconButtonProps {
  icon: ImageSourcePropType;
  iconWidth?: number;
  iconHeight?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

export const IconButton = ({ icon, iconWidth, iconHeight, style, onPress }: IconButtonProps) => {
  const styles = getStyles(iconWidth, iconHeight);

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
    </TouchableOpacity>
  );
};

const getStyles = (iconWidth?: number, iconHeight?: number) =>
  StyleSheet.create({
    button: {
      backgroundColor: "#F0F8FF",
      borderRadius: 12,
      padding: 8,
    },
    icon: {
      width: iconWidth ?? 20,
      height: iconHeight ?? 20,
    },
  });
