import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { CustomText } from "../text/customText";

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
    <TouchableOpacity style={[style.button, styles.shadow]} onPress={onPress}>
      <CustomText style={[style.text, { textAlign: "center" }]}>
        {title}
      </CustomText>
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

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default MainButton;
