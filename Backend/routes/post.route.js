import express from 'express';
import userAuth from '../middlewares/auth.middleware.js';
import { createPost } from '../controllers/post.controller.js';

const router = express.Router();

router.post("/create",userAuth,createPost);

export default router;