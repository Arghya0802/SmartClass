import express from "express";
const router = express.Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  assignMarksToStudent,
  createAssignment,
  getAllAssignmentsOfTeacher,
  removeAssignment,
} from "../controllers/assignment.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

router.post("/add", verifyJWT, createAssignment);

router.patch("/:solutionId/assign-marks", verifyJWT, assignMarksToStudent);

router.delete("/remove", verifyJWT, removeAssignment);

router.post("/all", verifyJWT, getAllAssignmentsOfTeacher);

export default router;
