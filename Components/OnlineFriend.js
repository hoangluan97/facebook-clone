import React, { useContext, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { Context } from "../pages/_app";

function OnlineFriend({ onlineFriendEmail }) {
  const session = useSession();
  const [friendProfile, loading, error] = useDocument(
    doc(db, `users/${onlineFriendEmail}`)
  );

  const { chatbox } = useContext(Context);
  const [showChatBox, setShowChatBox] = chatbox;

  const handleClickShowChatbox = () => {
    setShowChatBox([
      "",
      onlineFriendEmail,
      friendProfile.data().userProfileData.userName,
    ]);
  };

  const contentOnline = () => {
    if (friendProfile && !loading) {
      return (
        <>
          <div
            onClick={handleClickShowChatbox}
            className="hover:bg-gray-300 rounded-md cursor-pointer flex items-center"
          >
            <div className="flex relative p-2 space-x-2 items-center">
              <Image
                src={friendProfile?.data()?.userProfileData.userAvatar}
                width={35}
                height={35}
                layout="fixed"
                className="rounded-full"
              />
              <div className="absolute top-8 right-2 bg-green-500 border-2 w-3 h-3 rounded-full"></div>
            </div>
            <div>
              <p className="font-medium text-[14px]">
                {friendProfile?.data()?.userProfileData.userName}
              </p>
            </div>
          </div>
        </>
      );
    }
  };

  return <>{contentOnline()}</>;
}

export default OnlineFriend;
