import React, { useEffect, useRef, useState } from "react";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../FirebaseConfig";
import { useSession } from "next-auth/react";
import Notitag from "./Notitag";

function NotiBoard({ showNoti, onClickOutsideNB, notiRef }) {
  const session = useSession();
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        // ref.current &&
        !ref.current.contains(event.target) &&
        !notiRef.current.contains(event.target)
      ) {
        onClickOutsideNB();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutsideNB]);

  const [notiData, loading, error] = useCollection(
    query(
      collection(db, `noti/posts/${session.data.user.email}`),
      orderBy("Time", "desc"),
      limit(10)
    )
  );

  const [notiState, setNotiState] = useState([]);

  useEffect(() => {
    if (notiData && !loading) {
      setNotiState(notiData.docs);
    }
  }, [notiData]);

  const notiDisplay = notiState.map((noti) => (
    <Notitag key={noti.id} noti={noti} />
  ));

  return (
    <div
      ref={ref}
      className={
        "absolute shadow-md right-20 top-[78%] rounded-md bg-white w-70 justify-start items-start  z-10 flex flex-col border-2 border-blue-400 space-y-3 py-2 px-1" +
        " " +
        showNoti
      }
    >
      <p className="font-medium">Thông báo</p>
      {notiState.length ? notiDisplay : <p>Không có thông báo nào</p>}
    </div>
  );
}

export default NotiBoard;
