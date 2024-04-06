import express from "express";
const router = express.Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getAllSubjects } from "../controllers/subject.controller.js";

router.get("/teacher/all", verifyJWT, getAllSubjects);

export default router;
