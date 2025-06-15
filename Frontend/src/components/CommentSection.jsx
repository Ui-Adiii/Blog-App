import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Button, Textarea } from "flowbite-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Comment from "./Comment";


const CommentSection = ({ postId }) => {
  const navigate =useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setcomment] = useState("");
  const [comments, setcomments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return;
    try {
      const response = await axios.post("/api/comment/create", {
        content: comment,
        postId,
        userId: currentUser._id,
      });
      
      if (response.data.success) {
        setcomment("");
        setcomments([response.data.newComment,...comments])
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(
          `/api/comment/getpostcomments/${postId}`
        );
        if (response.data.success) {
          setcomments(response.data.comments);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    getComments();
  }, [postId]);

   const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const response = await axios.put(`/api/comment/likecomment/${commentId}`);
      if (response.data.success) {
        setcomments(
          comments.map((comment) =>
            comment._id === commentId
              ? { ...comment, likes: response.data.comment.likes, numberOfLikes: response.data.comment.likes.length }
              : comment
          )
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full ">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm ">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full "
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            className="text-xs text-cyan-500 hover:underline"
            to={"/dashboard?tab=profile"}
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex gap-1 text-sm text-teal-500 my-5 ">
          <p>You must be signed in to comment.</p>
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            onChange={(e) => setcomment(e.target.value)}
            value={comment}
            placeholder="Add a comment"
            rows={3}
            maxLength={200}
          />
          <div className="flex justify-between items-center mt-5 ">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button type="submit" outline color={"yellow"}>
              Submit
            </Button>
          </div>
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
            </div>
            {
              comments.map((comment) => (<Comment
              key={comment._id}
               comment={comment}
               onLike={handleLike}
              />))
            }
        </>
      )}
    </div>
  );
};

export default CommentSection;
