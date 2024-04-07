import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addNoticeToDepartment,
  getAllDepartmentNotices,
  getAllNotices,
  removeNoticeFromDepartment,
} from "../controllers/notice.controller.js";
const router = express.Router();

router.get("/admin/all", verifyJWT, getAllNotices);
router.get("/department/all", verifyJWT, getAllDepartmentNotices);

router.post(
  "/hod/add",
  verifyJWT,
  upload.fields([
    {
      name: "links",
      maxCount: 2,
    },
  ]),
  addNoticeToDepartment
);

router.delete("/hod/remove", verifyJWT, removeNoticeFromDepartment);

export default router;
