import express, { Router } from "express";
import {
  createPost,
  getPost,
  getPosts,
  getUserPosts,
} from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router: Router = express.Router();

router.get("/", getPosts);
router.get("/:postId", getPost);
router.get("/user/:username", getUserPosts);

router.post("/create-post", protectRoute, upload.single("image"), createPost);

export default router;
