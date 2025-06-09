import express from 'express';
import { deleteUser, updateUser } from "../controllers/user.controller.js";
import userAuth from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.put("/update/:userId", userAuth, upload.single('profilePicture'),updateUser);
router.put("/delete/:userId", userAuth, deleteUser);

export default router;