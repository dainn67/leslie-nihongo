import React from "react";
import { View, Text, Button, StyleSheet, SafeAreaView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import {
  counterDecrement,
  counterIncrement,
  decrementWallet,
  incrementWallet,
} from "./counterSlice";

export default function CounterScreen() {
  const count = useSelector((state: RootState) => state.counter.value);
  const wallet = useSelector((state: RootState) => state.wallet.balance);

  const dispatch = useDispatch<AppDispatch>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Redux Counter</Text>
        <Text style={styles.counter}>{count}</Text>
        <Button
          title="Increment"
          onPress={() => dispatch(counterIncrement())}
        />
        <Button
          title="Decrement"
          onPress={() => dispatch(counterDecrement())}
        />
      </View>

      <View style={styles.container}>
        <Text>Wallet</Text>
        <Text>{wallet}</Text>
        <Button title="Increment" onPress={() => dispatch(incrementWallet())} />
        <Button title="Decrement" onPress={() => dispatch(decrementWallet())} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  counter: { fontSize: 48, marginBottom: 20 },
});
