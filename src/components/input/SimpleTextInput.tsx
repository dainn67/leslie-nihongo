import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

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

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={[styles.input, isFocused && styles.inputFocused]}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
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
    marginVertical: 10, // Space between text inputs
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // Light gray border
    paddingLeft: 10,
    fontSize: 16,
    color: "#333", // Dark text color
    backgroundColor: "transparent",
    fontFamily: "Arial", // Clean font for minimalism
  },
  inputFocused: {
    borderBottomColor: "#007BFF", // Blue color when focused
  },
});
