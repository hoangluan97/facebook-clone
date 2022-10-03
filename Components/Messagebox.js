import { XCircleIcon } from "@heroicons/react/solid";
import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../FirebaseConfig";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";

function Messagebox({ messageTo, showStatus, handleClickShowChatbox, name }) {
  const session = useSession();
  const messageRef = useRef(null);
  const [message, setMessage] = useState("");
  const handleSendMessage = (e) => {
    e.preventDefault();
    addDoc(collection(db, `messages/${session.data.user.email}/${messageTo}`), {
      sentBy: session.data.user.email,
      message: message,
      time: serverTimestamp(),
    });
    addDoc(collection(db, `messages/${messageTo}/${session.data.user.email}`), {
      sentBy: session.data.user.email,
      message: message,
      time: serverTimestamp(),
    });
    setMessage("");
  };

  const [messageData, loading, error] = useCollection(
    query(
      collection(db, `messages/${session.data.user.email}/${messageTo}`),
      orderBy("time")
    )
  );

  const messageShow = () => {
    if (messageData && !loading) {
      const content = messageData?.docs.map((message) => (
        <Message messageDoc={message.data()} key={message.id} />
      ));
      return content;
    }
  };

  useEffect(() => {
    messageRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messageShow]);

  return (
    <div
      className={
        "flex flex-col h-80 w-64 fixed bottom-0 right-5 border justify-around rounded-t-md" +
        " " +
        showStatus
      }
    >
      <div className="flex justify-between items-center h-8 rounded-t-md bg-blue-400 px-2">
        <div>
          <p className="font-medium text-[14px]">{name}</p>
        </div>
        <XCircleIcon
          onClick={handleClickShowChatbox}
          className="w-5 cursor-pointer"
        />
      </div>
      <div className="border-y-2 w-full h-52 flex-1 bg-white flex">
        <div className=" w-full px-2 h-full min-h-0 flex flex-col flex-1 overflow-y-auto">
          {messageShow()}
          <div ref={messageRef} />
        </div>
      </div>
      <div className="flex justify-center w-full">
        <form action="" className="w-full">
          <input
            className="focus:outline-none px-2 py-1 font-normal w-full text-[14px]"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage} className="hidden" type="submit">
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
}

export default Messagebox;
