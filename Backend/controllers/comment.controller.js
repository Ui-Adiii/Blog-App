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

const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.json({
        message:'comment is not available',
        success: false,
      });
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    let message;
    if (userIndex === -1) {
      comment.numberOfLikes +=1
      comment.likes.push(req.user.id);
      message= 'Comment liked successfully';

    }
    else {
          message= 'Comment Unliked successfully',

      comment.numberOfLikes -= 1
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

export { createComment, getPostComments, likeComment };