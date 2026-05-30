import express, { Router } from "express";
import { createUser, getUserProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router: Router = express.Router();

router.get("/profile/:username", getUserProfile);
router.put("/create-user", protectRoute, createUser);

export default router;
