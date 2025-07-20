import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
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

  const handleIncrement = () => {
    dispatch(increment());
  };

  const handleDecrement = () => {
    dispatch(decrement());
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppBar
        title="Counter App"
        leftIcon={<Ionicons name="menu" size={24} color="white" />}
        rightIcon={<Ionicons name="settings" size={24} color="white" />}
        onLeftPress={openDrawer}
        onRightPress={() => {
          /* xử lý settings */
        }}
      />
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="calculator" size={48} color={colors.primary} />
          </View>
          
          <Text style={[styles.counterLabel, { color: colors.textSecondary }]}>
            Current Count
          </Text>
          
          <Text style={[styles.counterValue, { color: colors.text }]}>
            {count}
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.decrementButton, { backgroundColor: colors.error }]}
              onPress={handleDecrement}
              activeOpacity={0.8}
            >
              <Ionicons name="remove" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.incrementButton, { backgroundColor: colors.success }]}
              onPress={handleIncrement}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 320,
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  counterLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  counterValue: {
    fontSize: 64,
    fontWeight: "700",
    marginBottom: 32,
    letterSpacing: -1,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  decrementButton: {
    shadowColor: "#ef4444",
  },
  incrementButton: {
    shadowColor: "#10b981",
  },
});
