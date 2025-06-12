import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { Button, Textarea } from "flowbite-react";
import axios from "axios";
import { toast } from "react-toastify";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setcomment] = useState("");

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
      } else {
        toast.error(response.data.message);
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
    </div>
  );
};

export default CommentSection;
