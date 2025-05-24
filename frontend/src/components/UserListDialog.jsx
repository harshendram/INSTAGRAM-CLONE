import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const UserListDialog = ({
  users = [],
  title,
  trigger,
  onFollowToggle,
  emptyMessage = "No users yet",
  onOpen,
}) => {
  const { user: currentUser } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = async (open) => {
    setOpen(open);
    if (open && onOpen) {
      setLoading(true);
      await onOpen();
      setLoading(false);
    }
  };

  const handleFollowToggle = async (userId, isFollowing) => {
    try {
      if (!currentUser) {
        toast.error("You need to be logged in");
        return;
      }

      const endpoint = isFollowing ? "unfollow" : "follow";
      const res = await axios.get(
        `http://localhost:5000/api/v1/user/${userId}/${endpoint}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        if (onFollowToggle) {
          onFollowToggle(userId, !isFollowing);
        }
      }
    } catch (error) {
      console.error("Follow toggle error:", error);
      toast.error("Failed to update follow status");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>{" "}
        <div className="overflow-y-auto max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between py-3 px-1 border-b border-gray-100 dark:border-gray-800"
              >
                <Link
                  to={`/profile/${user._id}`}
                  className="flex items-center gap-3"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.profilePicture}
                      alt={user.username}
                    />
                    <AvatarFallback>
                      {user.username?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{user.username}</p>
                    {user.fullName && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.fullName}
                      </p>
                    )}
                  </div>
                </Link>

                {currentUser && currentUser._id !== user._id && (
                  <Button
                    onClick={() =>
                      handleFollowToggle(
                        user._id,
                        user.followers?.includes(currentUser._id)
                      )
                    }
                    variant={
                      user.followers?.includes(currentUser._id)
                        ? "outline"
                        : "default"
                    }
                    className="text-xs h-8"
                    size="sm"
                  >
                    {user.followers?.includes(currentUser._id)
                      ? "Unfollow"
                      : "Follow"}
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-20">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {emptyMessage}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserListDialog;
