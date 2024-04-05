import express from "express";
const router = express.Router();

import { verifyJWT } from "../middlewares/auth.middleware";

router.post("/add/:subjectId", verifyJWT, createAssignment);

export default router;
