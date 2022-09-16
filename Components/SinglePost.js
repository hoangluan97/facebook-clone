import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  AnnotationIcon,
  ShareIcon,
  ThumbUpIcon as ThumUpIconSolid,
} from "@heroicons/react/solid";
import {
  DotsHorizontalIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from "@heroicons/react/outline";

import {
  doc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
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
  const [deleteButtonStatus, setDeleteButtonStatus] = useState("hidden");
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
3
  const deleteButtonRef = useRef(null);

  const onClickOutsideFRB = () => {
    setDeleteButtonStatus("hidden");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        deleteButtonRef.current &&
        !deleteButtonRef.current.contains(event.target)
        // &&
        // !friendRequestRef.current.contains(event.target)
      ) {
        onClickOutsideFRB && onClickOutsideFRB();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutsideFRB]);

  useEffect(() => {
    if (likedBy && !loading && Boolean(likedBy?.data())) {
      setLikeData(likedBy?.data().likedBy);
      setLocalLike(likedBy?.data().likedBy.length);
    }
  }, [likedBy]);

  const submitComment = (e) => {
    e.preventDefault();
    const Timestamp = new Date();
    if (comment && Timestamp) {
      addDoc(collection(db, `users/${postOwner}/posts/${postId}/comments`), {
        commentUserName: session.data.user.name,
        commentUserImg: session.data.user.image,
        commentUserEmail: session.data.user.email,
        commentContent: comment,
        commentTime: Timestamp,
      });
      if (!(postOwner == session.data.user.email)) {
        setDoc(
          doc(
            db,
            "noti",
            "posts",
            postOwner,
            postId + session.data.user.email + "comment" + Number(Timestamp)
          ),
          {
            Email: session.data.user.email,
            Img: session.data.user.image,
            Name: session.data.user.name,
            Time: Timestamp,
            actionType: " đã bình luận về bài viết của bạn",
            post: postId,
            postOwner: postOwner,
          }
        );
      }
      setComment("");
    }
  };

  const handleLikeButton = async () => {
    if (!likeData.includes(session.data.user.email)) {
      let cloneLikeArray = likeData;
      cloneLikeArray.push(session.data.user.email);
      await updateDoc(doc(db, `users/${postOwner}/posts/${postId}`), {
        likedBy: cloneLikeArray,
      });
      if (!(postOwner == session.data.user.email)) {
        await setDoc(
          doc(
            db,
            "noti",
            "posts",
            postOwner,
            postId + session.data.user.email + "liked"
          ),
          {
            Email: session.data.user.email,
            Img: session.data.user.image,
            Name: session.data.user.name,
            Time: serverTimestamp(),
            actionType: " đã thích bài viết của bạn",
            post: postId,
            postOwner: postOwner,
          }
        );
      }
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
      await deleteDoc(
        doc(
          db,
          "noti",
          "posts",
          postOwner,
          postId + session.data.user.email + "liked"
        )
      );
      setLikeData(cloneLikeArray);
    }
  };

  const deleleButtonOnclick = () => {
    if (deleteButtonStatus) {
      setDeleteButtonStatus("");
    } else {
      setDeleteButtonStatus("hidden");
    }
  };

  const deletePost = () => {
    deleteDoc(doc(db, `users/${postOwner}/posts/${postId}`));
    for (let comment of commentData.docs) {
      deleteDoc(
        doc(db, `users/${postOwner}/posts/${postId}/comments/${comment.id}`)
      );
    }
  };

  const deleteButton = () => {
    if (postOwner == session.data.user.email) {
      return (
        <div className="absolute right-3 top-2">
          <div className="relative">
            <DotsHorizontalIcon
              onClick={deleleButtonOnclick}
              className="w-5 cursor-pointer"
            />
            <span
              ref={deleteButtonRef}
              onClick={deletePost}
              className={
                "absolute text-[13px] bg-gray-200 border bottom-[-16px] rounded-md right-[-1px] cursor-pointer" +
                " " +
                deleteButtonStatus
              }
            >
              Xóa
            </span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-white w-full rounded-md flex flex-col items-center shadow-sm relative">
      {deleteButton()}
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
        <p className="leading-tight font-normal text-[17px] text-left px-3">
          {postContent}
        </p>
      </div>
      {postImgSrc && (
        <div className="px-12 w-full border my-4 block relative h-80 min-h-fit">
          <Image
            src={postImgSrc}
            layout="fill"
            objectFit="contain"
            className="w-full h-full"
          />
        </div>
      )}
      <div className="w-full flex justify-start px-10 font-medium space-x-0.5 mt-3">
        <ThumbUpIcon className="w-[16px]" />
        <p>{localLike}</p>
      </div>
      <div className="p-1 w-full flex flex-col justify-between space-y-1">
        <div className="w-[100%] h-[1px] bg-gray-300"></div>

        <div className="flex justify-between">
          <div
            onClick={handleLikeButton}
            className="cursor-pointer flex w-1/3 justify-center space-x-4 hover:bg-gray-300/50 h-8 items-center rounded-md"
          >
            {likeData.includes(session.data.user.email) ? (
              <ThumUpIconSolid className="h-6" />
            ) : (
              <ThumbUpIcon className="h-6" />
            )}
            <p className="text-[14px] text-gray-600 font-medium">Thích</p>
          </div>
          <div className="cursor-pointer flex w-1/3 justify-center space-x-4 hover:bg-gray-300/50 h-8 items-center pl-4 rounded-md">
            <AnnotationIcon className="h-6" />
            <p className="text-[14px] text-gray-600 font-medium">Bình luận</p>
          </div>
          <div className="cursor-pointer flex w-1/3 justify-center space-x-4 hover:bg-gray-300/50 h-8 items-center pl-4 rounded-md">
            <ShareIcon className="h-6" />
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
              commentTime={data.data().commentTime}
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
              className="bg-blue-400 p-1 rounded-lg text-[13px] font-medium"
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
