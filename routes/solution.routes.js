import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createSolution,
  getAllSolutions,
} from "../controllers/solution.controller.js";
const router = express.Router();

router.post(
  "/add/:assignmentId",
  verifyJWT,
  upload.fields([
    {
      name: "solutions",
      maxCount: 1,
    },
  ]),
  createSolution
);

router.get("/all/:subjectId", verifyJWT, getAllSolutions);

export default router;

