import express from "express";
const router = express.Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  getAllAssignments,
  getAllMissedAssignments,
  getAllPendingAssignments,
  getAllSubmittedAssignments,
  getSingleStudent,
  submitAssignment,
  submitFeedback,
} from "../controllers/student.controller.js";
import { getGradeCard } from "../controllers/solution.controller.js";

router.get("/", verifyJWT, getSingleStudent);
router.post("/submit-feedback", verifyJWT, submitFeedback);

router.get("/assignments/submitted", verifyJWT, getAllSubmittedAssignments);
router.get("/assignments/missed", verifyJWT, getAllMissedAssignments);
router.get("/assignments/pending", verifyJWT, getAllPendingAssignments);

//Testing gradecard Route
router.get("/get-grade-card", verifyJWT, getGradeCard)

export default router;
