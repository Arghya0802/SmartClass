import express from "express";
const router = express.Router();

import { assignSubjectToTeacher } from "../controllers/hod.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.patch("/assign-subject-teacher", verifyJWT, assignSubjectToTeacher);

export default router;
