import express from "express";
const router = express.Router();

import {
  login,
  logout,
  register,
  verifyToken,
  viewProfile,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.patch("/register", register);
router.post("/login", login);
router.get("/logout", verifyJWT, logout);

router.get("/verify", verifyToken);
router.get("/profile", verifyJWT, viewProfile);

export default router;
