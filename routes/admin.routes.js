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
  getAllDepartments,
  getStudentsOfDepartment,
  getTeachersOfDepartment,
} from "../controllers/admin.controller.js";

router.get("/teachers/:departmentId", verifyJWT, getTeachersOfDepartment);
router.get("/students/:departmentId", verifyJWT, getStudentsOfDepartment);

router.get("/admins", verifyJWT, getAllAdmins);
router.get("/", verifyJWT, getSingleAdmin);
router.get("/teachers", verifyJWT, getAllTeachers);

router.get("/students", verifyJWT, getAllStudents);
router.get("/departments", verifyJWT, getAllDepartments);

router.post("/add-teacher", verifyJWT, addTeacherToDataBase);
router.post("/add-student", verifyJWT, addStudentToDataBase);
router.post("/add-admin", verifyJWT, addAdminToDataBase);
router.post("/add-department", verifyJWT, addDepartmentToDataBase);

router.patch("/assign-hod", verifyJWT, assignHoD);
router.patch("/remove-hod", verifyJWT, removeHoD);

router.delete("/remove-admin", verifyJWT, removeAdmin);

export default router;
