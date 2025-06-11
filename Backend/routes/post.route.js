import express from 'express';
import userAuth from '../middlewares/auth.middleware.js';
import { createPost, deletePost, getPosts, updatePost, } from "../controllers/post.controller.js";
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post("/create", userAuth, upload.single('image'), createPost);
router.get('/getposts',getPosts);
router.get('/getpost/:postId',userAuth, getPosts);
router.delete('/deletepost/:postId/:userId',userAuth,deletePost);
router.put("/updatepost/:postId/:userId", userAuth, updatePost);

export default router;