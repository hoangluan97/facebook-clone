import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  SearchIcon,
  UserIcon,
  InformationCircleIcon,
} from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import FriendRequestBoard from "./FriendRequestBoard";
import { Context } from "../pages/_app";
import NotiBoard from "./NotiBoard";
import { LogoutIcon } from "@heroicons/react/outline";

function Header() {
  const { noti } = useContext(Context);
  const [showNoti, setShowNoti] = noti;

  const session = useSession();
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");

  const [friendRequestss, loading, error] = useDocument(
    doc(db, `users/${session.data.user.email}`)
  );
  const [showFriendRequest, setShowFriendRequest] = useState("hidden");

  const notiRef = useRef(null);
  const friendRequestRef = useRef(null);

  const handleClickShowNoti = () => {
    if (showNoti) {
      setShowNoti("");
    }
    if (!showNoti) {
      setShowNoti("hidden");
    }
    if (!showFriendRequest) {
      setShowFriendRequest("hidden");
    }
  };

  const handleClickShowFriendRequest = () => {
    if (showFriendRequest) {
      setShowFriendRequest("");
    }
    if (!showFriendRequest) {
      setShowFriendRequest("hidden");
    }
    if (!showNoti) {
      setShowNoti("hidden");
    }
  };

  useEffect(() => {
    async function checkUserExist() {
      const userDoc = await getDoc(doc(db, `users/${session.data.user.email}`));

      if (!userDoc.exists()) {
        const userProfileData = {
          userName: session.data.user.name,
          userEmail: session.data.user.email,
          userAvatar: session.data.user.image,
        };
        await setDoc(doc(db, `users/${session.data.user.email}`), {
          userProfileData,
          friends: ["thithaicm1@gmail.com"],
          friendRequests: [],
          friendRequestSent: [],
          userProfile: {
            birth: new Date("2000-01-01").toISOString().split("T")[0],
            nation: "Vi???t Nam",
            gender: "Nam",
          },
        });
        updateDoc(doc(db, "users/thithaicm1@gmail.com"), {
          friends: arrayUnion(session.data.user.email),
        });
      }
    }
    (async () => await checkUserExist())();
  }, []);

  const notiNumber = () => {
    if (friendRequestss && !loading) {
      const number = friendRequestss.data()?.friendRequests;
      if (number?.length) {
        return (
          <span className="rounded-full absolute top-[-8px] right-[-8px] font-medium bg-red-400 min-w-fit h-auto flex justify-center items-center w-5 text-[12px]">
            {number?.length}
          </span>
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-between p-2 shadow-md sticky top-0 bg-white z-10">
      <div className="flex justify-start items-center space-x-2 w-[40%] sm:max-w-fit">
        <div className="cursor-pointer" onClick={() => router.push("/")}>
          <Image
            src="https://www.transparentpng.com/thumb/facebook-logo-png/photo-facebook-logo-png-hd-25.png"
            width={50}
            height={50}
            layout="fixed"
            className="bg-transparent"
          />
        </div>
        <div className="flex min-w-fit rounded-full h-10 items-center grow bg-gray-100 p-2">
          <SearchIcon className="h-6 min-h-fit shrink-0" />
          <form action="" className="xl:inline-flex max-w-fit relative">
            <input
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
              type="text"
              placeholder="Search Facebook"
              className="focus:outline-none w-[90%] sm:w-32 md:w-60 bg-transparent ml-2 placeholder:text-sm flex-shink "
            />
            <button
              type="submit"
              className="hidden"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/FriendSearch/${searchInput}`);
                setSearchInput("");
              }}
            ></button>
          </form>
        </div>
      </div>
      <div className="flex justify-end space-x-4 ">
        <div
          onClick={() =>
            router.push(`/PersonalPage/${session.data.user.email}`)
          }
          className="flex items-center w-10 h-10 overflow-hidden rounded-full justify-center bg-slate-200 cursor-pointer"
        >
          <Image
            src={session.data.user.image}
            width={35}
            height={35}
            layout="fixed"
            className="rounded-full"
          />
        </div>
        <div
          ref={friendRequestRef}
          onClick={handleClickShowFriendRequest}
          className="icon relative overflow-visible"
        >
          {notiNumber()}
          <UserIcon className="h-6" />
        </div>
        <FriendRequestBoard
          friendRequestRef={friendRequestRef}
          showFriendRequest={showFriendRequest}
          requestList={friendRequestss?.data()}
          onClickOutsideFRB={() => setShowFriendRequest("hidden")}
        />
        <div className="icon" ref={notiRef} onClick={handleClickShowNoti}>
          <InformationCircleIcon className="h-6" />
        </div>
        <NotiBoard
          notiRef={notiRef}
          showNoti={showNoti}
          onClickOutsideNB={() => {
            setShowNoti("hidden");
          }}
        />
        <div
          className="flex items-center w-10 h-10 overflow-hidden rounded-full justify-center bg-slate-200 cursor-pointer"
          onClick={() => {
            signOut();
          }}
        >
          <LogoutIcon className="w-5" />
        </div>
      </div>
    </div>
  );
}

export default Header;
