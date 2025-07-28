import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { CustomText } from "../text/customText";

interface MainButtonProps {
  title: string;
  width?: number;
  height?: number;
  radius?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
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
  borderColor,
  borderWidth,
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
    marginVertical,
    borderColor,
    borderWidth,
  );

  const text = title.replaceAll("**", "").replace(/<[^>]*>/g, "");

  return (
    <TouchableOpacity style={[style.button, style.shadow]} onPress={onPress}>
      <CustomText style={style.text}>{text}</CustomText>
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
  marginVertical?: number,
  borderColor?: string,
  borderWidth?: number,
) =>
  StyleSheet.create({
    button: {
      backgroundColor: backgroundColor ?? "transparent",
      width: width,
      height: height,
      borderRadius: radius,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: paddingHorizontal,
      paddingVertical: paddingVertical,
      marginHorizontal: marginHorizontal,
      marginVertical: marginVertical,
      borderColor: borderColor,
      borderWidth: borderWidth,
    },
    text: {
      color: textColor,
      fontSize: fontSize,
      fontWeight: fontWeight,
    },
    shadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  });

export default MainButton;
