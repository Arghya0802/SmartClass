import express from "express";
const router = express.Router();

<<<<<<< HEAD
import { login, logout, register } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.patch("/register", register);
router.post("/login", login);
router.get("/logout", verifyJWT, logout);
=======
import { login, register } from "../controllers/auth.controller.js";

router.patch("/register", register);
router.post("/login",login)
>>>>>>> origin/Raj

export default router;
