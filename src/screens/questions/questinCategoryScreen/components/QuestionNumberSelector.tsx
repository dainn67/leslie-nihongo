import React, { useMemo } from "react";
import { Dimensions, Modal, StyleSheet, View, TouchableOpacity } from "react-native";
import { useTheme } from "../../../../theme";
import { CustomText } from "../../../../components/text/customText";

interface QuestionNumberSelectorProps {
  title?: string;
  totalQuestions?: number;
  selectedQuestion?: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onSelectQuestion: (questionAmount: number) => void;
}

export const QuestionNumberSelector = ({
  title = "Chọn số lượng câu hỏi",
  totalQuestions = 30,
  selectedQuestion = 0,
  visible,
  setVisible,
  onSelectQuestion,
}: QuestionNumberSelectorProps) => {
  const { colors } = useTheme();

  // Tính toán các tùy chọn số lượng câu hỏi được làm tròn
  const questionOptions = useMemo(() => {
    const options: number[] = [];
    const maxOptions = 6;

    // Đảm bảo luôn có ít nhất 1 tùy chọn
    if (totalQuestions <= 0) {
      return [10];
    }

    // Trường hợp totalQuestions nhỏ hơn hoặc bằng 10
    if (totalQuestions <= 10) {
      return [totalQuestions];
    }

    // Tạo các tùy chọn từ 10 đến totalQuestions với bước nhảy 10
    for (let i = 10; i <= Math.min(totalQuestions, 60); i += 10) {
      options.push(i);
    }

    // Nếu totalQuestions không chia hết cho 10, thêm totalQuestions vào cuối
    if (totalQuestions % 10 !== 0 && totalQuestions > options[options.length - 1]) {
      options.push(totalQuestions);
    }

    // Nếu vẫn chưa đủ tùy chọn và totalQuestions lớn hơn 60, thêm các giá trị trung gian
    if (options.length < maxOptions && totalQuestions > 60) {
      const remainingSlots = maxOptions - options.length;
      const step = Math.ceil((totalQuestions - 60) / remainingSlots);

      for (let i = 70; i <= totalQuestions; i += step) {
        if (options.length >= maxOptions) break;
        if (!options.includes(i)) {
          options.push(i);
        }
      }
    }

    // Đảm bảo luôn có ít nhất 1 tùy chọn
    if (options.length === 0) {
      options.push(Math.min(totalQuestions, 10));
    }

    return options.sort((a, b) => a - b);
  }, [totalQuestions]);

  const handleSelectQuestion = (amount: number) => {
    onSelectQuestion(amount);
    setVisible(false);
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.dialog, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
          {/* Header */}
          <View style={styles.header}>
            <CustomText weight="Bold" size={20} style={[styles.title, { color: colors.text }]}>
              {title}
            </CustomText>
            <CustomText size={14} style={[styles.subtitle, { color: colors.textSecondary }]}>
              Chọn số lượng câu hỏi bạn muốn làm
            </CustomText>
          </View>

          {/* Question Options */}
          <View style={styles.optionsContainer}>
            {questionOptions.length > 0 ? (
              questionOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: selectedQuestion === option ? colors.primary : colors.backgroundSecondary,
                      borderColor: selectedQuestion === option ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => handleSelectQuestion(option)}
                  activeOpacity={0.7}
                >
                  <CustomText
                    weight="SemiBold"
                    size={18}
                    style={[styles.optionText, { color: selectedQuestion === option ? colors.background : colors.text }]}
                  >
                    {option}
                  </CustomText>
                  {selectedQuestion === option && <View style={[styles.checkIcon, { backgroundColor: colors.background }]} />}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.fallbackContainer}>
                <CustomText size={16} style={[styles.fallbackText, { color: colors.textSecondary }]}>
                  Không có tùy chọn nào
                </CustomText>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={[styles.cancelButton, { borderColor: colors.border }]} onPress={() => setVisible(false)} activeOpacity={0.7}>
              <CustomText weight="SemiBold" size={16} style={[styles.cancelText, { color: colors.text }]}>
                Hủy
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  dialog: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    maxHeight: "80%",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.8,
  },
  optionsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginVertical: 10,
  },
  optionButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    borderWidth: 1,
    width: 40,
    height: 40,
    marginHorizontal: 10,
    position: "relative",
  },
  optionText: {
    textAlign: "center",
  },
  checkIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: "absolute",
    top: 8,
    right: 8,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelText: {
    textAlign: "center",
  },
  fallbackContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  fallbackText: {
    textAlign: "center",
  },
});
