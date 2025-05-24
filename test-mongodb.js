// This is a simple script to test your MongoDB connection
// Run it with: node test-mongodb.js
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const testMongoDBConnection = async () => {
  try {
    console.log("Testing MongoDB connection...");
    console.log(
      "URI:",
      process.env.MONGODB_URI ? "URI exists" : "URI is missing"
    );

    // Simple connection with minimal options
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("\n✅ MongoDB connection successful!");

    // Test a simple query to make sure we can read data
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(`\nCollections in database (${collections.length} total):`);
    collections.forEach((collection) => {
      console.log(`- ${collection.name}`);
    });
  } catch (error) {
    console.error("\n❌ MongoDB connection failed!");
    console.error("Error message:", error.message);

    // Provide helpful information based on common error messages
    if (error.message.includes("ENOTFOUND")) {
      console.log("\nPossible fixes:");
      console.log("1. Check your internet connection");
      console.log("2. Verify the hostname in your MongoDB URI");
    } else if (error.message.includes("Authentication failed")) {
      console.log("\nPossible fixes:");
      console.log("1. Verify your username and password in the MongoDB URI");
      console.log("2. Make sure the user has access to the database");
    } else if (error.message.includes("not whitelisted")) {
      console.log("\nPossible fixes:");
      console.log(
        "1. Add your current IP address to the MongoDB Atlas IP whitelist"
      );
      console.log("2. Use the Network Access section in Atlas to add your IP");
    } else {
      console.log("\nPossible fixes:");
      console.log(
        "1. Make sure MONGODB_URI is correctly set in your .env file"
      );
      console.log("2. Verify MongoDB Atlas cluster is running");
      console.log(
        "3. Add your IP to MongoDB Atlas whitelist: https://www.mongodb.com/docs/atlas/security-whitelist/"
      );
    }
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("\nConnection closed.");
  }
};

// Run the test
testMongoDBConnection();
