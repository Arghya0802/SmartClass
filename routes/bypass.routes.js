import express from "express";
const router = express.Router();

import {
  addAdmin,
  addStudentList,
  addTeacherList,
} from "../controllers/bypass.controller.js";

router.post("/inital-admin", addAdmin);
router.post("/inital-student-list", addStudentList);
router.post("/inital-teacher-list", addTeacherList);

export default router;
