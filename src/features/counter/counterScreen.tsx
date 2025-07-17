import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Button, Text, View } from "react-native";
import React from "react";
import { decrement, increment } from "./counterSlice";
import { AppBar } from "../../components/AppBar";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme";

export const CounterScreen = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <AppBar
        title="Counter App"
        leftIcon={<Ionicons name="menu" size={24} color="white" />}
        rightIcon={<Ionicons name="settings" size={24} color="white" />}
        onLeftPress={() => {
          /* xử lý menu */
        }}
        onRightPress={() => {
          /* xử lý settings */
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Counter: {count}
        </Text>
        <Button onPress={() => dispatch(increment())} title="Increment" />
        <Button onPress={() => dispatch(decrement())} title="Decrement" />
      </View>
    </View>
  );
};
