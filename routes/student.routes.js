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
} from "../controllers/student.controller.js";

router.get("/assignment/all", verifyJWT, getAllAssignments);
router.get("/assignment/submitted", verifyJWT, getAllSubmittedAssignments);
router.get("/assignment/pending", verifyJWT, getAllPendingAssignments);

router.post(
  "/assignment/submit",
  verifyJWT,
  upload.fields([
    {
      name: "submissions",
      maxCount: 7,
    },
  ]),
  submitAssignment
);

router.get("/", verifyJWT, getSingleStudent);
export default router;

