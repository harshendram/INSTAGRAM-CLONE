import mongoose from "mongoose";

// This is a fallback connection function that will try to connect to a local MongoDB instance
// if the Atlas connection fails
const connectLocalDB = async () => {
  try {
    console.log("Attempting to connect to local MongoDB...");
    await mongoose.connect("mongodb://localhost:27017/instaclone", {
      serverSelectionTimeoutMS: 5000, // Lower timeout for local
      socketTimeoutMS: 10000,
      family: 4,
      connectTimeoutMS: 10000,
    });
    console.log("Connected to local MongoDB successfully.");
    return true;
  } catch (error) {
    console.error("Local MongoDB connection failed:", error);
    return false;
  }
};

export default connectLocalDB;
