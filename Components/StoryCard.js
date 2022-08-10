import { useSession } from "next-auth/react";
import React from "react";
import Image from "next/image";

function StoryCard({ imageSrc, bgColor }) {
  const session = useSession();
  return (
    <div
      className={
        "relative h-48 min-w-[100px] sm:min-w-fit 2xl:h-56 w-23% sm:w-[19%] rounded-xl border box-border shadow-md" +
        bgColor
      }
    >
      <div className="border-4 absolute border-blue-600 top-2 left-2 rounded-full w-[40px] h-[40px]">
        <Image
          src={session.data.user.image}
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      {/* <Image src={imageSrc} layout="fixed" /> */}
      <p className="absolute bottom-2 left-2 text-[11px] font-medium text-black text-ellipsis w-10/12">
        {session.data.user.name}
      </p>
    </div>
  );
}

export default StoryCard;
