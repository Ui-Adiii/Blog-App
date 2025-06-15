import Comment from "../models/comment.model.js";

const createComment = async (req, res) => {
  try {
    const { content, userId, postId } = req.body;
    if (!userId === req.user.id) {
      return res.json({
        message: "unauthorized user",
        success: false,
      });
    }

    if (
      !content ||
      content === "" ||
      !userId ||
      userId === "" ||
      !postId ||
      postId === ""
    ) {
      return res.json({
        message: "All fields are required",
        success: false,
      });
    }

    const newComment = await Comment.create({
      content,
      postId,
      userId,
    });

    if (!newComment) {
      return res.json({
        message: "Something wrong",
        success: false,
      });
    }

    return res.status(201).json({
      newComment,
      message: "Comment Created SuccessFully",
      success: true,
    });
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    if (!comments) {
      return res.json({
        message: "No comments are there",
        success: false,
      });
    }

    return res.json({
      message: "Comments get successfully",
      comments,
      success: true,
    });
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.json({
        message: "comment is not available",
        success: false,
      });
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    let message;
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
      message = "Comment liked successfully";
    } else {
      (message = "Comment Unliked successfully"), (comment.numberOfLikes -= 1);
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();

    return res.json({
      message,
      success: true,
      comment,
    });
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const user = req.user;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.json({
        message: "comment is not available",
        success: false,
      });
    }

    if (comment.userId !== user.id && !user.isAdmin) {
      return res.json({
        message: "you are not allowed to update ",
        success: false,
      });
    }

    comment.content = req.body.content;
    await comment.save();
    return res.json({
      message: "comment edited successfully",
      success: true,
      comment,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const user = req.user;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.json({
        message: "No comment Found",
        success: false,
      });
    }

    if (user.id !== comment.userId && !user.isAdmin) {
      return res.json({
        message: "You are not  allowed to delete this Comment",
        success: false,
      });
    }

    await Comment.findByIdAndDelete(commentId);

    return res.json({
      message: "comment deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

const getcomments = async (req, res, next) => {
  if (!req.user.isAdmin)
   return req.json({success:false,message: 'You are not allowed to get all comments'});
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthComments ,success:true,message:"comments fetched"});
  } catch (error) {
    return res.json({
      success:false,
      message:error.message
    })
  }
};

export { editComment, createComment, getcomments, getPostComments, likeComment ,deleteComment};
