import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "../FirebaseConfig";
import { useSession } from "next-auth/react";

function NotiBoard({ showNoti, onClickOutsideNB }) {
  const session = useSession();
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutsideNB && onClickOutsideNB();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutsideNB]);

  return (
    <div
      ref={ref}
      className={
        "absolute bg-white top-[100%] w-80 justify-start items-start right-6 z-10 flex flex-col border-2 border-blue-400 space-y-3 py-2 px-1" +
        " " +
        showNoti
      }
    >
      <p className="font-medium">Thông báo</p>
      <div className="flex space-x-2 justify-start w-90% items-center">
        <div>
          <Image
            src={session.data.user.image}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-[14px] text-justify">
            <span>{session.data.user.name}</span> đã loại bài viết của bạn
            aaaaaa aaaa aaaaa aaaa aaaa aaaaa aaaaaa aaaaa
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotiBoard;
