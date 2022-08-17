import React from "react";
import Image from "next/image";

function Notitag({ noti }) {
  const timeNow = new Date();
  const notiTime = new Date(noti.data().Time.toDate());
  const timeDiff = timeNow.getTime() - notiTime.getTime();
  let timeDisplay = "";
  if (timeDiff < 60 * 1000) {
    timeDisplay = "Vừa mới";
  } else if (60 * 1000 <= timeDiff && timeDiff < 60 * 60 * 1000) {
    timeDisplay = Math.floor(timeDiff / (1000 * 60)) + " phút";
  } else if (60 * 60 * 1000 <= timeDiff && timeDiff < 24 * 60 * 60 * 1000) {
    timeDisplay = Math.floor(timeDiff / (1000 * 60 * 60)) + " giờ";
  } else if (24 * 60 * 60 * 1000 <= timeDiff) {
    timeDisplay = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + " ngày";
  }
  console.log(timeDiff);
  return (
    <div className="flex space-x-2 justify-start w-90% items-center">
      <div>
        <Image
          src={noti.data().Img}
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <p className="text-[14px] text-justify grow">
          <span>{noti.data().Name}</span> {noti.data().actionType}
        </p>
        <div className="flex w-full justify-start text-[12px]">
          <p>{timeDisplay}</p>
        </div>
      </div>
    </div>
  );
}

export default Notitag;
