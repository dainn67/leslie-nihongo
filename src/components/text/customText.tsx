// components/CustomText.tsx
import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

interface CustomTextProps extends TextProps {
  weight?: "Regular" | "Bold" | "Italic" | "Light" | "SemiBold";
  size?: number;
}

export const CustomText: React.FC<CustomTextProps> = ({
  style,
  weight = "Regular",
  size = 16,
  children,
  ...props
}) => {
  const fontMap: Record<string, string> = {
    Regular: "Poppins-Regular",
    Bold: "Poppins-Bold",
    Italic: "Poppins-Italic",
    Light: "Poppins-Light",
    SemiBold: "Poppins-SemiBold",
  };

  return (
    <Text
      {...props}
      style={[{ fontFamily: fontMap[weight], fontSize: size }, style]}
    >
      {children}
    </Text>
  );
};
