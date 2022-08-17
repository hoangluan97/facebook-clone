import React from "react";
import Image from "next/image";

function Comment({ imgSrc, name, content, commentTime }) {
  return (
    <div className="flex items-start max-w-fit space-x-2 ">
      <div>
        <Image src={imgSrc} width={30} height={30} className="rounded-full" />
      </div>
      <div className="flex flex-col bg-gray-100 border rounded-2xl space-x-2 px-2 py-1 text-[14px] grow">
        <p className="font-medium">{name}</p>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default Comment;
