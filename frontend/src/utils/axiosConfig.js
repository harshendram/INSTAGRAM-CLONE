import axios from "axios";

// Create an axios instance that automatically includes credentials
const api = axios.create({
  // In production, this will use the relative path which works with the deployed app
  // In development, we need to specify the full URL
  baseURL:
    process.env.NODE_ENV === "production"
      ? "/api/v1"
      : "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to check authentication status
export const checkAuthStatus = async () => {
  try {
    const response = await api.get("/user/check-auth");
    return {
      isAuthenticated: response.data.authenticated,
      userId: response.data.userId,
    };
  } catch (error) {
    // Check if we have a user in Redux store before declaring not authenticated
    let isStoredUserAvailable = false;
    try {
      const storedUser = JSON.parse(localStorage.getItem("persist:root"));
      if (storedUser && storedUser.auth) {
        const authData = JSON.parse(storedUser.auth);
        isStoredUserAvailable = !!authData.user;
      }
    } catch (storageError) {
      console.error("Failed to check local storage:", storageError);
    }

    if (error.response?.status === 401 && !isStoredUserAvailable) {
      console.error("Authentication check failed:", error);
      return {
        isAuthenticated: false,
        userId: null,
      };
    } else {
      // If there's a network error but user exists in Redux, assume still authenticated
      return {
        isAuthenticated: isStoredUserAvailable,
        userId: null,
      };
    }
  }
};

// Add a request interceptor to handle token if needed in the future
api.interceptors.request.use(
  (config) => {
    // You can modify config here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors globally if needed
    if (error.response && error.response.status === 401) {
      console.error("Authentication error:", error.response.data);

      // Check if we already have a redirect in progress to avoid multiple redirects
      const isRedirectInProgress = sessionStorage.getItem(
        "auth_redirect_in_progress"
      );

      if (!isRedirectInProgress) {
        sessionStorage.setItem("auth_redirect_in_progress", "true");

        // Only redirect if error specifically mentions authentication issues
        if (
          error.response.data?.message
            ?.toLowerCase()
            .includes("not authenticated") ||
          error.response.data?.message?.toLowerCase().includes("invalid token")
        ) {
          setTimeout(() => {
            sessionStorage.removeItem("auth_redirect_in_progress");
            window.location.href = "/login";
          }, 1000);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
