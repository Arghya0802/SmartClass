import express from "express";
const router = express.Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getAllDepartmentSubjects,
  getAllSubjects,
} from "../controllers/subject.controller.js";

router.get("/teacher/all", verifyJWT, getAllSubjects); 
router.get("/department/all", verifyJWT, getAllDepartmentSubjects);

export default router;
