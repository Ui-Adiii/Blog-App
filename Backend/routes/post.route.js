import express from 'express';
import userAuth from '../middlewares/auth.middleware.js';
import { createPost, getPosts, } from "../controllers/post.controller.js";
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post("/create", userAuth, upload.single('image'), createPost);
router.get('/getposts', getPosts);

export default router;