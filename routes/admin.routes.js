import express from "express";
const router = express.Router();

import {
  addAdminToDataBase,
  addStudentToDataBase,
  addTeacherToDataBase,
  assignHoD,
} from "../controllers/admin.controller.js";

router.post("/add-teacher", addTeacherToDataBase);
router.post("/add-student", addStudentToDataBase);
router.post("/add-admin", addAdminToDataBase);
router.patch("/assign-hod", assignHoD);

export default router;
