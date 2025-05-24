import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";
import { useTheme } from "./ui/theme-provider";

const MainLayout = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      } min-h-screen`}
    >
      <LeftSidebar />{" "}
      <div className="ml-[70px] md:ml-[230px] px-1 transition-all duration-200">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
