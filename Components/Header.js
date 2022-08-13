import React, { useCallback, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { BeakerIcon } from "@heroicons/react/solid";
import HeaderIcon from "./HeaderIcon";
import Avatar from "../images/fblogo.png";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import FriendRequestBoard from "./FriendRequestBoard";
import { Context } from "../pages/_app";
import NotiBoard from "./NotiBoard";

function Header() {
  const { chatbox, noti } = useContext(Context);

  const [showChatBox, setShowChatBox] = chatbox;
  const [showNoti, setShowNoti] = noti;
  const session = useSession();
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const [friendRequestss, loading, error] = useDocument(
    doc(db, `users/${session.data.user.email}`)
  );
  const [clickFriendRequestBoard, setClickFriendRequestBoard] = useState(false);

  const handleClickShowChatbox = () => {
    setShowChatBox(() => {
      if (showChatBox) {
        return "";
      } else return "hidden";
    });
    if (!showNoti) {
      setShowNoti("hidden");
    }
  };

  const handleClickShowNoti = () => {
    setShowNoti(() => {
      if (showNoti) {
        return "";
      } else return "hidden";
    });
    if (!showChatBox) {
      setShowChatBox("hidden");
    }
  };

  // console.log(showChatBox);

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
          friends: [],
          friendRequests: [],
          friendRequestSent: [],
        });
      }
    }
    (async () => await checkUserExist())();
  }, []);

  const onChangeClickState = useCallback(() => {
    if (friendRequestss && !loading) {
      if (clickFriendRequestBoard) {
        setClickFriendRequestBoard(false);
      } else {
        setClickFriendRequestBoard(true);
      }
    }
  }, [friendRequestss]);

  const notiNumber = () => {
    if (friendRequestss && !loading) {
      const number = friendRequestss.data()?.friendRequests;
      // setFriendRequestsData(friendRequestss.data().friendRequests);

      return (
        <span className="rounded-full absolute top-[-8px] right-[-8px] font-medium bg-red-400 min-w-fit h-auto flex justify-center items-center w-5 text-[12px]">
          {number?.length}
        </span>
      );
    }
  };

  return (
    <div className="flex items-center justify-between p-2 shadow-md sticky top-0 bg-white z-10">
      <div className="flex justify-start items-center space-x-2 border">
        <div onClick={() => router.push("/")}>
          <Image
            src="https://www.transparentpng.com/thumb/facebook-logo-png/photo-facebook-logo-png-hd-25.png"
            width={50}
            height={50}
            layout="fixed"
            className="bg-transparent"
          />
        </div>
        <div className="flex min-w-fit rounded-full h-10 items-center bg-gray-100 p-2">
          <BeakerIcon className="h-6" />
          <form action="" className="hidden xl:inline-flex max-w-fit relative">
            <input
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
              type="text"
              placeholder="Search Facebook"
              className="hidden xl:inline-flex focus:outline-none w-40 md:w-60 bg-transparent ml-2 placeholder:text-sm flex-shink "
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
      <div className="hidden sm:inline-flex justify-start items-center pl-8 border grow">
        <div className="flex space-x-6 md:space-x-1">
          <HeaderIcon Icon={BeakerIcon} />
          <HeaderIcon Icon={BeakerIcon} />
          <HeaderIcon Icon={BeakerIcon} />
          <HeaderIcon Icon={BeakerIcon} />
          <HeaderIcon Icon={BeakerIcon} />
        </div>
      </div>
      <div className="flex justify-end space-x-4 ">
        <div
          onClick={onChangeClickState}
          className="icon relative overflow-visible"
        >
          {notiNumber()}
          <BeakerIcon className="h-6" />
          <FriendRequestBoard
            clickFriendRequestBoard={clickFriendRequestBoard}
            requestList={friendRequestss?.data()}
            onClickOutsideFRB={() => setClickFriendRequestBoard(false)}
          />
        </div>
        <div className="icon" onClick={handleClickShowChatbox}>
          <BeakerIcon className="h-6" />
        </div>
        <div className="icon" onClick={handleClickShowNoti}>
          <BeakerIcon className="h-6" />
          <NotiBoard
            showNoti={showNoti}
            onClickOutsideNB={() => setShowNoti("hidden")}
          />
        </div>
        <div
          className="flex items-center w-10 h-10 overflow-hidden rounded-full cursor-pointer"
          onClick={() => {
            signOut();
          }}
        >
          <Image
            src={Avatar}
            width={100}
            height={100}
            className="object-cover border "
            layout="fixed"
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
