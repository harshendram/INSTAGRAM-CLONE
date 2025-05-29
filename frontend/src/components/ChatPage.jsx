import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  MessageCircleCode,
  Search,
  Smile,
  ImageIcon,
  Paperclip,
  Send,
} from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = suggestedUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessageHandler = async (receiverId) => {
    if (!textMessage.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);
  return (
    <div className="flex h-screen">
      {/* Conversation sidebar */}{" "}
      <section className="w-[350px] border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-center items-center mb-4 relative">
            <h1 className="font-semibold text-xl text-center">Messages</h1>
            <button className="absolute right-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M19 12H5" />
              </svg>
            </button>
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-gray-100 dark:bg-gray-800 border-none focus-visible:ring-blue-400"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          </div>
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-hide">
          {filteredUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            const isSelected = selectedUser?._id === suggestedUser._id;
            return (
              <div
                key={suggestedUser._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className={`flex gap-3 items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-300 ${
                  isSelected ? "bg-gray-100 dark:bg-gray-800/50" : ""
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12 ring-2 ring-offset-1 ring-white dark:ring-gray-900">
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {suggestedUser?.username?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium text-sm">
                      {suggestedUser?.username}
                    </span>{" "}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {(() => {
                        try {
                          // In a real app, this would show the last message timestamp
                          const now = new Date();
                          const minutes = Math.floor(Math.random() * 30); // Random time for demo purposes
                          return minutes === 0 ? "now" : `${minutes}m`;
                        } catch (error) {
                          return "now";
                        }
                      })()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {isOnline ? "Active now" : "Last seen recently"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* Message content area */}
      {selectedUser ? (
        <section className="flex-1 flex flex-col h-full">
          {" "}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-black z-10 shadow-sm">
            {" "}
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                <AvatarFallback className="bg-blue-500 text-white">
                  {selectedUser?.username?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">{selectedUser?.username}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  {onlineUsers.includes(selectedUser?._id) && (
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 inline-block"></span>
                  )}
                  {onlineUsers.includes(selectedUser?._id)
                    ? "Active now"
                    : "Last seen recently"}
                </span>
              </div>
            </div>{" "}
            <div className="flex items-center gap-8">
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 7l-6.5 6.5L19 16l-3-3-6.5 6.5L7 23"></path>
                  <path d="M19 1l-4 4-7-7-7 7 7 7-4 4 7 7 7-7-7-7 4-4 7 7 7-7-7-7z"></path>
                </svg>
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </button>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />{" "}
          <div className="flex items-center p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Smile className="h-5 w-5" />
            </button>
            <div className="flex-1 relative mx-2">
              <Input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                type="text"
                className="w-full rounded-full bg-gray-100 dark:bg-gray-800 border-none focus-visible:ring-blue-400 py-2 px-4"
                placeholder="Message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessageHandler(selectedUser?._id);
                  }
                }}
              />
            </div>
            <div className="flex items-center">
              {textMessage ? (
                <Button
                  onClick={() => sendMessageHandler(selectedUser?._id)}
                  className="font-semibold text-blue-500 hover:text-blue-600 bg-transparent hover:bg-transparent border-none shadow-none p-0"
                >
                  Send
                </Button>
              ) : (
                <div className="flex items-center">
                  <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ImageIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center max-w-sm text-center px-4">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center mb-6">
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>{" "}
            <h1 className="font-semibold text-2xl mb-4">Messages</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-base">
              Share photos, videos or send a message to a friend
            </p>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-300 px-6 py-2 rounded-lg">
              Send Message
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
