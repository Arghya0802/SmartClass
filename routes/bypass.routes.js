import express from "express";
const router = express.Router();

import {
  addAdmin,
  addDepartmentList,
  addStudentList,
  addSubjectList,
  addTeacherList,
} from "../controllers/bypass.controller.js";

router.post("/inital-admin", addAdmin);
router.post("/inital-student-list", addStudentList);
router.post("/inital-teacher-list", addTeacherList);
router.post("/inital-department-list", addDepartmentList);
router.post("/inital-subject-list", addSubjectList);

export default router;
