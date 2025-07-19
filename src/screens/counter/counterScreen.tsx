import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Button, Text, View } from "react-native";
import { decrement, increment } from "../../features/counter/counterSlice";
import { AppBar } from "../../components/AppBar";
import { useTheme } from "../../theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

type DrawerParamList = {
  Chatbot: undefined;
  Counter: undefined;
};

type CounterScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'Counter'>;

export const CounterScreen = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  const navigation = useNavigation<CounterScreenNavigationProp>();
  const { colors } = useTheme();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <View style={{ flex: 1 }}>
      <AppBar
        title="Counter App"
        leftIcon={<Ionicons name="menu" size={24} color="white" />}
        rightIcon={<Ionicons name="settings" size={24} color="white" />}
        onLeftPress={openDrawer}
        onRightPress={() => {
          /* xử lý settings */
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text }}>
          Counter: {count}
        </Text>
        <Button onPress={() => dispatch(increment())} title="Increment" />
        <Button onPress={() => dispatch(decrement())} title="Decrement" />
      </View>
    </View>
  );
};
