import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || email === "" || !password || password === "") {
      return res.json({
        success: false,
        message: "All Fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "user doesn't exist",
      });
    }

    const validateUser = bcryptjs.compareSync(password, user.password);
    if (!validateUser) {
      return res.json({
        success: false,
        message: "Invalid Password",
      });
    }
    //const updatedUser = await User.findOne({ email }).select("-password"); //another method
    const { password: pass, ...rest } = user._doc;
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
    return res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({
        success: true,
        rest,
        message: "Login SuccessFully",
      });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
export { signUp, signIn };
