import { io } from "socket.io-client";

// This is a singleton socket instance
let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Create a socket connection (or return existing one)
export const getSocket = (userId) => {
  if (!userId) return null;

  // Return existing socket if it exists and is connected
  if (socket && socket.connected) {
    return socket;
  }

  // Determine the correct server URL
  const serverUrl =
    process.env.NODE_ENV === "production"
      ? window.location.origin // Use the same domain in production
      : "http://localhost:5000"; // Localhost for development
  // Create new socket connection with reconnection options
  socket = io(serverUrl, {
    query: { userId },
    transports: ["websocket", "polling"], // Try websocket first, fallback to polling
    reconnection: true,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  // Setup connection event handlers
  socket.on("connect", () => {
    reconnectAttempts = 0;
  });

  socket.on("connect_error", () => {
    reconnectAttempts++;
  });

  return socket;
};

// Close the socket connection
export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
