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
  getSingleAdmin
} from "../controllers/admin.controller.js";

router.get("/all-admins", verifyJWT, getAllAdmins);
router.get("/", verifyJWT, getSingleAdmin);

router.post("/add-teacher", verifyJWT, addTeacherToDataBase);
router.post("/add-student", verifyJWT, addStudentToDataBase);
router.post("/add-admin", verifyJWT, addAdminToDataBase);
router.post("/add-department", verifyJWT, addDepartmentToDataBase);

router.patch("/assign-hod", assignHoD);
router.patch("/remove-hod", removeHoD);

export default router;
