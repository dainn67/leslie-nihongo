import React from "react";
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity } from "react-native";

interface IconButtonProps {
  icon: ImageSourcePropType;
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderRadius?: number;
  onPress: () => void;
}

export const IconButton = ({ icon, width, height, backgroundColor, borderRadius, onPress }: IconButtonProps) => {
  const styles = getStyles(width, height, backgroundColor, borderRadius);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
    </TouchableOpacity>
  );
};

const getStyles = (width?: number, height?: number, backgroundColor?: string, borderRadius?: number) =>
  StyleSheet.create({
    button: {
      backgroundColor: backgroundColor ?? "#F0F8FF",
      borderRadius: borderRadius ?? 12,
      padding: 8,
    },
    icon: {
      width: width ?? 20,
      height: height ?? 20,
    },
  });
