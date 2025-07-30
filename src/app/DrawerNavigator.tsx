import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { ChatbotScreen } from "../screens/chatbot/ChatbotScreen";
import { ThemeToggleButton } from "../components/ThemeToggleButton";
import { useTheme } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "../components/text/customText";
import { QuestionsScreen } from "../screens/questions/QuestionsScreen";
import { QuestionCategoryScreen } from "../screens/questions/QuestionCategoryScreen";
import { AppScreenConfig } from "../constants/appScreenCofig";
import { QuestionType } from "../models/question";

export type RootStackParamList = {
  ChatbotScreen: undefined;
  QuestionsScreen: undefined;
  QuestionCategoryScreen: { type: QuestionType };
};

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

export const DrawerNavigator = () => {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName={AppScreenConfig.CHATBOT_SCREEN} // Default screen
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
        name={AppScreenConfig.CHATBOT_SCREEN}
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
        name={AppScreenConfig.QUESTIONS_SCREEN}
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
      <Stack.Screen name="QuestionsScreen" component={QuestionsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="QuestionCategoryScreen" component={QuestionCategoryScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};
