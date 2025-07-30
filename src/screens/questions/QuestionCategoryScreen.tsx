import React from "react";
import { View, StyleSheet } from "react-native";
import { QuestionType } from "../../models/question";
import { CustomText } from "../../components/text/customText";
import { AppBar } from "../../components/AppBar";
import { getTitle } from "./components/QuestionCategoryGrid";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../app/DrawerNavigator";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type QuestionCategoryScreenRouteProp = RouteProp<RootStackParamList, "QuestionCategoryScreen">;
type QuestionCategoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "QuestionCategoryScreen">;

export const QuestionCategoryScreen = () => {
  const navigation = useNavigation<QuestionCategoryScreenNavigationProp>();
  const route = useRoute<QuestionCategoryScreenRouteProp>();

  const { type } = route.params as { type: QuestionType };

  return (
    <View style={styles.container}>
      <AppBar
        title={getTitle(type)}
        leftIcon={<Ionicons name="arrow-back" size={24} color="white" />}
        rightIcon={<Ionicons name="search" size={24} color="white" />}
        onLeftPress={() => navigation.pop()}
        onRightPress={() => {}}
      />
      <CustomText>{type}</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
