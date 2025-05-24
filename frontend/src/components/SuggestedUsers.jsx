import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  return (
    <div>
      {suggestedUsers.slice(0, 5).map((user) => {
        return (
          <div
            key={user._id}
            className="flex items-center justify-between my-3"
          >
            <div className="flex items-center gap-3">
              <Link to={`/profile/${user?._id}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.profilePicture}
                    alt={user?.username}
                  />
                  <AvatarFallback>
                    {user?.username?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-xs">
                  <Link
                    to={`/profile/${user?._id}`}
                    className="hover:underline"
                  >
                    {user?.username}
                  </Link>
                </h1>
                <span className="text-gray-500 dark:text-gray-400 text-xs line-clamp-1 max-w-[180px]">
                  {user?.bio
                    ? user.bio.substring(0, 25) +
                      (user.bio.length > 25 ? "..." : "")
                    : "New to Instagram"}
                </span>
              </div>
            </div>
            <button className="text-blue-500 text-xs font-semibold cursor-pointer hover:text-blue-700 transition-colors">
              Follow
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
