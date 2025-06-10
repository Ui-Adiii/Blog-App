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
    const { password: pass, ...rest } = newUser._doc;

    res.status(201).json({
      success: true,
      message: "User Created SuccessFully",
      rest,
    });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!password || password === "") {
      return res.json({
        success: false,
        message: "Password is required",
      });
    }
    const user = await User.findOne({
      $or: [
        email ?{
          email: { $regex: email, $options: "i" },
        }:null,
       username? {
          username: { $regex: username, $options: "i" },
        }:null,
      ].filter(Boolean),
    });
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
    const token = jwt.sign({id:user._id,isAdmin:validateUser.isAdmin}, process.env.JWT_SECRET);
    
    
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

const google = async (req, res) => {
  try {
    const { name, email, googlePhotoUrl } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id ,isAdmin:user.isAdmin}, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json({
          rest,
          success: true,
          message: "Login SuccessFully",
        });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = await User.create({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      const token = jwt.sign({ id: newUser._id ,isAdmin:newUser.isAdmin}, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;
      return res
        .status(201)
        .cookie("access_token", token, { httpOnly: true })
        .json({
          success: true,
          rest,
          message: "User Created Successfully",
        });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export { signUp, signIn, google };
