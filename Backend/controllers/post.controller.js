import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({
        success: false,
        message: "You are not allowed for create a post",
      });
    }
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.json({
        success: false,
        message: "Please Provide all the required fields",
      });
    }
    const image = req.file;
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }
    const result = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });
    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const newPost = await Post.create({
      ...req.body,
      image: result.secure_url,
      slug,
      userId: req.user.id,
    });
    if (!newPost) {
      return res.json({
        success: false,
        message: "post not created",
      });
    }
    return res.status(201).json({
      success: true,
      newPost,
      message: "Post created successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


export { createPost };
