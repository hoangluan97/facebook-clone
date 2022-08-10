import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { addDoc, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { BeakerIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";

function FriendSearchResult() {
  const session = useSession();
  const SearchInput = useRouter();
  const { FriendResult } = SearchInput.query;
  const [friend, loading, error] = useDocument(
    doc(db, `users/${FriendResult}`)
  );
  const [isFriend, setIsFriend] = useState("Bạn");
  // console.log(friend.data());
  // const [friendState, setFriendState] = useState("");

  useEffect(() => {
    if (friend && !loading) {
      // setFriendState(friend.data());
      if (!friend.data()?.friends.includes(session.data.user.email)) {
        if (!friend.data()?.friendRequests.includes(session.data.user.email)) {
          setIsFriend("Chưa kết bạn");
        } else {
          setIsFriend("Đã gửi yêu cầu");
        }
      }
    }
  }, [friend]);

  const sendFriendRequest = () => {
    updateDoc(doc(db, `users/${friend.data()?.userProfileData.userEmail}`), {
      friendRequests: arrayUnion(`${session.data.user.email}`),
    });
    updateDoc(doc(db, `users/${session.data.user.email}`), {
      friendRequestSent: arrayUnion(
        `${friend.data()?.userProfileData.userEmail}`
      ),
    });
  };

  const friendStatusIcon = () => {
    if (isFriend === "Bạn") {
      return <BeakerIcon className="w-7 bg-blue-400" />;
    } else if (isFriend === "Chưa kết bạn") {
      return <BeakerIcon className="w-7 bg-red-400" />;
    } else {
      return <BeakerIcon className="w-7 bg-green-400" />;
    }
  };

  const FriendsContent = () => {
    if (
      friend &&
      !loading &&
      friend.data()?.userEmail !== session.data.user.email
    ) {
      console.log(friend.data()?.userProfileData.userAvatar);
      return (
        <div className="flex mt-10 rounded-lg shadow-md h-20 w-[300px] min-w-fit bg-white items-center justify-between px-5">
          <div className="flex max-w-fit space-x-4 items-center">
            <Image
              src={friend.data()?.userProfileData.userAvatar}
              width={30}
              height={30}
              className="rounded-full"
            />
            <p>{friend.data()?.userProfileData.userName}</p>
          </div>
          <div className="hover:cursor-pointer" onClick={sendFriendRequest}>
            {friendStatusIcon()}
          </div>
        </div>
      );
    } else {
      return <p>Không tìm thấy</p>;
    }
  };
  return (
    <div className="flex bg-gray-100 w-full grow justify-center">
      {FriendsContent()}
    </div>
  );
}

export default FriendSearchResult;
