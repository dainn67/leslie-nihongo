import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { AppBar } from "../../../components/AppBar";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/DrawerNavigator";
import { useTheme } from "../../../theme";
import { CustomText } from "../../../components/text/customText";
import MainButton from "../../../components/buttons/MainButton";

type ResultScreenRouteProp = RouteProp<RootStackParamList, "ResultScreen">;
type ResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "ResultScreen">;

export const ResultScreen = () => {
  const navigation = useNavigation<ResultScreenNavigationProp>();
  const { colors } = useTheme();

  // Mock data - sẽ được thay thế bằng data thực sau
  const mockData = {
    totalQuestions: 10,
    correctAnswers: 7,
    incorrectAnswers: 3,
    passPercentage: 70,
  };

  const handleTryAgain = () => {
    // TODO: Implement try again logic
    navigation.pop();
  };

  const handleGoHome = () => {
    // TODO: Navigate to home
    navigation.pop();
  };

  const getPassStatus = (percentage: number) => {
    if (percentage >= 80) return { status: "Xuất sắc", color: colors.success, icon: "trophy" };
    if (percentage >= 60) return { status: "Đạt", color: colors.success, icon: "checkmark-circle" };
    return { status: "Chưa đạt", color: colors.error, icon: "close-circle" };
  };

  const passStatus = getPassStatus(mockData.passPercentage);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppBar
        title={"Kết quả"}
        leftIcon={<Ionicons name="arrow-back" size={24} color="white" />}
        onLeftPress={() => navigation.pop()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={[styles.headerSection, { backgroundColor: colors.card }]}>
          <View style={[styles.resultCircle, { borderColor: passStatus.color }]}>
            <Ionicons name={passStatus.icon as any} size={48} color={passStatus.color} />
          </View>
          <CustomText style={[styles.resultTitle, { color: colors.text }]} weight="Bold" size={24}>
            {passStatus.status}
          </CustomText>
          <CustomText style={[styles.percentageText, { color: passStatus.color }]} weight="Bold" size={36}>
            {mockData.passPercentage}%
          </CustomText>
        </View>

        {/* Statistics Section */}
        <View style={[styles.statsSection, { backgroundColor: colors.card }]}>
          <CustomText style={[styles.sectionTitle, { color: colors.text }]} weight="SemiBold" size={18}>
            Thống kê chi tiết
          </CustomText>

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={[styles.statIcon, { backgroundColor: colors.success }]}>
                <Ionicons name="checkmark" size={20} color="white" />
              </View>
              <CustomText style={[styles.statNumber, { color: colors.text }]} weight="Bold" size={24}>
                {mockData.correctAnswers}
              </CustomText>
              <CustomText style={[styles.statLabel, { color: colors.textSecondary }]} size={14}>
                Câu đúng
              </CustomText>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={[styles.statIcon, { backgroundColor: colors.error }]}>
                <Ionicons name="close" size={20} color="white" />
              </View>
              <CustomText style={[styles.statNumber, { color: colors.text }]} weight="Bold" size={24}>
                {mockData.incorrectAnswers}
              </CustomText>
              <CustomText style={[styles.statLabel, { color: colors.textSecondary }]} size={14}>
                Câu sai
              </CustomText>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={[styles.statIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="help-circle" size={20} color="white" />
              </View>
              <CustomText style={[styles.statNumber, { color: colors.text }]} weight="Bold" size={24}>
                {mockData.totalQuestions}
              </CustomText>
              <CustomText style={[styles.statLabel, { color: colors.textSecondary }]} size={14}>
                Tổng câu hỏi
              </CustomText>
            </View>
          </View>
        </View>

        {/* Performance Bar */}
        <View style={[styles.performanceSection, { backgroundColor: colors.card }]}>
          <CustomText style={[styles.sectionTitle, { color: colors.text }]} weight="SemiBold" size={18}>
            Hiệu suất
          </CustomText>

          <View style={styles.performanceBar}>
            <View style={[styles.progressBar, { backgroundColor: colors.borderLight }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: passStatus.color,
                    width: `${mockData.passPercentage}%`,
                  },
                ]}
              />
            </View>
            <CustomText style={[styles.performanceText, { color: colors.textSecondary }]} size={14}>
              {mockData.correctAnswers}/{mockData.totalQuestions} câu trả lời đúng
            </CustomText>
          </View>
        </View>

        {/* AI Insight Section */}
        <View style={[styles.aiInsightSection, { backgroundColor: colors.card }]}>
          <View style={styles.aiInsightHeader}>
            <View style={[styles.aiIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="sparkles" size={20} color="white" />
            </View>
            <CustomText style={[styles.sectionTitle, { color: colors.text }]} weight="SemiBold" size={18}>
              Phân tích AI
            </CustomText>
          </View>

          <View style={styles.aiInsightContent}>
            <View style={styles.aiInsightItem}>
              <Ionicons name="trending-up" size={16} color={colors.success} />
              <CustomText style={[styles.aiInsightText, { color: colors.text }]} size={14}>
                <CustomText style={{ fontWeight: "bold" }}>Điểm mạnh:</CustomText> Bạn thể hiện tốt trong phần ngữ pháp
                cơ bản và từ vựng hàng ngày.
              </CustomText>
            </View>

            <View style={styles.aiInsightItem}>
              <Ionicons name="alert-circle" size={16} color={colors.warning} />
              <CustomText style={[styles.aiInsightText, { color: colors.text }]} size={14}>
                <CustomText style={{ fontWeight: "bold" }}>Cần cải thiện:</CustomText> Các câu hỏi về kanji và ngữ pháp
                nâng cao cần được ôn tập thêm.
              </CustomText>
            </View>

            <View style={styles.aiInsightItem}>
              <Ionicons name="book" size={16} color={colors.primary} />
              <CustomText style={[styles.aiInsightText, { color: colors.text }]} size={14}>
                <CustomText style={{ fontWeight: "bold" }}>Gợi ý học tập:</CustomText> Tập trung vào chương 3-4 của sách
                giáo khoa và luyện tập thêm với flashcard kanji.
              </CustomText>
            </View>

            <View style={styles.aiInsightItem}>
              <Ionicons name="time" size={16} color={colors.secondary} />
              <CustomText style={[styles.aiInsightText, { color: colors.text }]} size={14}>
                <CustomText style={{ fontWeight: "bold" }}>Thời gian trung bình:</CustomText> 45 giây/câu - tốc độ phù
                hợp, nhưng có thể cải thiện độ chính xác.
              </CustomText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.buttonContainer, { backgroundColor: colors.background }]}>
        <MainButton
          title="Thử lại"
          onPress={handleTryAgain}
          style={[styles.tryAgainButton, { backgroundColor: colors.primary }]}
          showShadow
        />
        <MainButton
          title="Về trang chủ"
          onPress={handleGoHome}
          style={[styles.homeButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
          textStyle={{ color: colors.text }}
          showShadow
        />
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
  sectionTitle: {
    marginBottom: 16,
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
  statNumber: {
    marginBottom: 4,
  },
  statLabel: {
    textAlign: "center",
  },
  performanceSection: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  performanceBar: {
    marginTop: 8,
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
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  tryAgainButton: {
    marginBottom: 12,
  },
  homeButton: {
    borderWidth: 1,
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
    marginBottom: 16,
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
