import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { useSession } from "next-auth/react";

function FriendSearchResult() {
  const session = useSession();
  const SearchInput = useRouter();
  const { FriendResult } = SearchInput.query;
  console.log(FriendResult);
  const [friend, loading, error] = useDocument(
    doc(db, `users/${FriendResult}`)
  );
  const [isFriend, setIsFriend] = useState("Bạn");

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

  const cancelFriendRequest = () => {
    updateDoc(doc(db, `users/${friend.data()?.userProfileData.userEmail}`), {
      friendRequests: arrayRemove(`${session.data.user.email}`),
    });
    updateDoc(doc(db, `users/${session.data.user.email}`), {
      friendRequestSent: arrayRemove(
        `${friend.data()?.userProfileData.userEmail}`
      ),
    });
  };

  const deletelFriend = () => {
    updateDoc(doc(db, `users/${friend.data()?.userProfileData.userEmail}`), {
      friends: arrayRemove(`${session.data.user.email}`),
    });
    updateDoc(doc(db, `users/${session.data.user.email}`), {
      friends: arrayRemove(`${friend.data()?.userProfileData.userEmail}`),
    });
  };

  const friendStatusIcon = () => {
    if (isFriend === "Bạn") {
      return (
        <div
          onClick={deletelFriend}
          className="flex space-x-1 items-end border-2 rounded-md p-0.5 text-[14px] font-medium text-blue-600 bg-blue-200"
        >
          Hủy kết bạn
        </div>
      );
    } else if (isFriend === "Chưa kết bạn") {
      return (
        <div
          onClick={sendFriendRequest}
          className="flex space-x-1 items-end border-2 rounded-md p-0.5 text-[14px] font-medium text-blue-600 bg-blue-200"
        >
          <p>Thêm bạn</p>
        </div>
      );
    } else {
      return (
        <div
          onClick={cancelFriendRequest}
          className="flex space-x-1 items-center border-2 rounded-md p-0.5 text-[14px] font-medium text-blue-600 bg-blue-200"
        >
          <p>Hủy lời mời</p>
        </div>
      );
    }
  };

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
            <p>{friend.data()?.userProfileData.userName}</p>
          </div>
          <div className="hover:cursor-pointer">{friendStatusIcon()}</div>
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
