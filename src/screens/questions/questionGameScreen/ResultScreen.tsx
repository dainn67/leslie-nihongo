import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { AppBar } from "../../../components/AppBar";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/DrawerNavigator";
import { useAppTheme } from "../../../theme";
import { CustomText } from "../../../components/text/customText";
import { createResultSummary } from "../../../service/questionService";
import { ChatbotService } from "../../../service/chatbotService";
import MainButton from "../../../components/buttons/MainButton";

type ResultScreenRouteProp = RouteProp<RootStackParamList, "ResultScreen">;
type ResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "ResultScreen">;

export const ResultScreen = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const navigation = useNavigation<ResultScreenNavigationProp>();
  const { colors } = useAppTheme();

  const { questions, mapAnswerIds } = route.params;
  const [correctQuestions, setCorrectQuestions] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const [aiInsight, setAiInsight] = useState("");

  useEffect(() => {
    let correctQuestions = 0;
    let incorrectQuestions = 0;
    let totalQuestions = questions.length;

    for (const question of questions) {
      const answer = mapAnswerIds[question.questionId];
      if (answer !== undefined && answer === question.answers.find((a) => a.isCorrect)?.answerId) {
        correctQuestions++;
      } else {
        incorrectQuestions++;
      }
    }

    setCorrectQuestions(correctQuestions);
    setIncorrectQuestions(incorrectQuestions);
    setTotalQuestions(totalQuestions);

    const summary = createResultSummary(questions, mapAnswerIds);

    ChatbotService.sendMessage({ message: summary, data: { analyze_result_game: 1 } }).then((result) => {
      setAiInsight(result);
    });
  }, []);

  const handleTryAgain = () => {
    navigation.replace("QuestionGameScreen", { questions: questions });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppBar
        title={"Kết quả"}
        leftIcon={<Ionicons name="arrow-back" size={24} color="white" />}
        onLeftPress={() => navigation.pop()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Statistics Section */}
        <View style={[styles.statsSection, { backgroundColor: colors.card }]}>
          <CustomText style={{ color: colors.text, marginBottom: 12 }} weight="SemiBold" size={18}>
            Thống kê chi tiết
          </CustomText>

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={[styles.statIcon, { backgroundColor: colors.success }]}>
                <Ionicons name="checkmark" size={20} color="white" />
              </View>
              <CustomText style={{ color: colors.text }} weight="Bold" size={24}>
                {correctQuestions}
              </CustomText>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={[styles.statIcon, { backgroundColor: colors.error }]}>
                <Ionicons name="close" size={20} color="white" />
              </View>
              <CustomText style={{ color: colors.text }} weight="Bold" size={24}>
                {incorrectQuestions}
              </CustomText>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={[styles.statIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="help-circle" size={20} color="white" />
              </View>
              <CustomText style={{ color: colors.text }} weight="Bold" size={24}>
                {totalQuestions}
              </CustomText>
            </View>
          </View>

          <View style={styles.performanceBar}>
            <View style={[styles.progressBar, { backgroundColor: colors.borderLight }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.success,
                    width: `${(correctQuestions / totalQuestions) * 100}%`,
                  },
                ]}
              />
            </View>
            <CustomText style={[styles.performanceText, { color: colors.textSecondary }]} size={14}>
              {correctQuestions}/{totalQuestions} câu trả lời đúng
            </CustomText>
          </View>
        </View>

        {/* AI Insight Section */}
        <View style={[styles.aiInsightSection, { backgroundColor: colors.card }]}>
          <View style={styles.aiInsightHeader}>
            <View style={{ marginRight: 8 }}>
              <Ionicons name="trending-up" size={16} color={colors.success} />
            </View>

            <CustomText style={{ color: colors.text }} weight="SemiBold" size={18}>
              Phân tích AI
            </CustomText>
          </View>

          <View style={styles.aiInsightContent}>
            <View style={styles.aiInsightItem}>
              <CustomText style={[styles.aiInsightText, { color: colors.text }]}>{aiInsight.replace(/<[^>]*>?/g, "")}</CustomText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.buttonContainer, { backgroundColor: colors.background }]}>
        <MainButton title="Thử lại" onPress={handleTryAgain} style={{ backgroundColor: colors.primary }} />
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
    paddingHorizontal: 16,
  },
  headerSection: {
    marginTop: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  resultTitle: {
    marginBottom: 8,
  },
  percentageText: {
    marginBottom: 8,
  },
  statsSection: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  performanceBar: {
    marginHorizontal: 8,
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  performanceText: {
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  aiInsightSection: {
    marginTop: 16,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  aiInsightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  aiIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  aiInsightContent: {
    gap: 12,
  },
  aiInsightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  aiInsightText: {
    flex: 1,
    marginLeft: 8,
    lineHeight: 20,
  },
});
