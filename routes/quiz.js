import express from "express";
import {
  getQuestion,
  getResult,
  startSession,
  getSessions,
} from "../controllers/quiz.js";
import { isAuthenticated } from "../utils/isAuthenticated.js";

const router = express.Router();

router.get("/question", isAuthenticated, getQuestion);

router.post("/startSession", isAuthenticated, startSession);

router.get("/result", isAuthenticated, getResult);

router.get("/sessions", isAuthenticated, getSessions);

export default router;
