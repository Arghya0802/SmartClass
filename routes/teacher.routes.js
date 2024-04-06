import express from "express";
const router = express.Router();

import { upload } from "../middlewares/multer.middleware.js";
import {
  addAssignment,
  addResources,
  assignMarks,
  getAllSubjectsOfTeacher,
  getSingleTeacher,
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

// router.get("/subjects", verifyJWT, getAllSubjectsOfTeacher);
export default router;
