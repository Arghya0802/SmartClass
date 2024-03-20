import express from "express";
const router = express.Router();

import { login, register } from "../controllers/auth.controller.js";

router.patch("/register", register);
router.post("/login",login)

export default router;
