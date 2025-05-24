import { setMessages } from "@/redux/chatSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
  const { messages } = useSelector((store) => store.chat);

  // Use useRef to store the latest messages without causing re-renders
  const messagesRef = useRef(messages);

  // Keep the ref up to date
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    // Define the message handler
    const handleNewMessage = (newMessage) => {
      const currentMessages = messagesRef.current || [];
      dispatch(setMessages([...currentMessages, newMessage]));
    };

    // Remove any existing listeners to avoid duplicates
    socket.off("newMessage");

    // Add the new message listener
    socket.on("newMessage", handleNewMessage);

    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [socket, dispatch]);
};
export default useGetRTM;
