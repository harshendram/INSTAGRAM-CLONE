import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col bg-white dark:bg-black border dark:border-gray-800 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row flex-1">
          <div className="w-full md:w-1/2 bg-black">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-full h-full object-contain max-h-[500px] md:max-h-none"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
              <div className="flex gap-3 items-center">
                <Link to={`/profile/${selectedPost?.author?._id}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>
                      {selectedPost?.author?.username?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link
                    to={`/profile/${selectedPost?.author?._id}`}
                    className="font-semibold text-sm hover:underline"
                  >
                    {selectedPost?.author?.username}
                  </Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer text-gray-600 dark:text-gray-400" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center dark:bg-gray-900 dark:text-white">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>{" "}
            <div className="flex-1 overflow-y-auto max-h-96 p-4 comment-scrollbar">
              {comment.length > 0 ? (
                comment.map((comment) => (
                  <Comment
                    key={comment._id}
                    comment={comment}
                    postId={selectedPost?._id}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No comments yet</p>
                  <p className="text-xs mt-1">Start the conversation</p>
                </div>
              )}
            </div>
            <div className="p-3 border-t dark:border-gray-800">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment..."
                  className="w-full outline-none border-none text-sm bg-transparent"
                />
                {text.trim() && (
                  <button
                    onClick={sendMessageHandler}
                    className="text-blue-500 font-semibold text-sm"
                  >
                    Post
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
