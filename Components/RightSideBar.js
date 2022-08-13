import React from "react";
import SideBarRow from "./SideBarRow";
import { BeakerIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";
import OnlineFriend from "./OnlineFriend";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../FirebaseConfig";

function RightSideBar() {
  const session = useSession();
  const [onlineFriend, loading, error] = useDocument(
    doc(db, `users/${session.data.user.email}`)
  );
  const onlineFriendContent = onlineFriend
    ?.data()
    ?.friends?.map((friend) => (
      <OnlineFriend key={friend} onlineFriendEmail={friend} />
    ));
  return (
    <div className="hidden rightbar:inline-flex rightbar:w-[280px] xl:w-[24%] 2xl:w-[360px] flex-col p-4 font-medium sticky top-16 self-start">
      <div className="flex justify-between items-center w-full">
        <p>Người liên hệ</p>
        <div className="flex w-1/3 justify-between">
          <BeakerIcon className="h-6 p-1 cursor-pointer hover:bg-gray-300 rounded-full" />
          <BeakerIcon className="h-6 p-1 cursor-pointer hover:bg-gray-300 rounded-full" />
          <BeakerIcon className="h-6 p-1 cursor-pointer hover:bg-gray-300 rounded-full" />
        </div>
      </div>
      {onlineFriendContent}
    </div>
  );
}

export default RightSideBar;
