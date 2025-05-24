import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-[320px] my-10 sticky top-20">
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profilePicture} alt={user?.username} />
            <AvatarFallback>
              {user?.username?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${user?._id}`} className="hover:underline">
              {user?.username}
            </Link>
          </h1>
          <span className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1">
            {user?.bio || "Your bio"}
          </span>
        </div>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">
          Suggested for you
        </h3>
        <button className="text-xs font-semibold">See All</button>
      </div>
      <SuggestedUsers />

      <div className="mt-8 text-xs text-gray-400 dark:text-gray-600">
        <div className="flex flex-wrap gap-x-2 mb-3">
          <a href="#" className="hover:underline">
            About
          </a>
          ·
          <a href="#" className="hover:underline">
            Help
          </a>
          ·
          <a href="#" className="hover:underline">
            API
          </a>
          ·
          <a href="#" className="hover:underline">
            Privacy
          </a>
          ·
          <a href="#" className="hover:underline">
            Terms
          </a>
        </div>
        <p>© 2025 Instagram Clone</p>
      </div>
    </div>
  );
};

export default RightSidebar;
