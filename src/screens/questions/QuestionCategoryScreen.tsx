import React from "react";
import { View, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { QuestionType } from "../../models/question";
import { CustomText } from "../../components/text/customText";

export const QuestionCategoryScreen = () => {
  const route = useRoute();
  const { type } = route.params as { type: QuestionType } | undefined;

  return (
    <View style={styles.container}>
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
