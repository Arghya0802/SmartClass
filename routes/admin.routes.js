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
  getSingleAdmin,
} from "../controllers/admin.controller.js";

router.get("/all-admins", verifyJWT, getAllAdmins);
router.get("/", verifyJWT, getSingleAdmin);

router.post("/add-teacher", verifyJWT, addTeacherToDataBase);
router.post("/add-student", verifyJWT, addStudentToDataBase);
router.post("/add-admin", verifyJWT, addAdminToDataBase);
router.post("/add-department", verifyJWT, addDepartmentToDataBase);

router.patch("/assign-hod", verifyJWT, assignHoD);
router.patch("/remove-hod", verifyJWT, removeHoD);

router.delete("/remove-admin/", verifyJWT, removeAdmin);

//Testing purpose

router.get("/get-admin", getAllAdmin)
router.delete("/remove-admin",RemoveAdmin)

router.get("/my-home", verifyJWT, getAdmin)

//Testing purpose

export default router;
