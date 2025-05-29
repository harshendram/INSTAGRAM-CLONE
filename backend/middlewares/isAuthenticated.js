import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("No token found in cookies");
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    try {
      const decode = await jwt.verify(token, process.env.SECRET_KEY);
      req.id = decode.userId;

      // Check if token is getting close to expiration (less than 1 day left)
      const tokenExp = decode.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      const timeRemaining = tokenExp - currentTime;
      const oneDayInSeconds = 24 * 60 * 60;

      // If token has less than a day remaining, refresh it silently
      if (timeRemaining < oneDayInSeconds) {
        console.log("Token is close to expiration, refreshing...");

        // Create a new token with the same userId
        const newToken = jwt.sign(
          { userId: decode.userId },
          process.env.SECRET_KEY,
          {
            expiresIn: "5d", // 5 days
          }
        );

        // Set the new cookie
        res.cookie("token", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days in milliseconds
          path: "/",
        });
      }

      next();
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};
export default isAuthenticated;
