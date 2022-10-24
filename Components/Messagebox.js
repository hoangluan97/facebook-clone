import { XCircleIcon } from "@heroicons/react/solid";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { db } from "../FirebaseConfig";
import Message from "./Message";

function Messagebox({ messageTo, showStatus, handleClickShowChatbox, name }) {
  const session = useSession();
  const [message, setMessage] = useState("");
  const [messageState, setMessageState] = useState([]);
  const [lastMes, setLastMes] = useState();
  const [newMessNum, setNewMessNum] = useState(0);
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
      read: false,
    });
    setMessage("");
  };

  useEffect(() => {
    let unreadMess = messageState.filter((va) => va.data().read == false);
    console.log(unreadMess);
    for (let x = 0; x < unreadMess.length; x++) {
      updateDoc(
        doc(
          db,
          `messages/${session.data.user.email}/${messageTo}/${unreadMess[x].id}`
        ),
        {
          read: true,
        }
      );
    }
  }, [messageState]);

  const fetchInit = async () => {
    const first = query(
      collection(db, `messages/${session.data.user.email}/${messageTo}`),
      orderBy("time", "desc"),
      limit(8)
    );
    const mess = await getDocs(first);
    setLastMes(mess.docs[mess.docs.length - 1]);
    setMessageState(mess.docs);
  };
  useEffect(() => {
    fetchInit();
  }, [messageTo]);
  onSnapshot(
    collection(db, `messages/${session.data.user.email}/${messageTo}`),
    (snapShot) => {
      snapShot.docChanges().forEach((change, index) => {
        if (
          index === snapShot.docChanges().length - 1 &&
          change.type == "added"
        ) {
          if (
            messageState.filter((value) => value.id == change.doc.id).length ===
            0
          ) {
            const newPosts = [change.doc, ...messageState];
            const sortPost = newPosts.sort((a, b) => {
              Number(b.data().time) - Number(a.data().time);
            });
            setMessageState(sortPost);
          }
        }
      });
    }
  );

  const fetchMoreMess = async (key) => {
    const lastKeyArr = false;
    const newBatchPosts = [];
    if (key) {
      const first = query(
        collection(db, `messages/${session.data.user.email}/${messageTo}`),
        orderBy("time", "desc"),
        startAfter(key),
        limit(3)
      );
      const mess = await getDocs(first);
      let clone = [...messageState, ...mess.docs];

      newBatchPosts = clone.filter(
        (value, index, arr) =>
          index == clone.findIndex((va) => va.id == value.id)
      );

      lastKeyArr = mess.docs[mess.docs.length - 1];
    }
    if (newBatchPosts.length) setMessageState(newBatchPosts);
    setLastMes(lastKeyArr);
  };

  const observer = useRef();
  const root = useRef(null);
  const lastMessElementRef = useCallback(
    (node) => {
      if (lastMes == false) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchMoreMess(lastMes);
          }
        },
        {
          root: root.current,
        }
      );
      if (node) observer.current.observe(node);
    },
    [messageState]
  );
  const messageShow = () => {
    const content = messageState.map((message, index) => {
      if (index === messageState.length - 1) {
        return (
          <div ref={lastMessElementRef} key={message.id}>
            <Message messageDoc={message.data()} />
          </div>
        );
      } else {
        return <Message messageDoc={message.data()} key={message.id} />;
      }
    });
    return content;
  };

  console.log(messageState.filter((va) => va.data().read == false).length);

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
        <div
          ref={root}
          className=" w-full px-2 h-full min-h-0 flex flex-col-reverse flex-1 overflow-y-auto"
        >
          {messageShow()}
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
