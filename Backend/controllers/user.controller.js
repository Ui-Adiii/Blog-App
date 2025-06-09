import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { v2 as cloudinay } from "cloudinary";

const updateUser = async (req, res) => {
  try {
    const image = req.file;
    let result;
    if (image) {
      result = await cloudinay.uploader.upload(image.path, {
        resource_type: "image",
      });
    }
    if (req.user.id !== req.params.userId) {
      return res.json({
        success: false,
        message: "not allowed to update the user",
      });
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.json({
          success: false,
          message: "password must have 6 characters",
        });
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.username) {
      if (req.body.username.length < 6 || req.body.username.length > 20) {
        return res.json({
          success: false,
          message: "username must be between 7 and 20 characters",
        });
      }
      if (req.body.username.includes(" ")) {
        return res.json({
          success: false,
          message: "username cannot contain space",
        });
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return res.json({
          success: false,
          message: "username most be lowercase",
        });
      }
      if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return res.json({
          success: false,
          message: "username can only contain letters and numbers",
        });
      }
    }

    const updateFields = {};
    if (req.body.username) updateFields.username = req.body.username;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.password) updateFields.password = req.body.password;
    if (result) updateFields.profilePicture = result.secure_url;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateFields },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    return res.json({
      success: true,
      rest,
      message: "updated successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export { updateUser };
