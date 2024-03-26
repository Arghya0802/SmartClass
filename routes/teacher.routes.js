import express from "express";
const router = express.Router();

import { upload } from "../middlewares/multer.middleware.js";
import {
  addAssignment,
  addResources,
  assignMarks,
  getSingleTeacher,
  giveAttendanceToStudent,
} from "../controllers/teacher.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.post(
  "/resources/add",
  verifyJWT,
  upload.fields([
    {
      name: "resources",
      maxCount: 5,
    },
  ]),
  addResources
);

router.post(
  "/assignment/add",
  verifyJWT,
  upload.fields([
    {
      name: "assignments",
      maxCount: 5,
    },
  ]),
  addAssignment
);

router.post("/assignment/upload-marks", verifyJWT, assignMarks);

router.get("/", verifyJWT, getSingleTeacher);

router.post("/attendance", verifyJWT, giveAttendanceToStudent);

export default router;
