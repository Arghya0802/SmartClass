import express from "express";
const router = express.Router();

import {
  addAdminToDataBase,
  addTeacherToDataBase,
  addDepartmentToDataBase,
  addStudentToDataBase,
  addSubjectToDepartment,
  assignHoD,
} from "../controllers/admin.controller.js";

router.post("/add-teacher", addTeacherToDataBase);
router.post("/add-student", addStudentToDataBase);
router.post("/add-admin", addAdminToDataBase);
router.post("/add-department", addDepartmentToDataBase);
router.post("/add-subject", addSubjectToDepartment);

router.patch("/assign-hod", assignHoD);

export default router;
