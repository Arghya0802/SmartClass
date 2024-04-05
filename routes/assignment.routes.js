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

router.post(
  "/add/:subjectId",
  verifyJWT,
  upload.fields([
    {
      name: "assignment",
      maxCount: 1,
    },
  ]),
  createAssignment
);

router.patch("/:solutionId/assign-marks", verifyJWT, assignMarksToStudent);

router.delete("/remove", verifyJWT, removeAssignment);

router.get("/:subjectId", verifyJWT, getAllAssignmentsOfTeacher);

export default router;
