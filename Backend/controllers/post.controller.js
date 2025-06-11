import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
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

const getPosts = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    ); // new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
      success: true,
      message: "getting all the posts",
    });
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

const deletePost = async (req, res) => {
  try {

    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return res.json({
        message: "you are not allowed to delete the post",
        success: false,
      });
    }

    await Post.findByIdAndDelete(req.params.postId);

    return res.json({
      message: "post deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return res.json({
        message: "you are not allowed to update the post",
        success: false,
      });
    }

    const { title, content, category } = req.body;
    const slug = title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title,
          slug,
          content,
          category,
        },
      },
      { new: true }
    );

    return res.json({
      success: true,
      post,
      message: "updated successfully",
    });
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

export { createPost, getPosts, deletePost, updatePost };
