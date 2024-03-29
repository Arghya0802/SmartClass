import express from "express";
const router = express.Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { getAllResources, removeResource, addResource } from "../controllers/resource.controller.js";

router.get("/:subjectId", verifyJWT, getAllResources);
router.delete("/remove-resource", verifyJWT, removeResource);
router.post("/add-resource", verifyJWT, addResource);

export default router