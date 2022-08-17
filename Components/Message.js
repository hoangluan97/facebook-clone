import { useSession } from "next-auth/react";
import React from "react";

function Message({ messageDoc }) {
  const session = useSession();
  let position = "justify-start";
  let color = " bg-gray-300";
  if (session.data.user.email === messageDoc.sentBy) {
    position = "justify-end";
    color = "bg-blue-300";
  }

  return (
    <div className={`w-full p-1 flex` + " " + position}>
      <p
        className={
          "max-w-fit p-1 text-[15px] font-normal rounded-md" + " " + color
        }
      >
        {messageDoc.message}
      </p>
    </div>
  );
}

export default Message;
