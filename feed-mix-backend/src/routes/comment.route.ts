import express, { Router } from "express";
import {
  createComment,
  getComments,
} from "../controllers/comment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router: Router = express.Router();

router.get("/post/:postId", getComments);

router.post("/post/:postId", protectRoute, createComment);

export default router;
