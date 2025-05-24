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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/theme-toggle";
import { cn } from "@/lib/utils";

const LeftSidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [likeNotification, setLikeNotification] = useState([]);

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
      setLikeNotification([]);
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
    <div className="fixed top-0 z-10 left-0 px-2 md:px-4 border-r border-gray-300 dark:border-gray-800 w-[70px] md:w-[230px] h-screen bg-white dark:bg-black transition-all duration-200">
      <div className="flex flex-col">
        <div className="my-8 pl-0 md:pl-3 flex items-center justify-center md:justify-start">
          {/* Logo */}
          <div className="hidden md:block text-xl font-bold">Instagram</div>
          <div className="block md:hidden">
            <Instagram className="h-7 w-7 dark:text-white" />
          </div>
        </div>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer rounded-lg p-3 my-3"
              >
                {item.icon}
                <span className="hidden md:inline">{item.text}</span>
                {item.text === "Notifications" &&
                  likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                        >
                          {likeNotification.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>
                          {likeNotification.length === 0 ? (
                            <p>No new notification</p>
                          ) : (
                            likeNotification.map((notification) => {
                              return (
                                <div
                                  key={notification.userId}
                                  className="flex items-center gap-2 my-2"
                                >
                                  <Avatar>
                                    <AvatarImage
                                      src={
                                        notification.userDetails?.profilePicture
                                      }
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm">
                                    <span className="font-bold">
                                      {notification.userDetails?.username}
                                    </span>{" "}
                                    liked your post
                                  </p>
                                </div>
                              );
                            })
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
