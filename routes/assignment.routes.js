import express from "express";
const router = express.Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  assignMarksToStudent,
  createAssignment,
  getAllActiveAssignmentsOfTeacher,
  getAllAssignmentsOfTeacher,
  removeAssignment,
} from "../controllers/assignment.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

router.post(
  "/add",
  verifyJWT,
  upload.fields([
    {
      name: "assignments",
      maxCount: 1,
    },
  ]),
  createAssignment
);

router.patch("/:solutionId/assign-marks", verifyJWT, assignMarksToStudent);

router.delete("/remove", verifyJWT, removeAssignment);

router.post("/all", verifyJWT, getAllAssignmentsOfTeacher);
router.post("/all/active", verifyJWT, getAllActiveAssignmentsOfTeacher);

export default router;
