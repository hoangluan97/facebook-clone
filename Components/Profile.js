import { PencilAltIcon } from "@heroicons/react/solid";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "../FirebaseConfig";
import FriendAction from "./FriendAction";
function Profile({ Owner }) {
  const session = useSession();
  const isOwner = session.data.user.email == Owner ? true : false;
  const [editMode, setEditMode] = useState(false);
  const [userInfor, loading] = useDocument(doc(db, `users/${Owner}`));
  const [userProfile, setUserProfile] = useState({
    birth: "",
    nation: "",
    gender: "",
  });

  useEffect(() => {
    if (userInfor && !loading) {
      setUserProfile(userInfor.data().userProfile);
    }
  }, [userInfor]);
  return (
    <div className="max-h-fit h-[200px] min-w-fit bg-white rounded-lg text-[16px] p-5 shadow-md w-[100%] sm:w-[300px] pb-5 flex justify-between">
      <div className="flex flex-col h-full justify-between">
        <div className="flex justify-between">
          <h2 className="font-medium text-[20px]">Giới thiệu</h2>
        </div>
        <div className="flex space-x-2">
          <p>Ngày sinh:</p>
          {!editMode ? (
            <p>{userProfile.birth}</p>
          ) : (
            <form action="">
              <input
                className="border-2 rounded-sm border-blue-400"
                type="date"
                name=""
                onChange={(e) => {
                  setUserProfile((prev) => ({
                    ...prev,
                    birth: e.target.value,
                  }));
                }}
                id=""
                defaultValue={userProfile.birth}
              />
            </form>
          )}
        </div>
        <div className="flex space-x-2">
          <p>Quốc gia:</p>
          {!editMode ? (
            <p>{userProfile.nation}</p>
          ) : (
            <form action="">
              <input
                className="border-2 rounded-sm border-blue-400"
                type="text"
                name="nation"
                id="nation"
                value={userProfile.nation}
                onChange={(e) =>
                  setUserProfile((prev) => ({
                    ...prev,
                    nation: e.target.value,
                  }))
                }
              />
            </form>
          )}
        </div>
        <div className="flex space-x-2">
          <p>Giới tính:</p>
          {!editMode ? (
            <p>{userProfile.gender}</p>
          ) : (
            <form action="">
              <input
                className="border-2 rounded-sm border-blue-400"
                type="text"
                name="gender"
                id="gender"
                value={userProfile.gender}
                onChange={(e) =>
                  setUserProfile((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
              />
            </form>
          )}
        </div>
      </div>
      {!isOwner && <FriendAction query={Owner} />}
      {isOwner && !editMode && (
        <div className="h-full flex flex-col items-start">
          <PencilAltIcon
            onClick={() => setEditMode((prev) => !prev)}
            className="w-5 cursor-pointer"
          />
          {editMode && <p className="border-2 p-1 rounded-sm">Lưu</p>}
        </div>
      )}
      {editMode && (
        <p
          className="border-2 rounded-sm h-[30px] border-black px-1 cursor-pointer"
          onClick={() => {
            updateDoc(doc(db, `users/${Owner}`), {
              userProfile: userProfile,
            });
            setEditMode((prev) => !prev);
          }}
        >
          Lưu
        </p>
      )}
    </div>
  );
}

export default Profile;
