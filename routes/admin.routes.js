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
  removeAdmin,
} from "../controllers/admin.controller.js";

router.get("/all-admins", verifyJWT, getAllAdmins);

router.post("/add-teacher", addTeacherToDataBase);
router.post("/add-student", addStudentToDataBase);
router.post("/add-admin", addAdminToDataBase);
router.post("/add-department", addDepartmentToDataBase);

router.patch("/assign-hod", assignHoD);
router.patch("/remove-hod", removeHoD);

router.delete("/remove-admin/:adminId", verifyJWT, removeAdmin);

export default router;
