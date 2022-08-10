import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

function OnlineFriend() {
  const session = useSession();
  return (
    <div className="hover:bg-gray-300 rounded-md cursor-pointer flex items-center">
      <div className="flex relative p-2 space-x-2 items-center">
        <Image
          src={session.data.user.image}
          width={35}
          height={35}
          layout="fixed"
          className="rounded-full"
        />
        <div className="absolute top-8 right-2 bg-green-500 border-2 w-3 h-3 rounded-full"></div>
      </div>
      <div>
        <p className="font-medium text-[14px]">{session.data.user.name}</p>
      </div>
    </div>
  );
}

export default OnlineFriend;
