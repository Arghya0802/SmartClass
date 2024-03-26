import express from "express";
const router = express.Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  addAdminToDataBase,
  addTeacherToDataBase,
  addDepartmentToDataBase,
  addStudentToDataBase,
  assignHoD,
  removeHoD,
  getAllAdmins,
  getSingleAdmin,
  removeAdmin,
  getAllTeachers,
  getAllStudents,
  removeStudent
} from "../controllers/admin.controller.js";

router.get("/admins", verifyJWT, getAllAdmins);
router.get("/", verifyJWT, getSingleAdmin);
router.get("/teachers", verifyJWT, getAllTeachers);
router.get("/students", verifyJWT, getAllStudents);

router.post("/add-teacher", verifyJWT, addTeacherToDataBase);
router.post("/add-student", verifyJWT, addStudentToDataBase);
router.post("/add-admin", verifyJWT, addAdminToDataBase);
router.post("/add-department", verifyJWT, addDepartmentToDataBase);

router.patch("/assign-hod", verifyJWT, assignHoD);
router.patch("/remove-hod", verifyJWT, removeHoD);

router.delete("/remove-admin", verifyJWT, removeAdmin);
//router.delete("/remove-teacher", verifyJWT, removeTeacher);
router.delete("/remove-student", verifyJWT, removeStudent);

export default router;
