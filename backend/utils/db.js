import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds
      connectTimeoutMS: 30000, // Increase connection timeout
      family: 4, // Use IPv4, skip trying IPv6
    });

    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Rethrow to handle in the calling code
  }
};
export default connectDB;
