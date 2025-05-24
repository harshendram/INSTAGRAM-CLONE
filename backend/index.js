import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

// Setup error handling for unhandled promises
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: [process.env.URL, "http://localhost:5173"], // Allow local development
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// yha pr apni api ayengi
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Start the server
server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server listening at port ${PORT}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB.");
    console.log(
      "Make sure your IP is whitelisted in MongoDB Atlas: https://www.mongodb.com/docs/atlas/security-whitelist/"
    );
  }
});
// This section was removed to simplify the code
