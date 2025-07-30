import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { CustomText } from "../../../components/text/customText";
import { QuestionType } from "../../../models/question";
import { useNavigation } from "@react-navigation/native";
import { AppScreenConfig } from "../../../constants/appScreenCofig";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/DrawerNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "QuestionCategoryScreen">;

export const QuestionCategoryGrid = () => {
  const navigation = useNavigation<NavigationProp>();

  const _handleNavigateToQuestionType = (type: QuestionType) => {
    navigation.navigate("QuestionCategoryScreen", { type });
  };

  return (
    <View style={styles.gridContainer}>
      {Object.values(QuestionType).map((type, index) => (
        <TouchableOpacity key={index} style={styles.gridItem} onPress={() => _handleNavigateToQuestionType(type)}>
          <CustomText key={index} style={{ textAlign: "center" }}>
            {getTitle(type)}
          </CustomText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  gridItem: {
    width: "45%",
    height: 200,
    margin: 10,
    padding: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export const getTitle = (type: QuestionType) => {
  switch (type) {
    case QuestionType.Vocabulary:
      return "Từ Vựng";
    case QuestionType.Grammar:
      return "Ngữ Pháp";
    case QuestionType.ReadingComprehension:
      return "Đọc Hiểu";
    case QuestionType.Listening:
      return "Nghe Hiểu";
  }
};
