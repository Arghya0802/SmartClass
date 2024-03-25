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
  getAllAdmin,
  RemoveAdmin,
  getAdmin
} from "../controllers/admin.controller.js";

router.post("/add-teacher", addTeacherToDataBase);
router.post("/add-student", addStudentToDataBase);
router.post("/add-admin", addAdminToDataBase);
router.post("/add-department", addDepartmentToDataBase);

router.patch("/assign-hod", assignHoD);
router.patch("/remove-hod", removeHoD);

//Testing purpose

router.get("/get-admin", getAllAdmin)
router.delete("/remove-admin",RemoveAdmin)

router.get("/my-home", verifyJWT, getAdmin)

//Testing purpose

export default router;
