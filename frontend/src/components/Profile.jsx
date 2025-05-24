import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser, setUserProfile } from "@/redux/authSlice";
import UserListDialog from "./UserListDialog";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const dispatch = useDispatch();
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");
  const [followLoading, setFollowLoading] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const { userProfile, user } = useSelector((store) => store.auth);

  // Add useEffect to refresh user profile when the userId changes
  useEffect(() => {
    // Reset the state when the profile ID changes
    setFollowers([]);
    setFollowing([]);
  }, [userId]);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = user?.following?.includes(userProfile?._id);

  // Fetch followers data when needed
  const fetchFollowers = async () => {
    if (!userProfile?._id || userProfile.followers.length === 0) return;

    setIsLoadingUsers(true);
    try {
      const promises = userProfile.followers.map(async (followerId) => {
        const res = await axios.get(
          `http://localhost:5000/api/v1/user/${followerId}/profile`,
          {
            withCredentials: true,
          }
        );
        return res.data.success ? res.data.user : null;
      });

      const results = await Promise.all(promises);
      setFollowers(results.filter(Boolean));
    } catch (error) {
      console.error("Error fetching followers:", error);
      toast.error("Failed to load followers");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Fetch following data when needed
  const fetchFollowing = async () => {
    if (!userProfile?._id || userProfile.following.length === 0) return;

    setIsLoadingUsers(true);
    try {
      const promises = userProfile.following.map(async (followingId) => {
        const res = await axios.get(
          `http://localhost:5000/api/v1/user/${followingId}/profile`,
          {
            withCredentials: true,
          }
        );
        return res.data.success ? res.data.user : null;
      });

      const results = await Promise.all(promises);
      setFollowing(results.filter(Boolean));
    } catch (error) {
      console.error("Error fetching following users:", error);
      toast.error("Failed to load following users");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Update followers/following lists after follow/unfollow action
  const handleFollowToggleUpdate = async (userId, isNowFollowing) => {
    // Refresh userProfile data after follow/unfollow action
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/user/${userProfile._id}/profile`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUserProfile(res.data.user));

        // Refresh specific list that changed
        if (isNowFollowing) {
          fetchFollowers();
        } else {
          fetchFollowers();
        }
      }
    } catch (error) {
      console.error("Failed to update profile data:", error);
    }
  };

  const handleFollowUnfollow = async (profileId) => {
    if (followLoading) return;

    try {
      setFollowLoading(true);

      const response = await axios.post(
        `http://localhost:5000/api/v1/user/followorunfollow/${profileId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update the local state to reflect changes immediately
        // This gives better UX than a full page reload

        // First, fetch the updated user data
        const userResponse = await axios.get(
          `http://localhost:5000/api/v1/user/${user._id}/profile`,
          { withCredentials: true }
        );

        if (userResponse.data.success) {
          // Update the current user in Redux with the updated following list
          dispatch(setAuthUser(userResponse.data.user));
        }

        // Also refresh the profile we're viewing
        const profileResponse = await axios.get(
          `http://localhost:5000/api/v1/user/${profileId}/profile`,
          { withCredentials: true }
        );

        if (profileResponse.data.success) {
          dispatch(setUserProfile(profileResponse.data.user));
        }

        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Follow/unfollow error:", error);
      toast.error("Something went wrong");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      variant="secondary"
                      className="h-8"
                      onClick={() => handleFollowUnfollow(userProfile?._id)}
                    >
                      Unfollow
                    </Button>
                    <Link to="/chat">
                      <Button variant="secondary" className="h-8">
                        Message
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    className="bg-[#0095F6] hover:bg-[#3192d2] h-8"
                    onClick={() => handleFollowUnfollow(userProfile?._id)}
                  >
                    Follow
                  </Button>
                )}
              </div>{" "}
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>
                  posts
                </p>
                <UserListDialog
                  users={followers}
                  title="Followers"
                  onFollowToggle={handleFollowToggleUpdate}
                  emptyMessage="No followers yet"
                  onOpen={fetchFollowers}
                  trigger={
                    <p className="cursor-pointer hover:underline">
                      <span className="font-semibold">
                        {userProfile?.followers.length}{" "}
                      </span>
                      followers
                    </p>
                  }
                />

                <UserListDialog
                  users={following}
                  title="Following"
                  onFollowToggle={handleFollowToggleUpdate}
                  emptyMessage="Not following anyone"
                  onOpen={fetchFollowing}
                  trigger={
                    <p className="cursor-pointer hover:underline">
                      <span className="font-semibold">
                        {userProfile?.following.length}{" "}
                      </span>
                      following
                    </p>
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />{" "}
                  <span className="pl-1">{userProfile?.username}</span>{" "}
                </Badge>
                <span>🤯Learn code with patel mernstack style</span>
                <span>🤯Turing code into fun</span>
                <span>🤯DM for collaboration</span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span className="py-3 cursor-pointer">REELS</span>
            <span className="py-3 cursor-pointer">TAGS</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post.image}
                    alt="postimage"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
