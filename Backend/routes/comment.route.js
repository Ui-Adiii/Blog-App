import express from 'express';
import { createComment } from '../controllers/comment.controller.js';

import userAuth from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/create', userAuth,createComment);

export default router;