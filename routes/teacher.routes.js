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

router.get("/", verifyJWT, getSingleTeacher);

// router.get("/subjects", verifyJWT, getAllSubjectsOfTeacher);
export default router;
