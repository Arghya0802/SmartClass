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
      maxCount: 3,
    },
  ]),
  createSolution
);

router.get("/all/:assignmentId", verifyJWT, getAllSolutions);

export default router;
