import { BeakerIcon } from "@heroicons/react/solid";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { db } from "../FirebaseConfig";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";

function Messagebox({ messageTo, showStatus, handleClickShowChatbox }) {
  const session = useSession();
  const [message, setMessage] = useState("");
  const handleSendMessage = (e) => {
    e.preventDefault();
    addDoc(collection(db, `messages/${session.data.user.email}/${messageTo}`), {
      sentBy: session.data.user.email,
      message: message,
    });
    addDoc(collection(db, `messages/${messageTo}/${session.data.user.email}`), {
      sentBy: session.data.user.email,
      message: message,
    });
    setMessage("");
  };

  const [messageData, loading, error] = useCollection(
    collection(db, `messages/${session.data.user.email}/${messageTo}`)
  );
  const messageShow = () => {
    if (messageData && !loading) {
      const content = messageData?.docs?.map((message) => (
        <Message messageDoc={message.data()} key={message.id} />
      ));
      return content;
    }
  };

  return (
    <div
      className={
        "flex flex-col h-80 w-60 fixed bottom-0 right-5 border justify-around" +
        " " +
        showStatus
      }
    >
      <div className="flex justify-between items-center">
        <div>
          {/* <Image
            src={}
            width={35}
            height={35}
            layout="fixed"
            className="rounded-full"
          /> */}
          <p className="font-medium text-[14px]">ppppp</p>
        </div>
        <BeakerIcon onClick={handleClickShowChatbox} className="w-5" />
      </div>
      <div className="border w-full h-56 flex-1 bg-white flex">
        <div className="border w-full  min-h-0 flex flex-col flex-1 overflow-y-auto">
          {messageShow()}
        </div>
      </div>
      <div className="flex justify-center">
        <form action="">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Gửi</button>
        </form>
      </div>
    </div>
  );
}

export default Messagebox;
