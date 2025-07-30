import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { CustomText } from "../../../components/text/customText";
import { QuestionType } from "../../../models/question";
import { useNavigation } from "@react-navigation/native";
import { APP_SCREEN_CONFIG } from "../../../constants/appScreenCofig";

export const QuestionCategoryGrid = () => {
  const navigation = useNavigation();

  const getTitle = (type: QuestionType) => {
    switch (type) {
      case QuestionType.Vocab:
        return "Từ Vựng";
      case QuestionType.Grammar:
        return "Ngữ Pháp";
      case QuestionType.ReadingComprehension:
        return "Đọc Hiểu";
      case QuestionType.Listening:
        return "Nghe Hiểu";
    }
  };

  const _handleNavigateToQuestionType = (type: QuestionType) => {
    navigation.setParams({ type } as never);
    navigation.navigate(APP_SCREEN_CONFIG.QUESTION_CATEGORY_SCREEN as never);
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
