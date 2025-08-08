import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { CustomText } from "../../../../components/text/customText";
import { Question } from "../../../../models/question";
import { IconButton } from "../../../../components/buttons";
import { AppIcons } from "../../../../constants/appIcons";
import { Answer } from "../../../../models/answer";
import { useAppTheme } from "../../../../theme";
import Tts from "react-native-tts";

interface QuestionViewProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer?: number;
  bookmarked: boolean;
  showCorrectAnswer?: boolean;
  onAnswerSelect?: (index: number) => void;
  onBookmarkPress?: (isBookmarked: boolean) => void;
  onAudioPlay?: (played: boolean) => void;
}

export const QuestionView = ({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  bookmarked,
  showCorrectAnswer,
  onAnswerSelect,
  onBookmarkPress,
  onAudioPlay,
}: QuestionViewProps) => {
  const { colors, isDarkMode } = useAppTheme();
  const getAnswerLabel = (index: number) => {
    const labels = ["A", "B", "C", "D"];
    return (labels[index] || "A") + ".";
  };

  const [playAudio, setPlayAudio] = useState(false);

  const handleToggleAudio = () => {
    const newState = !playAudio;
    onAudioPlay?.(newState);
    setPlayAudio(newState);

    Tts.stop();
    if (newState) {
      Tts.addEventListener("tts-finish", () => setPlayAudio(false));
      Tts.speak(question.audio);
    }
  };

  return (
    <View style={[styles.questionCard, { backgroundColor: isDarkMode ? colors.backgroundSecondary : "white" }]}>
      <View style={styles.questionHeader}>
        {/* Question Index and Text */}
        <View style={styles.questionHeaderContent}>
          <View style={styles.questionIndex}>
            <CustomText style={[styles.questionNumberText, { color: isDarkMode ? colors.textTertiary : "gray" }]}>
              Câu hỏi {questionIndex + 1}/{totalQuestions}:
            </CustomText>
          </View>
          <CustomText style={[styles.questionText, { color: isDarkMode ? colors.textSecondary : "#2C3E50" }]}>
            {question.question}
          </CustomText>
        </View>

        {/* Save icon button */}
        <View>
          <IconButton
            icon={bookmarked ? AppIcons.bookmarked : AppIcons.bookmark}
            style={styles.saveButton}
            onPress={() => onBookmarkPress?.(!bookmarked)}
          />
          {question.audio && <IconButton icon={playAudio ? AppIcons.audioOn : AppIcons.audioOff} onPress={handleToggleAudio} />}
        </View>
      </View>

      {/* Answers */}
      <View style={styles.answersContainer}>
        {question.answers.map((a: Answer, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => onAnswerSelect?.(a.answerId)}
            style={[
              styles.answerCard,
              { backgroundColor: isDarkMode ? colors.backgroundTertiary : "#F8F9FA" },
              (selectedAnswer === a.answerId || showCorrectAnswer) && a.isCorrect && styles.correctAnswer,
              selectedAnswer === a.answerId && !a.isCorrect && styles.wrongAnswer,
              selectedAnswer !== undefined && selectedAnswer !== a.answerId && a.isCorrect && styles.correctAnswer,
            ]}
            disabled={selectedAnswer !== undefined}
          >
            <View style={styles.answerContent}>
              <CustomText
                style={[
                  styles.answerLabelText,
                  { color: isDarkMode ? "white" : "#666" },
                  selectedAnswer === a.answerId && !a.isCorrect && styles.wrongLabel,
                  (showCorrectAnswer || (selectedAnswer !== undefined && selectedAnswer !== a.answerId)) &&
                    a.isCorrect &&
                    styles.correctLabel,
                ]}
              >
                {getAnswerLabel(index)}
              </CustomText>
              <CustomText
                style={[
                  styles.answerText,
                  { color: isDarkMode ? "white" : "#2C3E50" },
                  ((showCorrectAnswer && a.isCorrect) ||
                    selectedAnswer === a.answerId ||
                    (selectedAnswer !== undefined && selectedAnswer != a.answerId && a.isCorrect)) &&
                    styles.selectedAnswerText,
                ]}
              >
                {a.text}
              </CustomText>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Explanation */}
      {selectedAnswer !== undefined && (
        <View style={styles.explanationContainer}>
          <View style={styles.explanationHeader}>
            <CustomText style={styles.explanationIcon}>💡</CustomText>
            <CustomText style={styles.explanationTitle}>Giải thích</CustomText>
          </View>
          <CustomText style={styles.explanationText}>{question.explanation}</CustomText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    borderRadius: 16,
    padding: 20,
    paddingBottom: 0,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  questionHeaderContent: {
    flex: 1,
    marginRight: 20,
  },
  questionIndex: {
    marginBottom: 2,
  },
  saveButton: {
    marginBottom: 8,
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    lineHeight: 24,
  },
  answersContainer: {
    marginBottom: 4,
  },
  answerCard: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
    overflow: "hidden",
  },
  answerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  answerLabelText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    marginRight: 12,
    marginVertical: 4,
  },
  correctLabel: {
    color: "#4CAF50",
  },
  wrongLabel: {
    color: "#F44336",
  },
  answerText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  selectedAnswerText: {
    color: "black",
    fontWeight: "600",
  },
  correctAnswer: {
    backgroundColor: "#E8F5E8",
    borderColor: "#4CAF50",
  },
  wrongAnswer: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
  },
  explanationContainer: {
    backgroundColor: "#F0F8FF",
    borderRadius: 4,
    padding: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  explanationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  explanationIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  explanationText: {
    fontSize: 14,
    color: "#34495E",
    lineHeight: 20,
  },
});
