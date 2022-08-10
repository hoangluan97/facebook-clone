import React from "react";
import StoryCard from "./StoryCard";
function Stories() {
  return (
    <div className=" flex justify-between overflowx-hidden flex-wrap w-full md:w-[100%] max-h-fit">
      <StoryCard bgColor={" bg-blue-500"} />
      <StoryCard bgColor={" bg-blue-500"} />
      <StoryCard bgColor={" bg-blue-500"} />
      <StoryCard bgColor={" bg-blue-500"} />
      <StoryCard bgColor={" bg-blue-500"} />
    </div>
  );
}

export default Stories;
