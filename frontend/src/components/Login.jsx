import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import api from "@/utils/axiosConfig";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Instagram } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import instagramLogo from "../assets/instagramlogo.jpg";
import { ThemeToggle } from "./ui/theme-toggle";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post(
        "/user/login",
        input
        // Headers and withCredentials are already set in the api instance
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []); // Instagram SVG Logo
  const InstagramTextLogo = ({ className }) => (
    <svg className={className} height="29" viewBox="0 0 103 29" width="103">
      <path
        d="M9.6996 2.16773C11.8816 2.16773 12.1748 2.18136 13.1204 2.22226C13.9912 2.2591 14.5068 2.39258 14.8425 2.5075C15.2851 2.6593 15.6071 2.84274 15.9432 3.1789C16.2793 3.51507 16.4628 3.83699 16.6146 4.27962C16.7295 4.61534 16.863 5.13139 16.8998 6.00124C16.9407 6.94639 16.9544 7.2404 16.9544 9.42199C16.9544 11.6036 16.9407 11.8973 16.8998 12.8425C16.863 13.7131 16.7295 14.2284 16.6146 14.5641C16.4628 15.0068 16.2793 15.3287 15.9432 15.6648C15.6071 16.001 15.2851 16.1844 14.8425 16.3362C14.5068 16.4512 13.9912 16.5846 13.1204 16.6215C12.1757 16.6624 11.8816 16.676 9.6996 16.676C7.51761 16.676 7.22359 16.6624 6.27885 16.6215C5.40812 16.5846 4.89248 16.4512 4.55676 16.3362C4.11414 16.1844 3.79221 16.001 3.45605 15.6648C3.11988 15.3287 2.93645 15.0068 2.78465 14.5641C2.66972 14.2284 2.53625 13.7124 2.4994 12.8425C2.45851 11.8973 2.44487 11.6036 2.44487 9.42199C2.44487 7.2404 2.45851 6.94639 2.4994 6.00124C2.53625 5.13051 2.66972 4.61534 2.78465 4.27962C2.93645 3.83699 3.11988 3.51507 3.45605 3.1789C3.79221 2.84274 4.11414 2.6593 4.55676 2.5075C4.89248 2.39258 5.40812 2.2591 6.27885 2.22226C7.22446 2.18136 7.51805 2.16773 9.6996 2.16773ZM9.6996 0C7.47265 0 7.15481 0.0152075 6.19598 0.0563721C5.23935 0.0975366 4.5487 0.237744 3.94365 0.44825C3.31773 0.666865 2.78828 0.95704 2.26257 1.48319C1.73642 2.0089 1.44624 2.53834 1.22763 3.16382C1.01712 3.76887 0.876917 4.45952 0.835753 5.41615C0.794588 6.3754 0.77938 6.69324 0.77938 8.92019C0.77938 11.1471 0.794588 11.465 0.835753 12.4238C0.876917 13.3804 1.01712 14.0711 1.22763 14.6761C1.44624 15.3021 1.73642 15.8315 2.26257 16.3572C2.78828 16.8829 3.31773 17.1731 3.94321 17.3917C4.5487 17.6022 5.23891 17.7424 6.19554 17.7836C7.15438 17.8248 7.47221 17.84 9.69917 17.84C11.9261 17.84 12.244 17.8248 13.2028 17.7836C14.1594 17.7424 14.8501 17.6022 15.4551 17.3917C16.0811 17.1731 16.6105 16.8829 17.1362 16.3572C17.662 15.8315 17.9521 15.3021 18.1707 14.6766C18.3812 14.0711 18.5214 13.3808 18.5626 12.4242C18.6038 11.4654 18.619 11.1475 18.619 8.92063C18.619 6.69367 18.6038 6.37584 18.5626 5.41701C18.5214 4.46038 18.3812 3.76973 18.1707 3.16469C17.9521 2.53877 17.662 2.00933 17.1362 1.48362C16.6105 0.957478 16.0811 0.667303 15.4556 0.44868C14.8506 0.238173 14.1599 0.0979655 13.2033 0.0568009C12.2436 0.0152075 11.9262 0 9.6996 0Z"
        fill="currentColor"
      />
      <path
        d="M27.1301 8.95616H30.041C32.4778 8.95616 34.2775 10.7364 34.2775 13.143C34.2775 15.5496 32.4775 17.3301 30.041 17.3301H27.1301V8.95616ZM28.4872 16.0349H29.9254C31.6077 16.0349 32.8418 14.9075 32.8418 13.143C32.8418 11.3786 31.6077 10.2514 29.9254 10.2514H28.4872V16.0349Z"
        fill="currentColor"
      />
    </svg>
  );
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900 overflow-hidden transition-all duration-700">
      <div className="absolute top-4 right-4 fade-in">
        <ThemeToggle />
      </div>
      <div className="container px-4 mx-auto flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Phone mockup - visible only on medium screens and above */}
        <div
          className="hidden md:block relative w-[380px] h-[580px] scale-in"
          style={{ animationDuration: "0.7s" }}
        >
          <img
            src="https://static.cdninstagram.com/images/instagram/xig/homepage/phones/home-phones.png"
            alt="Instagram App"
            className="w-full h-full object-contain hover:scale-105 transition-all duration-700"
          />
        </div>

        <div
          className="w-full max-w-sm fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <form
            onSubmit={signupHandler}
            className="shadow-lg border dark:border-gray-800 bg-white dark:bg-black flex flex-col gap-4 p-8 rounded-xl hover:shadow-xl transition-all duration-300"
          >
            <div className="my-5 flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 mb-4 hover:scale-105 transition-all duration-300">
                <img
                  src={instagramLogo}
                  alt="Instagram Logo"
                  className="w-14 h-14 rounded-full object-cover shadow-md"
                />
                <span className="text-4xl font-instagram instagram-text-gradient">
                  Instagram
                </span>
              </div>
            </div>{" "}
            <div
              className="space-y-4 slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="transition-all duration-300 hover:translate-y-[-2px]">
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="focus-visible:ring-blue-500 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-11 rounded-xl shadow-sm hover:shadow transition-all duration-300"
                />
              </div>
              <div className="transition-all duration-300 hover:translate-y-[-2px]">
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={input.password}
                  onChange={changeEventHandler}
                  className="focus-visible:ring-blue-500 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-11 rounded-xl shadow-sm hover:shadow transition-all duration-300"
                />
              </div>
            </div>
            {loading ? (
              <Button
                className="instagram-gradient h-11 mt-4 font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-none slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="instagram-gradient h-11 mt-4 font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-none hover:scale-105 slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                Log in
              </Button>
            )}
            <div className="flex items-center my-2">
              <div className="h-px bg-gray-300 dark:bg-gray-700 flex-grow"></div>{" "}
              <span className="mx-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                OR
              </span>
              <div className="h-px bg-gray-300 dark:bg-gray-700 flex-grow"></div>
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-2 text-sm text-blue-900 dark:text-blue-600 font-semibold mt-3 transition-colors hover:text-blue-700"
            >
              <svg
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
              </svg>
              Continue with Facebook
            </button>
            <a
              href="#"
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400 text-center mt-4 block transition-colors"
            >
              Forgot password?
            </a>
          </form>
          <div className="border dark:border-gray-800 p-5 mt-4 text-center bg-white dark:bg-black shadow-md rounded-md">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-500 hover:text-blue-700 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>{" "}
          <div className="text-center mt-6">
            <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
              Get the app.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="#"
                className="block transition-transform hover:scale-105"
              >
                <img
                  src="https://static.cdninstagram.com/rsrc.php/v3/yt/r/Yfc020c87j0.png"
                  alt="App Store"
                  className="h-10"
                />
              </a>
              <a
                href="#"
                className="block transition-transform hover:scale-105"
              >
                <img
                  src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
                  alt="Google Play"
                  className="h-10"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
