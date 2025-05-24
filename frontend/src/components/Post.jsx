import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:5000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      console.log(res.data);
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // apne post ko update krunga
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.messsage);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-black">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500">
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>
              {post.author?.username?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-sm">{post.author?.username}</h1>
            {user?._id === post.author._id && (
              <Badge variant="secondary" className="h-5 text-xs">
                Author
              </Badge>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer text-gray-600 dark:text-gray-400" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center dark:bg-gray-900 dark:text-white">
            {post?.author?._id !== user?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}

            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favorites
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>{" "}
      <img
        className="w-full aspect-square object-cover"
        src={post.image}
        alt="post_img"
      />
      <div className="flex items-center justify-between p-3">
        {" "}
        <div className="flex items-center gap-4">
          {liked ? (
            <div className="flex items-center gap-1">
              <FaHeart
                onClick={likeOrDislikeHandler}
                size={"24"}
                className="cursor-pointer text-red-500 hover:opacity-80 transition-opacity"
              />
              <span className="text-sm">{postLike}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <FaRegHeart
                onClick={likeOrDislikeHandler}
                size={"24"}
                className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              />
              <span className="text-sm">{postLike}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              size={23}
              className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            />
            <span className="text-sm">{comment.length}</span>
          </div>
          <Send
            size={23}
            className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          />{" "}
        </div>
        <Bookmark
          onClick={bookmarkHandler}
          size={23}
          className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        />
      </div>{" "}
      <div className="px-3 pb-3 space-y-2">
        <p className="text-sm">
          <span className="font-semibold mr-2">{post.author?.username}</span>
          {post.caption}
        </p>
        {comment.length > 0 && (
          <span
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 block"
          >
            View all {comment.length} comments
          </span>
        )}
        <CommentDialog open={open} setOpen={setOpen} />
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={changeEventHandler}
            className="outline-none text-sm w-full bg-transparent"
          />
          {text && (
            <span
              onClick={commentHandler}
              className="text-blue-500 font-semibold cursor-pointer text-sm"
            >
              Post
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
