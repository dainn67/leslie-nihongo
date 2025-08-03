import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Animated } from "react-native";
import { Question, QuestionType, QuestionTypeTitles } from "../../../models/question";
import { AppBar } from "../../../components/AppBar";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../app/DrawerNavigator";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { QuestionView } from "../../chatbot/components/chatBubble/QuestionView";
import { QuestionNumberSelector } from "./components/QuestionNumberSelector";
import { createReviseQuestionSet } from "../../../service/questionService";
import { getQuestionsByType } from "../../../storage/database/tables";
import { SimpleTextInput } from "../../../components/input/SimpleTextInput";
import MainButton from "../../../components/buttons/MainButton";

type QuestionListScreenRouteProp = RouteProp<RootStackParamList, "QuestionListScreen">;
type QuestionListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "QuestionListScreen">;

export const QuestionListScreen = () => {
  const navigation = useNavigation<QuestionListScreenNavigationProp>();
  const route = useRoute<QuestionListScreenRouteProp>();

  const { type } = route.params as { type: QuestionType };

  // Full question list and display question (with search filter)
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  // Revise questions dialog
  const [amountSelectorVisible, setAmountSelectorVisible] = useState(false);

  // Search feature
  const [searchWord, setSearchWord] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    const questions = getQuestionsByType(type);
    setQuestions(questions);
    setFilteredQuestions(questions);
  }, []);

  const handleSelectQuestion = (amount: number) => {
    const selectedQuestions = createReviseQuestionSet(questions, amount);
    navigation.navigate("QuestionGameScreen", { questions: selectedQuestions });
  };

  const handleOpenSearch = () => {
    if (isSearchVisible) {
      // Hide search with animation
      Animated.timing(searchAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setIsSearchVisible(false);
      });
    } else {
      // Show search with animation
      setIsSearchVisible(true);
      Animated.timing(searchAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSearch = (text: string) => {
    setSearchWord(text);

    const searchText = text.toLowerCase();

    if (searchText.length === 0) {
      setFilteredQuestions(questions);
    } else {
      const filteredQuestions = questions.filter((q) => {
        const questionText = q.question.toLowerCase();
        const answerText = q.answers.map((a) => a.text.toLowerCase()).join(". ");
        const explanationText = q.explanation.toLowerCase();
        return (
          questionText.includes(searchText) || answerText.includes(searchText) || explanationText.includes(searchText)
        );
      });
      setFilteredQuestions(filteredQuestions);
    }
  };

  return (
    <View style={styles.container}>
      <AppBar
        title={QuestionTypeTitles[type]}
        leftIcon={<Ionicons name="arrow-back" size={24} color="white" />}
        rightIcon={<Ionicons name={isSearchVisible ? "search-circle-outline" : "search"} size={24} color="white" />}
        onLeftPress={() => navigation.pop()}
        onRightPress={handleOpenSearch}
      />

      {isSearchVisible && (
        <Animated.View
          style={[
            styles.searchContainer,
            {
              opacity: searchAnimation,
              transform: [
                {
                  translateY: searchAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.searchInputWrapper}>
            <SimpleTextInput value={searchWord} onChangeText={handleSearch} placeholder="Tìm kiếm câu hỏi..." />
          </View>
        </Animated.View>
      )}

      <ScrollView style={styles.contentContainer}>
        {filteredQuestions.map((question, index) => (
          <View key={question.questionId} style={styles.questionContainer}>
            <QuestionView
              question={question}
              questionIndex={index}
              totalQuestions={questions.length}
              bookmarked={true}
              showCorrectAnswer={true}
            />
          </View>
        ))}
      </ScrollView>
      <MainButton title="Ôn tập" onPress={() => setAmountSelectorVisible(true)} style={styles.buttonContainer} />

      <QuestionNumberSelector
        totalQuestions={questions.length}
        visible={amountSelectorVisible}
        setVisible={setAmountSelectorVisible}
        onSelectQuestion={(amount) => handleSelectQuestion(amount)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  questionContainer: {
    paddingHorizontal: 8,
  },
  buttonContainer: {
    borderRadius: 16,
    margin: 16,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  searchInputWrapper: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
});
