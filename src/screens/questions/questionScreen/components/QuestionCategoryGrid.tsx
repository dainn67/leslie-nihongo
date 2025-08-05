import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { CustomText } from "../../../../components/text/customText";
import { QuestionType, QuestionTypeTitles } from "../../../../models/question";
import { useAppTheme } from "../../../../theme";

interface QuestionCategoryGridProps {
  onPress: (type: QuestionType) => void;
}

export const QuestionCategoryGrid = ({ onPress }: QuestionCategoryGridProps) => {
  const { width } = Dimensions.get("window");
  const gridItemWidth = (width - 60) / 2;
  const { colors } = useAppTheme();

  return (
    <View style={[styles.gridContainer, { backgroundColor: colors.background }]}>
      {Object.values(QuestionType).map((type, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.gridItem, { width: gridItemWidth, backgroundColor: colors.backgroundTertiary }]}
          onPress={() => onPress(type)}
        >
          <CustomText key={index} style={{ textAlign: "center", color: colors.text }}>
            {QuestionTypeTitles[type]}
          </CustomText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  gridItem: {
    height: 180,
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
