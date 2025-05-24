import { useEffect } from "react";
import ChatPage from "./components/ChatPage";
import EditProfile from "./components/EditProfile";
import Home from "./components/Home";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import SearchPage from "./components/SearchPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { getSocket, closeSocket } from "./utils/socket.js";
import { ThemeProvider } from "./components/ui/theme-provider";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            {" "}
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/account/edit",
        element: (
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoutes>
            <ChatPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/search",
        element: (
          <ProtectedRoutes>
            <SearchPage />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    // Only create a socket if we have a user
    if (user) {
      // Get socket instance from our utility (creates new or returns existing)
      const socketio = getSocket(user?._id);

      // Store socket reference in Redux (but will be ignored by persistence)
      dispatch(setSocket(socketio));

      // Set up event listeners
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      // Clean up function to remove listeners on unmount or user change
      return () => {
        if (socketio) {
          socketio.off("getOnlineUsers");
          socketio.off("notification");
        }
      };
    } else {
      // No user, clean up socket
      closeSocket();
      dispatch(setSocket(null));
    }
  }, [user, dispatch, socket && socket.connected]);
  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="instagram-theme">
        <RouterProvider router={browserRouter} />
      </ThemeProvider>
    </>
  );
}

export default App;
