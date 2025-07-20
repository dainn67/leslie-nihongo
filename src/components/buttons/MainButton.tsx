import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

interface MainButtonProps {
  title: string;
  width?: number;
  height?: number;
  radius?: number;
  backgroundColor?: string;
  paddingHorizontal?: number;
  paddingVertical?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  textColor?: string;
  fontSize?: number;
  fontWeight?: "normal" | "bold";
  onPress: () => void;
}

const MainButton = ({
  title,
  width,
  height,
  radius,
  textColor,
  paddingHorizontal,
  paddingVertical,
  marginHorizontal,
  marginVertical,
  fontSize,
  fontWeight,
  backgroundColor,
  onPress,
}: MainButtonProps) => {
  const style = getStyles(
    width,
    height,
    radius,
    backgroundColor,
    textColor,
    fontSize,
    fontWeight,
    paddingHorizontal,
    paddingVertical,
    marginHorizontal,
    marginVertical
  );

  return (
    <TouchableOpacity style={style.button} onPress={onPress}>
      <Text style={style.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const getStyles = (
  width?: number,
  height?: number,
  radius?: number,
  backgroundColor?: string,
  textColor?: string,
  fontSize?: number,
  fontWeight?: "normal" | "bold" | undefined,
  paddingHorizontal?: number,
  paddingVertical?: number,
  marginHorizontal?: number,
  marginVertical?: number
) =>
  StyleSheet.create({
    button: {
      backgroundColor: backgroundColor,
      width: width,
      height: height,
      borderRadius: radius,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: paddingHorizontal,
      paddingVertical: paddingVertical,
      marginHorizontal: marginHorizontal,
      marginVertical: marginVertical,
    },
    text: {
      color: textColor,
      fontSize: fontSize,
      fontWeight: fontWeight,
    },
  });

export default MainButton;
