import express from 'express';
import { createComment, getPostComments, likeComment,editComment } from '../controllers/comment.controller.js';

import userAuth from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/create', userAuth,createComment);
router.get("/getpostcomments/:postId", getPostComments);
router.put('/likecomment/:commentId',userAuth,likeComment)
router.put('/editcomment/:commentId',userAuth,editComment)
export default router;