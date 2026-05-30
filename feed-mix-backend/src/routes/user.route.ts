import express, { Router } from "express";
import {
  createUser,
  getCurrentUser,
  getUserProfile,
  updateProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router: Router = express.Router();

router.get("/profile/:username", getUserProfile);

router.post("/create-user", protectRoute, createUser);
router.get("/me", protectRoute, getCurrentUser);
router.put("/profile", protectRoute, updateProfile);

export default router;
