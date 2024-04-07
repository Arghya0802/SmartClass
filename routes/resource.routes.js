import express from "express";
const router = express.Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  getAllResources,
  removeResource,
  createResource,
} from "../controllers/resource.controller.js";

router.post("/add", verifyJWT, createResource);

router.post("/all", verifyJWT, getAllResources);

router.delete("/remove", verifyJWT, removeResource);

export default router;
