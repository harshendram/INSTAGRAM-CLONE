import React from "react";
import Posts from "./Posts";
import Stories from "./Stories";

const Feed = () => {
  return (
    <div className="feed-container flex-1 my-4 md:my-8">
      <div className="w-full max-w-[470px] mx-auto lg:mx-0">
        <Stories />
        <Posts />
      </div>
    </div>
  );
};

export default Feed;
