import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "./ui/input";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import { getRelativeTimeString } from "@/utils/dateFormatter";

const Comment = ({ comment, postId }) => {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      // Format reply to include the username of who they're replying to
      const formattedReply = `@${comment?.author.username} ${replyText}`;

      const res = await axios.post(
        `http://localhost:5000/api/v1/post/${postId}/comment`,
        { text: formattedReply },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        // Update posts state
        const updatedPostData = posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                comments: [res.data.comment, ...p.comments],
              }
            : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success("Reply added");
        setReplying(false);
        setReplyText("");
      }
    } catch (error) {
      console.error("Reply error:", error);
      toast.error("Failed to add reply");
    }
  };

  return (
    <div className="my-3">
      <div className="flex gap-3 items-start">
        <Link to={`/profile/${comment?.author?._id}`}>
          <Avatar className="h-7 w-7">
            <AvatarImage src={comment?.author?.profilePicture} />
            <AvatarFallback>
              {comment?.author?.username?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col w-full">
          <div>
            <Link
              to={`/profile/${comment?.author?._id}`}
              className="font-semibold text-sm hover:underline"
            >
              {comment?.author.username}
            </Link>
            <span className="text-sm pl-2">{comment?.text}</span>
          </div>
          <div className="flex gap-3 mt-1">
            {" "}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {getRelativeTimeString(comment?.createdAt)}
            </span>
            <button
              onClick={() => setReplying(!replying)}
              className="text-xs text-gray-500 dark:text-gray-400 font-semibold hover:text-gray-800 dark:hover:text-gray-200"
            >
              Reply
            </button>
          </div>

          {replying && (
            <div className="mt-2 flex items-center gap-2">
              <Input
                type="text"
                placeholder="Add your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="text-sm bg-gray-100 dark:bg-gray-800 border-none"
              />
              <button
                onClick={handleReply}
                className="text-sm text-blue-500 font-semibold"
                disabled={!replyText.trim()}
              >
                Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
