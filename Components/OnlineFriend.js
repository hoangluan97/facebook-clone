import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { collection, doc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { Context } from "../pages/_app";
import { ChatAlt2Icon } from "@heroicons/react/solid";
import { useRouter } from "next/router";

function OnlineFriend({ onlineFriendEmail }) {
  const router = useRouter();
  const session = useSession();
  const [friendProfile, loading, error] = useDocument(
    doc(db, `users/${onlineFriendEmail}`)
  );

  const { chatbox } = useContext(Context);
  const [showChatBox, setShowChatBox] = chatbox;
  const [unreadMess, setUnreadMess] = useState(0);

  const handleClickShowChatbox = () => {
    setShowChatBox([
      "",
      onlineFriendEmail,
      friendProfile.data().userProfileData.userName,
    ]);
  };
  const [mess, messloading] = useCollection(
    collection(db, `messages/${session.data.user.email}/${onlineFriendEmail}`)
  );
  useEffect(() => {
    if (mess && !messloading) {
      let num = mess.docs.filter((value) => value.data().read == false).length;
      setUnreadMess(num);
    }
  }, [mess]);

  const contentOnline = () => {
    if (friendProfile && !loading) {
      return (
        <div className="flex justify-between w-full">
          <div
            onClick={() => router.push(`/PersonalPage/${onlineFriendEmail}`)}
            className="hover:bg-gray-300 rounded-md cursor-pointer flex items-center w-[90%]"
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
          <div
            onClick={handleClickShowChatbox}
            className="max-h-fit flex flex-col justify-center relative"
          >
            <ChatAlt2Icon className="w-6 cursor-pointer" />
            {unreadMess != 0 && (
              <div className="absolute top-7 right-0 bg-red-300 border-2 w-4 h-4 rounded-full text-[10px] flex justify-center">
                <p>{unreadMess}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return <>{contentOnline()}</>;
}

export default OnlineFriend;
