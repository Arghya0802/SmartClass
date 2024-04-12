import express from "express";
const router = express.Router();

import {
  changePassword,
  login,
  logout,
  register,
  sendOtp,
  verifyOtp,
  verifyToken,
  viewProfile,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.patch("/register", register);
router.post("/login", login);
router.get("/logout", verifyJWT, logout);

router.get("/verify", verifyToken);
router.get("/profile", verifyJWT, viewProfile);

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", changePassword);

export default router;
