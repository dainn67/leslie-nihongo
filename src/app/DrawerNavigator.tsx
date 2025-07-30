import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import { ChatbotScreen } from "../screens/chatbot/ChatbotScreen";
import { ThemeToggleButton } from "../components/ThemeToggleButton";
import { useTheme } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "../components/text/customText";
import { QuestionsScreen } from "../screens/questions/QuestionsScreen";
import { QuestionCategoryScreen } from "../screens/questions/QuestionCategoryScreen";
import { APP_SCREEN_CONFIG } from "../constants/appScreenCofig";

// Create a Drawer Navigator object
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export const DrawerNavigator = () => {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName={APP_SCREEN_CONFIG.CHATBOT_SCREEN} // Default screen
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerStyle: {
          backgroundColor: colors.background,
          width: 280,
        },
      }}
      drawerContent={(props) => (
        <View style={{ flex: 1, marginBottom: 30 }}>
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
          <ThemeToggleButton />
        </View>
      )}
    >
      <Drawer.Screen
        name={APP_SCREEN_CONFIG.CHATBOT_SCREEN}
        component={ChatbotScreen}
        options={{
          drawerLabel: ({ color }) => (
            <CustomText weight="Regular" style={{ color }}>
              Chatbot
            </CustomText>
          ),
          drawerIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name={APP_SCREEN_CONFIG.QUESTIONS_SCREEN}
        component={QuestionStackScreen}
        options={{
          drawerLabel: ({ color }) => (
            <CustomText weight="Regular" style={{ color }}>
              Questions
            </CustomText>
          ),
          drawerIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
};

const QuestionStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={APP_SCREEN_CONFIG.QUESTIONS_SCREEN} component={QuestionsScreen} options={{ headerShown: false }} />
      <Stack.Screen name={APP_SCREEN_CONFIG.QUESTION_CATEGORY_SCREEN} component={QuestionCategoryScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};
