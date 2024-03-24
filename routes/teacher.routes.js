import express from "express";
const router = express.Router();

import { upload } from "../middlewares/multer.middleware.js";
import { addResources } from "../controllers/teacher.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.post(
  "/add-resources",
  verifyJWT,
  upload.fields([
    {
      name: "resources",
      maxCount: 5,
    },
  ]),
  addResources
);

export default router;
