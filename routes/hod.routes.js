import express from "express";
const router = express.Router();

import {
  addSubjectToDepartment,
  assignSubjectToTeacher,
  getSingleHoD,
  removeSubjectFromDepartment,
} from "../controllers/hod.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.get("/", verifyJWT, getSingleHoD);

router.patch("/assign-subject-teacher", verifyJWT, assignSubjectToTeacher);
router.patch("/add-subject-department", verifyJWT, addSubjectToDepartment);
router.delete(
  "/remove-subject-department",
  verifyJWT,
  removeSubjectFromDepartment
);

export default router;
