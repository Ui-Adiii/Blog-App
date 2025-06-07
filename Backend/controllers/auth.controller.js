import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
const signUp = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    if (
      !username ||
      username === "" ||
      !email ||
      email === "" ||
      !password ||
      password === ""
    ) {
      next(errorHandler(400, "All Fields are required"));
    }

    let existUser = await User.findOne({ email });
    if (existUser) {
      res.json({
        success: false,
        message: "user already exist",
      });
    }

    existUser = await User.findOne({ username });
    if (existUser) {
      res.json({
        success: false,
        message: "user already exist",
      });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).json({
      success: true,
      message: "User Created SuccessFully",
      newUser,
    });
  } catch (error) {
    next(error);
  }
};

export { signUp };
