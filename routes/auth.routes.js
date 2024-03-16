import express from "express";
const router = express.Router();

import { register } from "../controllers/auth.controller.js";

router.patch("/register", register);

export default router;
