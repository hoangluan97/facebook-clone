import React from "react";
import Stories from "./Stories";
import PostInput from "./PostInput";
import Posts from "./Posts";

function NewsFeed() {
  return (
    <div className="w-full md:w-auto flex justify-center grow mt-4 sm:m-4">
      <div className="flex flex-col items-center w-full sm:w-[600px] rightbar:w-90% lg:w-[600px] 2xl:w-[688px] space-y-4">
        <Stories />
        <PostInput />
        <Posts />
      </div>
    </div>
  );
}

export default NewsFeed;
