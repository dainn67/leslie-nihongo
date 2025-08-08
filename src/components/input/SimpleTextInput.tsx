import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useAppTheme } from "../../theme";

export const SimpleTextInput = ({
  value,
  inputRef,
  placeholder,
  onChangeText,
}: {
  value: string;
  inputRef: React.RefObject<TextInput | null>;
  placeholder?: string;
  onChangeText?: (text: string) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { colors, isDarkMode } = useAppTheme();

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          {
            borderBottomColor: isFocused ? colors.primary : isDarkMode ? colors.borderLight : "#ccc",
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? colors.textTertiary : "#aaa"}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: "transparent",
    fontFamily: "Inter-Regular",
  },
});
