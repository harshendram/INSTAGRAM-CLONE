import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

// More robust socket.io configuration
const io = new Server(server, {
  cors: {
    origin: [process.env.URL, "http://localhost:5173"], // Allow local development
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  pingTimeout: 60000, // How long to wait before considering connection closed
  pingInterval: 25000, // How often to ping the client
  transports: ["websocket", "polling"], // Allow both websocket and polling
  allowEIO3: true, // Allow Engine.IO v3 client compatibility
});

const userSocketMap = {}; // this map stores socket id corresponding the user id; userId -> socketId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle connection errors
  socket.on("error", (error) => {
    // Silent error handling
  });
  socket.on("disconnect", (reason) => {
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
