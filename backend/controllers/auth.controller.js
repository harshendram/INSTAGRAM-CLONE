// Add a route handler to check authentication status
import isAuthenticated from "../middlewares/isAuthenticated.js";

export const checkAuth = async (req, res) => {
  try {
    // If middleware passes, the user is authenticated
    return res.status(200).json({
      authenticated: true,
      userId: req.id,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return res.status(401).json({
      authenticated: false,
      message: "Not authenticated",
    });
  }
};
