import Post from "../models/post.model.js";

const createPost = async (req, res) => {
  try {
    
    if (!req.user.isAdmin) {
      return res.json({
        success: false,
        message: "You are not allowed for create a post",
      });
    }
    if (!req.body.title || !req.body.content) {
      return res.json({
        success: false,
        message: "Please Provide all the required fields",
      });
    }
    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");
    const newPost = await Post.create({
      ...req.body,
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
