import express, { Router } from "express";
import {
  createUser,
  getUserProfile,
  updateProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router: Router = express.Router();

router.get("/profile/:username", getUserProfile);
router.post("/create-user", protectRoute, createUser);
router.put("/profile", protectRoute, updateProfile);

export default router;
