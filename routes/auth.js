import express from "express";
import {
  getLoggedInProfile,
  login,
  register,
  googleLogin,
} from "../controllers/auth.js";
import { isAuthenticated } from "../utils/isAuthenticated.js";

const router = express.Router();

router.post("/login", login);
router.post("/googleLogin", googleLogin);
router.post("/register", register);
router.get("/profile", isAuthenticated, getLoggedInProfile);

export default router;
