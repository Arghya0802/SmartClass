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

router.get("/", verifyJWT, getSingleStudent);
router.post("/submit-feedback", verifyJWT, submitFeedback);

router.get("/assignments/submitted", verifyJWT, getAllSubmittedAssignments);
router.get("/assignments/missed", verifyJWT, getAllMissedAssignments);
router.get("/assignments/pending", verifyJWT, getAllPendingAssignments);

export default router;
