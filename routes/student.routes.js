import express from "express";
const router = express.Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  getAllAssignments,
  getAllPendingAssignments,
  getAllSubmittedAssignments,
  getSingleStudent,
  submitAssignment,
  submitFeedback,
} from "../controllers/student.controller.js";

router.get("/", verifyJWT, getSingleStudent);
router.post("/submit-feedback", verifyJWT, submitFeedback);

export default router;
