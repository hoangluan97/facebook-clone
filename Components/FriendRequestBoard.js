import React, { useEffect, useRef } from "react";
import FriendRequestNoti from "./FriendRequestNoti";

function FriendRequestBoard({
  clickFriendRequestBoard,
  requestList,
  onClickOutside,
}) {
  console.log(requestList);
  const boardContent = requestList?.friendRequests.map((email) => (
    <FriendRequestNoti friendEmail={email} />
  ));

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  let showState = "hidden";

  if (clickFriendRequestBoard) {
    showState = "block";
  } else {
    showState = "hidden";
  }

  return (
    <div
      ref={ref}
      className={
        "absolute top-[100%] min-w-fit right-6 z-10 flex flex-col justify-center items-center border-2 border-blue-400 " +
        showState
      }
    >
      {boardContent}
    </div>
  );
}

export default FriendRequestBoard;

// after:content-[] after:absolute after:bottom-[100%] after:left-[50%] after:border-[5px] after:border-transparent after:border-b-black
