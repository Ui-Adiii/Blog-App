import Comment from '../models/comment.model.js'

const createComment = async (req, res) => {
  try {
    const { content, userId, postId } = req.body;
    if (!userId === req.user.id) {
      return res.json({
        message: 'unauthorized user',
        success: false,
      });
    }

    if (!content || content === '' || !userId || userId === '' || !postId || postId === '') {
      return res.json({
        message: 'All fields are required',
        success: false,
      });
    }

    const newComment = await Comment.create({
      content,
      postId,
      userId
    });

    if (!newComment) {
      return res.json({
        message: 'Something wrong',
        success: false,
      });
    }

    return res.status(201).json({
      newComment,
      message: 'Comment Created SuccessFully',
      success: true,
    });

  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
}

const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).sort({createdAt:-1});
    if (!comments) {
      return res.json({
        message: 'No comments are there',
        success: false,
      });
    }

    return res.json({
      message: 'Comments get successfully',
      comments,
      success: true,
    });
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
}

export { createComment, getPostComments };