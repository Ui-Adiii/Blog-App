import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

const signUp = async (req, res) => {
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
      res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }

    let existUser = await User.findOne({ email });
    if (existUser) {
      res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    existUser = await User.findOne({ username });
    if (existUser) {
      res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email
    })


    res.status(201).json({
      success: true,
      message: "User Created SuccessFully",
      newUser
    })

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export { signUp };
