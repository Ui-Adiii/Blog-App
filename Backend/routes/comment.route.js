import express from 'express';
import { createComment, getPostComments } from '../controllers/comment.controller.js';

import userAuth from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/create', userAuth,createComment);
router.get("/getpostcomments/:postId", getPostComments);

export default router;