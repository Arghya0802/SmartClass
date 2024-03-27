import express from "express";
const router = express.Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { getAllResources, removeResource } from "../controllers/resource.controller.js";

router.get("/:teacherId", verifyJWT, getAllResources);
router.delete("/remove-resource", verifyJWT, removeResource);

export default router