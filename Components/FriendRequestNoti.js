import React, { useEffect } from "react";
import Image from "next/image";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "../FirebaseConfig";
import { useSession } from "next-auth/react";

function FriendRequestNoti({ friendEmail }) {
  const session = useSession();
  console.log(friendEmail);
  const [friendProfile, loading, error] = useDocument(
    doc(db, `users/${friendEmail}`)
  );

  const handleConfirm = () => {
    updateDoc(doc(db, `users/${session.data.user.email}`), {
      friendRequests: arrayRemove(friendEmail),
      friends: arrayUnion(friendEmail),
    });
    updateDoc(doc(db, `users/${friendEmail}`), {
      friendRequestSent: arrayRemove(session.data.user.email),
      friends: arrayUnion(session.data.user.email),
    });
  };

  const handleDeny = () => {
    updateDoc(doc(db, `users/${session.data.user.email}`), {
      friendRequests: arrayRemove(friendEmail),
    });
    updateDoc(doc(db, `users/${friendEmail}`), {
      friendRequestSent: arrayRemove(friendEmail),
    });
  };

  if (friendProfile && !loading) {
    return (
      <div className="flex min-w-fit w-56 items-center space-x-4 bg-white p-2">
        <div>
          <Image
            src={friendProfile.data().userProfileData.userAvatar}
            width={30}
            height={30}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col items-start space-y-2">
          <p>{friendProfile.data().userProfileData.userName}</p>
          <div className="flex space-x-4">
            <button
              onClick={handleConfirm}
              className="text-[14px] w-[76px] bg-blue-500 p-1 rounded-sm font-medium"
            >
              Xác nhận
            </button>
            <button
              onClick={handleDeny}
              className="text-[14px] w-[76px] bg-blue-500 p-1 rounded-sm font-medium"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default FriendRequestNoti;
