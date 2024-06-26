import express from "express";
const router = express.Router();

import {
  addSubjectToDepartment,
  assignSubjectToTeacher,
  getSingleHoD,
  giveAttendanceToStudent,
} from "../controllers/hod.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.get("/", verifyJWT, getSingleHoD);

router.post("/attendance", verifyJWT, giveAttendanceToStudent);

router.patch("/assign-subject-teacher", verifyJWT, assignSubjectToTeacher);
router.patch("/add-subject-department", verifyJWT, addSubjectToDepartment);

export default router;
