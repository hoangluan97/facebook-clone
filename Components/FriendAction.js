import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { useSession } from "next-auth/react";

function FriendAction({ query }) {
  const session = useSession();
  const [friend, loading, error] = useDocument(doc(db, `users/${query}`));
  const [isFriend, setIsFriend] = useState("Bạn");

  useEffect(() => {
    if (friend && !loading) {
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

  if (isFriend === "Bạn") {
    return (
      <div
        onClick={deletelFriend}
        className="cursor-pointer border-2 rounded-md p-0.5 text-[14px] font-medium text-blue-600 bg-blue-200 min-w-fit max-h-fit h-[30px]"
      >
        Hủy kết bạn
      </div>
    );
  } else if (isFriend === "Chưa kết bạn") {
    return (
      <div
        onClick={sendFriendRequest}
        className="cursor-pointer border-2 rounded-md p-0.5 text-[14px] font-medium text-blue-600 bg-blue-200 max-w-fit min-h-fit h-[30px]"
      >
        <p>Thêm bạn</p>
      </div>
    );
  } else {
    return (
      <div
        onClick={cancelFriendRequest}
        className="cursor-pointer border-2 rounded-md p-0.5 text-[14px] font-medium text-blue-600 bg-blue-200 max-w-fit min-h-fit h-[30px]"
      >
        <p>Hủy lời mời</p>
      </div>
    );
  }
}

export default FriendAction;
