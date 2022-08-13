import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import image from "../images/Capture.PNG";
import { BeakerIcon } from "@heroicons/react/solid";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../FirebaseConfig";
import {
  doc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";
import Comment from "./Comment";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { async } from "@firebase/util";

function SinglePost({
  name,
  avt,
  postContent,
  postImgSrc,
  timestamp,
  postId,
  postOwner,
}) {
  const session = useSession();
  const [commentData] = useCollection(
    collection(db, `users/${postOwner}/posts/${postId}/comments`)
  );
  const [likedBy, loading, error] = useDocument(
    doc(db, `users/${postOwner}/posts/${postId}`)
  );
  const time = new Date(timestamp && timestamp.toDate()).toLocaleString();
  const [comment, setComment] = useState("");
  const [likeData, setLikeData] = useState([]);
  const [localLike, setLocalLike] = useState("");

  useEffect(() => {
    if (likedBy && !loading) {
      setLikeData(likedBy.data().likedBy);
      setLocalLike(likedBy.data().likedBy.length);
    }
  }, [likedBy]);
  const submitComment = (e) => {
    e.preventDefault();
    if (comment) {
      addDoc(collection(db, `users/${postOwner}/posts/${postId}/comments`), {
        commentUserName: session.data.user.name,
        commentUserImg: session.data.user.image,
        commentContent: comment,
        commentTime: serverTimestamp(),
      });
      setComment("");
    }
  };

  const handleLikeButton = async () => {
    if (!likeData.includes(session.data.user.email)) {
      let cloneLikeArray = likeData;
      cloneLikeArray.push(session.data.user.email);
      console.log(cloneLikeArray);
      await updateDoc(doc(db, `users/${postOwner}/posts/${postId}`), {
        likedBy: cloneLikeArray,
      });
      setLikeData(cloneLikeArray);
    } else {
      let cloneLikeArray = likeData;
      const userPosition = cloneLikeArray.findIndex(
        (user) => user == session.data.user.email
      );
      cloneLikeArray.splice(userPosition, 1);
      await updateDoc(doc(db, `users/${postOwner}/posts/${postId}`), {
        likedBy: cloneLikeArray,
      });
      console.log(cloneLikeArray);
      setLikeData(cloneLikeArray);
    }
  };

  return (
    <div className="bg-white w-full rounded-md flex flex-col items-center shadow-sm">
      <div className="flex p-4 space-x-2 w-full items-center">
        <Image
          src={avt}
          width={40}
          height={40}
          layout="fixed"
          className="rounded-full"
        />
        <div className="flex flex-col justify-start">
          <p className="font-medium">{name}</p>
          <p className="text-[11px]">{time}</p>
        </div>
      </div>
      <div className="px-4 flex flex-col justify-start w-full items-start">
        <p className="leading-tight font-normal text-[14px] text-left">
          {postContent}
        </p>
      </div>
      {postImgSrc && (
        <div className="px-12 w-full border my-4 block relative max-h-fit">
          <Image
            src={postImgSrc}
            layout="responsive"
            width={200}
            height={200}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="w-full flex justify-start px-10 font-medium space-x-2">
        <BeakerIcon className="w-[20px]" />
        <p>{localLike}</p>
      </div>
      <div className="p-4 w-full flex flex-col justify-between space-y-1">
        <div className="w-[100%] h-[1px] bg-gray-300"></div>

        <div className="flex justify-between">
          <div
            onClick={handleLikeButton}
            className="cursor-pointer flex w-1/3 justify-center space-x-4 hover:bg-gray-300/50 h-8 items-center rounded-md"
          >
            <BeakerIcon className="h-6" />
            <p className="text-[14px] text-gray-600 font-medium">Thích</p>
          </div>
          <div className="cursor-pointer flex w-1/3 justify-center space-x-4 hover:bg-gray-300/50 h-8 items-center pl-4 rounded-md">
            <BeakerIcon className="h-6" />
            <p className="text-[14px] text-gray-600 font-medium">Bình luận</p>
          </div>
          <div className="cursor-pointer flex w-1/3 justify-center space-x-4 hover:bg-gray-300/50 h-8 items-center pl-4 rounded-md">
            <BeakerIcon className="h-6" />
            <p className="text-[14px] text-gray-600 font-medium">Chia sẻ</p>
          </div>
        </div>
        <div className="w-[100%] h-[1px] bg-gray-300"></div>
      </div>

      <div className="flex flex-col w-full p-4 space-y-2">
        {commentData &&
          commentData.docs.map((data) => (
            <Comment
              key={data.id}
              imgSrc={data.data().commentUserImg}
              name={data.data().commentUserName}
              content={data.data().commentContent}
            />
          ))}
        <div className="flex w-full  space-x-2 justify-center items-center">
          <div className="">
            <Image
              src={session.data.user.image}
              width={30}
              height={30}
              layout="fixed"
              className="rounded-full"
            />
          </div>
          <form action="" className="grow flex space-x-2 items-center">
            <input
              type="text"
              placeholder="Viết bình luận..."
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              className="border grow h-8 rounded-full bg-gray-100 focus:outline-none p-2"
            />
            <button
              onClick={(e) => submitComment(e)}
              type="submit"
              className="bg-blue-300 p-1 rounded-lg text-[13px] font-medium"
            >
              Bình luận
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SinglePost;
