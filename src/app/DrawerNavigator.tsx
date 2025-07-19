import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ChatbotScreen } from "../screens/chatbot/chatbotScreen";
import { CounterScreen } from "../screens/counter/counterScreen";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Chatbot"
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#3498db",
        drawerInactiveTintColor: "#666",
        drawerStyle: {
          backgroundColor: "#fff",
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{
          drawerLabel: "Chatbot",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Counter"
        component={CounterScreen}
        options={{
          drawerLabel: "Counter",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calculator" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}; 