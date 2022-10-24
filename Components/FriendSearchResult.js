import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { useSession } from "next-auth/react";
import FriendAction from "./FriendAction";

function FriendSearchResult() {
  const session = useSession();
  const SearchInput = useRouter();
  const { FriendResult } = SearchInput.query;
  const [friend, loading, error] = useDocument(
    doc(db, `users/${FriendResult}`)
  );

  const FriendsContent = () => {
    if (
      friend?.data() &&
      !loading &&
      friend.data()?.userEmail !== session.data.user.email
    ) {
      return (
        <div className="flex mt-10 rounded-lg shadow-md h-20 w-[400px] min-w-fit bg-white items-center justify-between px-2">
          <div className="flex max-w-fit space-x-4 items-center">
            <Image
              src={friend.data()?.userProfileData.userAvatar}
              width={30}
              height={30}
              className="rounded-full"
            />
            <p
              className="cursor-pointer"
              onClick={() => SearchInput.push(`/PersonalPage/${FriendResult}`)}
            >
              {friend.data()?.userProfileData.userName}
            </p>
          </div>
          <div className="hover:cursor-pointer">
            <FriendAction query={FriendResult} />
          </div>
        </div>
      );
    } else {
      return (
        <p className="mt-10 text-[20px] font-medium">Không tìm thấy kết quả</p>
      );
    }
  };
  return (
    <div className="flex bg-gray-100 w-full grow justify-center">
      {FriendsContent()}
    </div>
  );
}

export default FriendSearchResult;
