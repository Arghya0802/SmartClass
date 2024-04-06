import express from "express";
const router = express.Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { assignMarks } from "../controllers/marks.controller.js";

router.patch("/teacher/assign-marks", verifyJWT, assignMarks);

export default router;
