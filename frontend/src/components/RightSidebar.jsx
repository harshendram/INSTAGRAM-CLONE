import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";
import { Button } from "./ui/button";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-[320px] my-10 sticky top-20">
      <div className="flex items-center gap-4 mb-6 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-300 slide-up">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="h-14 w-14 ring-2 ring-offset-2 ring-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:scale-105 transition-all duration-300">
            <AvatarImage src={user?.profilePicture} alt={user?.username} />
            <AvatarFallback className="text-lg font-bold">
              {user?.username?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="font-semibold">
            <Link
              to={`/profile/${user?._id}`}
              className="hover:underline transition-all duration-300"
            >
              {user?.username}
            </Link>
          </h1>
          <span className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1">
            {user?.bio || "Your bio"}
          </span>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between px-3">
        <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">
          Suggested for you
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 py-1 h-7"
        >
          See All
        </Button>
      </div>

      <div
        className="bg-gray-50/70 dark:bg-gray-800/20 p-3 rounded-xl fade-in"
        style={{ animationDuration: "0.5s" }}
      >
        <SuggestedUsers />
      </div>

      <div
        className="mt-8 text-xs text-gray-400 dark:text-gray-600 p-3 rounded-xl fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3">
          <a
            href="#"
            className="hover:underline hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
          >
            About
          </a>
          ·
          <a
            href="#"
            className="hover:underline hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
          >
            Help
          </a>
          ·
          <a
            href="#"
            className="hover:underline hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
          >
            API
          </a>
          ·
          <a
            href="#"
            className="hover:underline hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
          >
            Privacy
          </a>
          ·
          <a
            href="#"
            className="hover:underline hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
          >
            Terms
          </a>
        </div>
        <p className="instagram-text-gradient font-instagram text-sm">
          © 2025 Instagram
        </p>
      </div>
    </div>
  );
};

export default RightSidebar;
