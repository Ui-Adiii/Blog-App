import express from 'express';
import {
  deleteUser,
  signOut,
  updateUser,
  getUsers,
} from "../controllers/user.controller.js";
import userAuth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.put(
  "/update/:userId",
  userAuth,
  upload.single("profilePicture"),
  updateUser
);
router.delete("/delete/:userId", userAuth, deleteUser);
router.get("/logout", signOut);
router.get('/getusers', userAuth, getUsers);

export default router;