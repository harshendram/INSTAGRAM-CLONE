import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

const SuggestedUsers = () => {
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const [followLoading, setFollowLoading] = useState({});
  const dispatch = useDispatch();

  const handleFollowUnfollow = async (userId) => {
    if (followLoading[userId]) return;

    try {
      setFollowLoading((prev) => ({ ...prev, [userId]: true }));

      const response = await axios.post(
        `http://localhost:5000/api/v1/user/followorunfollow/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update the current user in Redux with the updated following list
        const userResponse = await axios.get(
          `http://localhost:5000/api/v1/user/${user._id}/profile`,
          { withCredentials: true }
        );

        if (userResponse.data.success) {
          dispatch(setAuthUser(userResponse.data.user));
          toast.success(response.data.message);
        }
      }
    } catch (error) {
      console.error("Follow/unfollow error:", error);
      toast.error("Something went wrong");
    } finally {
      setFollowLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Check if current user is following a suggested user
  const isFollowing = (suggestedUserId) => {
    return user?.following?.includes(suggestedUserId);
  };

  return (
    <div className="space-y-4">
      {suggestedUsers.slice(0, 5).map((suggestedUser, index) => {
        const following = isFollowing(suggestedUser._id);

        return (
          <div
            key={suggestedUser._id}
            className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center gap-3">
              <Link to={`/profile/${suggestedUser?._id}`}>
                <Avatar className="h-10 w-10 ring-1 ring-offset-1 ring-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:scale-110 transition-all duration-300">
                  <AvatarImage
                    src={suggestedUser?.profilePicture}
                    alt={suggestedUser?.username}
                  />
                  <AvatarFallback className="text-sm font-semibold">
                    {suggestedUser?.username?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link
                    to={`/profile/${suggestedUser?._id}`}
                    className="hover:underline transition-all duration-300"
                  >
                    {suggestedUser?.username}
                  </Link>
                </h1>
                <span className="text-gray-500 dark:text-gray-400 text-xs line-clamp-1 max-w-[180px]">
                  {suggestedUser?.bio
                    ? suggestedUser.bio.substring(0, 25) +
                      (suggestedUser.bio.length > 25 ? "..." : "")
                    : "New to Instagram"}
                </span>
              </div>
            </div>
            {following ? (
              <Button
                variant="outline"
                size="sm"
                className="font-medium text-xs transition-all duration-300 hover:scale-105 hover:text-red-500 hover:border-red-300"
                onClick={() => handleFollowUnfollow(suggestedUser._id)}
                disabled={followLoading[suggestedUser._id]}
              >
                Unfollow
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="text-blue-500 border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950 font-medium text-xs hover:text-blue-600 transition-all duration-300 hover:scale-105"
                onClick={() => handleFollowUnfollow(suggestedUser._id)}
                disabled={followLoading[suggestedUser._id]}
              >
                Follow
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
