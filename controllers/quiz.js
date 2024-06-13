import { asyncErrorHandler } from "../errorController/errorControllers.js";
import questionModel from "../models/questionModel.js";
import testSessionModel from "../models/testSessionModel.js";
import { status } from "../utils/constants.js";
import { AppError } from "../utils/customResponse.js";
import { calculatePercentage } from "../utils/mathOperations.js";
import updateDifficulty from "../utils/updateQuestionDifficulty.js";
import OpenAI from "openai";

// const openai = new OpenAI({
//   organization: "orgId",
//   project: "prjId",
// });

export const startSession = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;

  const session = await testSessionModel.create({ userId: user._id });

  res.status(status.SUCCESS).json({
    success: true,
    session,
  });
});

export const getQuestion = asyncErrorHandler(async (req, res, next) => {
  const { correct, currQuestionId, sessionId } = req.query;

  let boolCorrect = correct === "true" ? true : false;

  if (!currQuestionId) {
    const firstQuestion = await questionModel.findOne({ difficulty: 1 });

    return res.status(status.SUCCESS).json({
      success: true,
      question: firstQuestion,
      testCompleted: false,
    });
  }

  const answeredQuestion = await questionModel.findOne({ _id: currQuestionId });

  const currDifficulty = answeredQuestion.difficulty;

  const newDifficulty = updateDifficulty(boolCorrect, Number(currDifficulty));

  const session = await testSessionModel.findById(sessionId);

  if (!session)
    return next(
      new AppError("test session not found or expired", status.BAD_REQUEST)
    );

  const alreadyShownQuestions = session.questionsShowed.map(
    (e) => e.questionId
  );

  // Add question to already shown question list
  session.questionsShowed.push({
    questionId: answeredQuestion._id,
    isCorrect: correct,
  });

  await session.save();

  const nextQuestion = await questionModel.findOne({
    _id: { $nin: alreadyShownQuestions },
    difficulty: newDifficulty,
  });

  if (!nextQuestion)
    return res
      .status(status.SUCCESS)
      .json({ success: true, testCompleted: true });

  return res.status(status.SUCCESS).json({
    success: true,
    question: nextQuestion,
    testCompleted: false,
  });
});

export const getResult = async (req, res, next) => {
  const { sessionId } = req.query;

  const session = await testSessionModel
    .findOne({ _id: sessionId })
    .populate("questionsShowed.questionId");

  let result = {};

  let totalQuestions = session.questionsShowed.length;
  result.questions = totalQuestions;
  result.startDate = session.createdAt;

  let easy = session.questionsShowed.filter(
    (e) => e.questionId.difficulty == 1
  );
  let moderate = session.questionsShowed.filter(
    (e) => e.questionId.difficulty == 2
  );
  let slightHard = session.questionsShowed.filter(
    (e) => e.questionId.difficulty == 3
  );
  let hard = session.questionsShowed.filter(
    (e) => e.questionId.difficulty == 4
  );

  result.difficultySplit = [
    { label: "Easy", per: calculatePercentage(easy.length, totalQuestions) },
    {
      label: "Moderate",
      per: calculatePercentage(moderate.length, totalQuestions),
    },
    {
      label: "Slight Hard",
      per: calculatePercentage(slightHard.length, totalQuestions),
    },
    { label: "Hard", per: calculatePercentage(hard.length, totalQuestions) },
  ];

  let answeredCorrect = session.questionsShowed.filter((e) => e.isCorrect);

  let pointsObtained = answeredCorrect.reduce((acc, obj) => {
    obj = JSON.parse(JSON.stringify(obj));
    return acc + obj.questionId.point;
  }, 0);
  let totalPoints = session.questionsShowed.reduce((acc, obj) => {
    obj = JSON.parse(JSON.stringify(obj));
    return acc + obj.questionId.point;
  }, 0);

  result.answeredCorrect = answeredCorrect.length;
  result.percentage = (pointsObtained / totalPoints) * 100;

  res.status(status.SUCCESS).json({
    success: true,
    result,
  });
};

export const getSessions = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;

  const sessions = await testSessionModel.find({ userId: user._id });

  res.status(status.SUCCESS).json({
    success: true,
    sessions,
  });
});
