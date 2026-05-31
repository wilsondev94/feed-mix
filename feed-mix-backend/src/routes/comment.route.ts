import express, { Router } from "express";
import { getComments } from "../controllers/comment.controller.js";

const router: Router = express.Router();

router.get("/post/:postId", getComments);

export default router;
