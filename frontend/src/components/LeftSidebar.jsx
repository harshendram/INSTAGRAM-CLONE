import {
  Bookmark,
  Compass,
  Heart,
  Home,
  Instagram,
  LogOut,
  Menu,
  MessageCircle,
  PlusSquare,
  Search,
  Settings,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { clearNotifications } from "@/redux/rtnSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/theme-toggle";
import { cn } from "@/lib/utils";
import { getRelativeTimeString } from "@/utils/dateFormatter";

const LeftSidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const {
    likeNotification = [],
    commentNotification = [],
    followNotification = [],
    savePostNotification = [],
  } = useSelector((state) => state.realTimeNotification || {});

  const logout = async () => {
    try {
      await axios.get("/api/v1/auth/logout");
      localStorage.removeItem("user");
      dispatch(setAuthUser(null));
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  const sidebarHandler = (text) => {
    if (text === "Home") {
      navigate("/");
    } else if (text === "Search") {
      navigate("/search");
    } else if (text === "Messages") {
      navigate("/chat");
    } else if (text === "Notifications") {
      dispatch(clearNotifications());
    } else if (text === "Create") {
      setOpen(true);
    } else if (text === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (text === "Logout") {
      logout();
    }
  };
  const sidebarItems = [
    { icon: <Home size={24} />, text: "Home" },
    { icon: <Search size={24} />, text: "Search" },
    { icon: <MessageCircle size={24} />, text: "Messages" },
    { icon: <Heart size={24} />, text: "Notifications" },
    { icon: <PlusSquare size={24} />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt={user?.username} />
          <AvatarFallback>
            {user?.username?.charAt(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <ThemeToggle />, text: "Theme" },
    { icon: <LogOut size={24} />, text: "Logout" },
  ];
  return (
    <div className="fixed top-0 z-10 left-0 px-2 md:px-4 border-r border-gray-300 dark:border-gray-800 w-[70px] md:w-[230px] h-screen bg-white dark:bg-black transition-all duration-300 shadow-lg">
      <div className="flex flex-col">
        <div className="my-6 pl-0 md:pl-3 flex items-center justify-center md:justify-start gap-2">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <Instagram className="h-11 w-11 md:h-12 md:w-12 dark:text-white instagram-text-gradient transition-transform duration-300 hover:rotate-12 cursor-pointer" />
          </div>
          <div className="hidden md:block text-3xl md:text-4xl font-instagram instagram-text-gradient transition-all duration-300 hover:scale-105 cursor-pointer">
            Instagram
          </div>
        </div>
        <div className="space-y-1">
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer rounded-xl p-3.5 my-2 transition-all duration-200 hover:translate-x-1"
              >
                <div className="transition-transform duration-200 hover:scale-110">
                  {item.icon}
                </div>
                <span className="hidden md:inline font-medium">
                  {item.text}
                </span>{" "}
                {item.text === "Notifications" &&
                  (likeNotification?.length > 0 ||
                    commentNotification?.length > 0 ||
                    followNotification?.length > 0 ||
                    savePostNotification?.length > 0) && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full h-6 w-6 instagram-gradient text-white shadow-lg hover:scale-110 transition-transform absolute -top-1 -right-1 md:top-0 md:-right-1 font-medium animate-pulse"
                        >
                          {(likeNotification?.length || 0) +
                            (commentNotification?.length || 0) +
                            (followNotification?.length || 0) +
                            (savePostNotification?.length || 0)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="max-h-96 overflow-y-auto">
                          <h3 className="font-semibold mb-2 text-sm">
                            Notifications
                          </h3>{" "}
                          {likeNotification?.length === 0 &&
                          commentNotification?.length === 0 &&
                          followNotification?.length === 0 &&
                          savePostNotification?.length === 0 ? (
                            <p className="text-gray-500">
                              No new notifications
                            </p>
                          ) : (
                            <>
                              {followNotification?.map((notification) => (
                                <div
                                  key={`follow-${notification.userId}`}
                                  className="flex items-center gap-2 my-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                >
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage
                                      src={
                                        notification.userDetails?.profilePicture
                                      }
                                    />
                                    <AvatarFallback>
                                      {notification.userDetails?.username?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm">
                                      <span className="font-bold">
                                        {notification.userDetails?.username}
                                      </span>{" "}
                                      started following you
                                    </p>{" "}
                                    <span className="text-xs text-gray-500">
                                      {getRelativeTimeString(
                                        notification.timestamp
                                      )}
                                    </span>
                                  </div>
                                </div>
                              ))}

                              {likeNotification?.map((notification) => (
                                <div
                                  key={`like-${notification.userId}-${notification.postId}`}
                                  className="flex items-center gap-2 my-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                >
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage
                                      src={
                                        notification.userDetails?.profilePicture
                                      }
                                    />
                                    <AvatarFallback>
                                      {notification.userDetails?.username?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm">
                                      <span className="font-bold">
                                        {notification.userDetails?.username}
                                      </span>{" "}
                                      liked your post
                                    </p>{" "}
                                    <span className="text-xs text-gray-500">
                                      {getRelativeTimeString(
                                        notification.timestamp
                                      )}
                                    </span>
                                  </div>
                                </div>
                              ))}

                              {commentNotification?.map((notification) => (
                                <div
                                  key={`comment-${notification.userId}-${notification.commentId}`}
                                  className="flex items-center gap-2 my-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                >
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage
                                      src={
                                        notification.userDetails?.profilePicture
                                      }
                                    />
                                    <AvatarFallback>
                                      {notification.userDetails?.username?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm">
                                      <span className="font-bold">
                                        {notification.userDetails?.username}
                                      </span>{" "}
                                      commented on your post
                                    </p>{" "}
                                    <span className="text-xs text-gray-500">
                                      {getRelativeTimeString(
                                        notification.timestamp
                                      )}
                                    </span>
                                  </div>
                                </div>
                              ))}

                              {savePostNotification?.map((notification) => (
                                <div
                                  key={`save-${notification.userId}-${notification.postId}`}
                                  className="flex items-center gap-2 my-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                >
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage
                                      src={
                                        notification.userDetails?.profilePicture
                                      }
                                    />
                                    <AvatarFallback>
                                      {notification.userDetails?.username?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm">
                                      <span className="font-bold">
                                        {notification.userDetails?.username}
                                      </span>{" "}
                                      saved your post
                                    </p>{" "}
                                    <span className="text-xs text-gray-500">
                                      {getRelativeTimeString(
                                        notification.timestamp
                                      )}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
