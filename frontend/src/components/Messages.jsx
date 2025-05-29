import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
import { cn } from "@/lib/utils";
import { getRelativeTimeString } from "@/utils/dateFormatter";
import { CheckCheck, ImageIcon, MicIcon, SmileIcon } from "lucide-react";

const Messages = ({ selectedUser }) => {
  const [today] = useState(() => new Date().toLocaleDateString());

  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="overflow-y-auto flex-1 px-4 pt-2 pb-4">
      <div
        className="flex justify-center mb-6 fade-in"
        style={{ animationDuration: "0.5s" }}
      >
        <div className="flex flex-col items-center justify-center">
          {" "}
          <Avatar className="h-[72px] w-[72px] ring-2 ring-offset-2 ring-gray-200 dark:ring-gray-700 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback className="text-xl font-bold bg-blue-500 text-white">
              {selectedUser?.username?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="mt-3 mb-1 font-semibold text-xl">
            {selectedUser?.username}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {useSelector((store) => store.chat.onlineUsers).includes(
              selectedUser?._id
            )
              ? "Active now"
              : "Last seen recently"}
          </span>
          <div className="mb-2 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full">
            {today}
          </div>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 mt-1 mb-2 bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-300 border-none hover:scale-105 px-5">
              View profile
            </Button>
          </Link>
        </div>
      </div>{" "}
      {/* Date separator */}
      {messages && messages.length > 0 && (
        <div className="flex justify-center mb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {(() => {
              try {
                const date = new Date(messages[0].createdAt);
                if (isNaN(date.getTime())) return "Today";

                // Check if the date is today
                const today = new Date();
                if (date.toDateString() === today.toDateString())
                  return "Today";

                // Check if the date is yesterday
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                if (date.toDateString() === yesterday.toDateString())
                  return "Yesterday";

                // Otherwise return the formatted date
                return date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year:
                    today.getFullYear() !== date.getFullYear()
                      ? "numeric"
                      : undefined,
                });
              } catch (error) {
                return "Today";
              }
            })()}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {messages &&
          messages.map((msg, index) => {
            const isSender = msg.senderId === user?._id;
            const showAvatar =
              !isSender &&
              (!messages[index - 1] ||
                messages[index - 1].senderId !== msg.senderId);

            // Check if this is the last message from this sender
            const isLastFromSender =
              !messages[index + 1] ||
              messages[index + 1].senderId !== msg.senderId;

            return (
              <div
                key={msg._id}
                className={cn(
                  "flex mb-1 slide-up items-end",
                  isSender ? "justify-end" : "justify-start"
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {!isSender && showAvatar && (
                  <Avatar className="h-6 w-6 mr-2 mb-4">
                    <AvatarImage
                      src={selectedUser?.profilePicture}
                      alt="profile"
                    />
                    <AvatarFallback>
                      {selectedUser?.username?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                {!isSender && !showAvatar && <div className="w-6 mr-2"></div>}{" "}
                <div
                  className={cn(
                    "py-2 px-3 max-w-xs break-words",
                    isSender
                      ? "bg-blue-500 text-white rounded-2xl rounded-br-md"
                      : "bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-2xl rounded-bl-md",
                    isLastFromSender ? "mb-3" : "mb-0.5",
                    "chat-bubble-" + (isSender ? "out" : "in")
                  )}
                >
                  <p className="text-sm">{msg.message}</p>

                  {/* Show timestamp only on last message from sender */}
                  {isLastFromSender && (
                    <div
                      className={cn(
                        "flex items-center gap-1 mt-1",
                        isSender ? "justify-end" : "justify-start"
                      )}
                    >
                      <span
                        className={cn(
                          "text-[10px]",
                          isSender
                            ? "text-blue-100"
                            : "text-gray-500 dark:text-gray-400"
                        )}
                      >
                        {getRelativeTimeString(msg.createdAt)}
                      </span>

                      {/* Show read status for sender's messages */}
                      {isSender && (
                        <CheckCheck className="h-3 w-3 text-blue-100" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>
      {/* Empty state message */}
      {(!messages || messages.length === 0) && (
        <div className="flex flex-col items-center justify-center h-40 text-gray-500">
          <p className="mb-2">No messages yet</p>
          <p className="text-sm">Send a message to start a conversation</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
