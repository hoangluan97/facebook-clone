import React, { useEffect, useRef } from "react";
import FriendRequestNoti from "./FriendRequestNoti";

function FriendRequestBoard({
  friendRequestRef,
  showFriendRequest,
  requestList,
  onClickOutsideFRB,
}) {
  const boardContent = requestList?.friendRequests.map((email) => (
    <FriendRequestNoti key={email} friendEmail={email} />
  ));

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !friendRequestRef.current.contains(event.target)
      ) {
        onClickOutsideFRB && onClickOutsideFRB();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutsideFRB]);

  return (
    <div
      ref={ref}
      className={
        "absolute shadow-md top-[78%] min-w-[200px] rounded-md min-h-[50px] right-48 z-10 flex flex-col justify-center items-center border-2 bg-white border-blue-400 " +
        showFriendRequest
      }
    >
      {requestList?.friendRequests.length ? (
        boardContent
      ) : (
        <>Không có lời lời kết bạn</>
      )}
    </div>
  );
}

export default FriendRequestBoard;

// after:content-[] after:absolute after:bottom-[100%] after:left-[50%] after:border-[5px] after:border-transparent after:border-b-black
