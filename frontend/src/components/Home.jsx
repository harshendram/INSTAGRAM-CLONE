import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <div className="flex flex-row max-w-[975px] mx-auto px-4">
      <div className="flex-grow mr-8">
        <Feed />
        <Outlet />
      </div>
      <div className="hidden lg:block w-[320px]">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
