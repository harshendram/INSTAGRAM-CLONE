import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Stories = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { user } = useSelector((store) => store.auth);

  // Fetch following users
  useEffect(() => {
    const fetchFollowing = async () => {
      if (!user?._id) return;

      setLoading(true);
      try {
        // Get users the current user is following
        const res = await axios.get(
          `http://localhost:5000/api/v1/user/${user._id}/profile`,
          { withCredentials: true }
        );

        if (res.data.success && res.data.user.following?.length > 0) {
          const followingIds = res.data.user.following;

          // Fetch details for each followed user
          const promises = followingIds.map(async (followingId) => {
            const id =
              typeof followingId === "object" ? followingId._id : followingId;

            const userRes = await axios.get(
              `http://localhost:5000/api/v1/user/${id}/profile`,
              { withCredentials: true }
            );

            return userRes.data.success ? userRes.data.user : null;
          });

          const results = await Promise.all(promises);
          setFollowing(results.filter(Boolean));
        }
      } catch (error) {
        // Silently handle error
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [user?._id]);

  // Scroll controls
  const scrollLeft = () => {
    if (scrollPosition > 0) {
      setScrollPosition(scrollPosition - 200);
    }
  };

  const scrollRight = () => {
    const container = document.getElementById("stories-container");
    if (
      container &&
      scrollPosition < container.scrollWidth - container.clientWidth
    ) {
      setScrollPosition(scrollPosition + 200);
    }
  };

  // Update scroll position when it changes
  useEffect(() => {
    const container = document.getElementById("stories-container");
    if (container) {
      container.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }
  }, [scrollPosition]);

  if (loading) {
    // Show loading placeholders
    return (
      <div className="w-full max-w-[470px] mx-auto lg:mx-0 mb-6 overflow-hidden">
        <div className="flex gap-4 p-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                <div className="w-10 h-3 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md"></div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // Don't render if no following users
  if (following.length === 0) return null;

  return (
    <div className="w-full max-w-[470px] mx-auto lg:mx-0 mb-6 relative">
      {scrollPosition > 0 && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 rounded-full shadow-md p-1"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div
        id="stories-container"
        className="flex gap-4 p-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Current user story */}
        <div className="flex flex-col items-center min-w-[72px]">
          <div className="story-ring p-[2px] mb-1">
            <Avatar className="w-16 h-16 border-2 border-white dark:border-black">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>
                {user?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <span className="text-xs truncate max-w-[72px] text-center">
            Your story
          </span>
        </div>

        {/* Following users stories */}
        {following.map((followedUser) => (
          <Link
            to={`/profile/${followedUser?._id}`}
            key={followedUser?._id}
            className="flex flex-col items-center min-w-[72px]"
          >
            <div className="story-ring p-[2px] mb-1">
              <Avatar className="w-16 h-16 border-2 border-white dark:border-black">
                <AvatarImage src={followedUser?.profilePicture} />
                <AvatarFallback>
                  {followedUser?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="text-xs truncate max-w-[72px] text-center">
              {followedUser?.username}
            </span>
          </Link>
        ))}
      </div>

      {/* Right scroll button - show only if more content to scroll */}
      {following.length > 4 && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 rounded-full shadow-md p-1"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Stories;
