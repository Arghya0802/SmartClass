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
  getAdmin,
  RemoveAdmin
} from "../controllers/admin.controller.js";

router.post("/add-teacher", addTeacherToDataBase);
router.post("/add-student", addStudentToDataBase);
router.post("/add-admin", addAdminToDataBase);
router.post("/add-department", addDepartmentToDataBase);

router.patch("/assign-hod", assignHoD);
router.patch("/remove-hod", removeHoD);

//Testing purpose

router.get("/get-admin", getAdmin)
router.delete("/remove-admin",RemoveAdmin)

//Testing purpose

export default router;
