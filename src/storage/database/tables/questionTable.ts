import { Question } from "../../../models/question";
import { db } from "../database";

export const QuestionTable = {
  tableName: "Question",
  columnId: "id",
  columnQuestionId: "questionId",
  columnQuestion: "question",
  columnExplanation: "explanation",
};

export const AnswerTable = {
  tableName: "Answer",
  columnId: "id",
  columnQuestionId: "questionId",
  columnAnswer: "answer",
  columnIsCorrect: "isCorrect",
};

export const createQuestionTable = () => {
  db.withTransactionSync(() => {
    db.execSync(
      `CREATE TABLE IF NOT EXISTS ${QuestionTable.tableName} (
          ${QuestionTable.columnId} INTEGER PRIMARY KEY AUTOINCREMENT,
          ${QuestionTable.columnQuestionId} INTEGER,
          ${QuestionTable.columnQuestion} TEXT,
          ${QuestionTable.columnExplanation} TEXT
        )`
    );

    db.execSync(
      `CREATE TABLE IF NOT EXISTS ${AnswerTable.tableName} (
          ${AnswerTable.columnId} INTEGER PRIMARY KEY AUTOINCREMENT,
          ${AnswerTable.columnQuestionId} INTEGER,
          ${AnswerTable.columnAnswer} TEXT,
          ${AnswerTable.columnIsCorrect} INTEGER,
          FOREIGN KEY (${AnswerTable.columnQuestionId}) REFERENCES ${QuestionTable.tableName}(${QuestionTable.columnQuestionId})
        )`
    );
  });
};

export const getAllQuestions = () => {
  const questionRows = db.getAllSync(`SELECT * FROM ${QuestionTable.tableName}`);

  const questions: Question[] = questionRows.map((row: any) => ({
    id: row.id,
    questionId: row.questionId,
    question: row.question,
    explanation: row.explanation,
    answers: [],
    bookmarked: row.bookmarked,
  }));

  const answerRows = db.getAllSync(`SELECT * FROM ${AnswerTable.tableName}`);

  answerRows.forEach((row: any) => {
    const question = questions.find((question) => question.questionId === row.questionId);
    if (question) {
      question.answers.push({
        text: row.answer,
        isCorrect: row.isCorrect,
      });
    }
  });

  return questions;
};

export const insertQuestions = (questions: Question[]) => {
  db.withTransactionSync(() => {
    const questionValues = questions
      .map((question) => {
        const questionString = question.question.replaceAll('"', '\\"');
        const explanationString = question.explanation.replaceAll('"', '\\"');
        return `(${question.questionId}, "${questionString}", "${explanationString}")`;
      })
      .join(", ");
    console.log(
      `INSERT INTO ${QuestionTable.tableName} (${QuestionTable.columnQuestionId}, ${QuestionTable.columnQuestion}, ${QuestionTable.columnExplanation}) VALUES ${questionValues}`
    );
    db.execSync(
      `INSERT INTO ${QuestionTable.tableName} (${QuestionTable.columnQuestionId}, ${QuestionTable.columnQuestion}, ${QuestionTable.columnExplanation}) VALUES ${questionValues}`
    );

    const answerValues = questions
      .flatMap((question) =>
        question.answers.map((answer) => {
          const answerString = answer.text.replaceAll('"', '\\"');
          return `(${question.questionId}, "${answerString}", "${answer.isCorrect ? 1 : 0}")`;
        })
      )
      .join(", ");
    db.execSync(
      `INSERT INTO ${AnswerTable.tableName} (${AnswerTable.columnQuestionId}, ${AnswerTable.columnAnswer}, ${AnswerTable.columnIsCorrect}) VALUES ${answerValues}`
    );
  });
};

export const deleteQuestion = (questionId: number) => {
  db.withTransactionSync(() => {
    db.execSync(`DELETE FROM ${AnswerTable.tableName} WHERE ${AnswerTable.columnQuestionId} = ${questionId}`);
    db.execSync(`DELETE FROM ${QuestionTable.tableName} WHERE ${QuestionTable.columnQuestionId} = ${questionId}`);
  });
};

export const clearAllData = () => {
  db.withTransactionSync(() => {
    db.execSync(`DELETE FROM ${QuestionTable.tableName}`);
    db.execSync(`DELETE FROM ${AnswerTable.tableName}`);
  });
};

export const deleteAllTables = () => {
  db.withTransactionSync(() => {
    db.execSync(`DROP TABLE IF EXISTS ${QuestionTable.tableName}`);
    db.execSync(`DROP TABLE IF EXISTS ${AnswerTable.tableName}`);
  });
};
