import React, { useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import InputIcon from "./InputIcon";
import {
  PhotographIcon,
  TagIcon,
  VideoCameraIcon,
  XIcon,
} from "@heroicons/react/solid";
import { db } from "../FirebaseConfig";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { storage } from "../FirebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function PostInput() {
  const session = useSession();
  const imgInputref = useRef(null);
  const [imageToPost, setImageToPost] = useState("");
  const [imageToStore, setImageToStore] = useState("");
  const [postContent, setPostContent] = useState("");

  const sendPost = (e) => {
    // console.log(imageToPost);
    e.preventDefault();

    if (imageToStore) {
      const postimageRef = ref(
        storage,
        `images/${session.data.user.email}/${imageToStore}`
      );
      const uploadTask = uploadBytesResumable(postimageRef, imageToStore);

      uploadTask.on(
        "state_changed",
        null,
        (error) => console.error(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            addDoc(collection(db, `users/${session.data.user.email}/posts`), {
              name: session.data.user.name,
              avt: session.data.user.image,
              postContent: postContent,
              postOwner: session.data.user.email,
              time: new Date(),
              likedBy: [],
              postImgSrc: downloadURL,
            });
          });
        }
      );
    } else {
      addDoc(collection(db, `users/${session.data.user.email}/posts`), {
        name: session.data.user.name,
        avt: session.data.user.image,
        postContent: postContent,
        postOwner: session.data.user.email,
        time: new Date(),
        likedBy: [],
      });
    }
    setPostContent("");
    setImageToPost("");
    setImageToStore("");
  };

  const removeImg = () => {
    setImageToPost("");
    setImageToStore("");
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
    }
    reader.onload = (readerEvent) => {
      setImageToPost(readerEvent.target.result);
      setImageToStore(e.target.files[0]);
    };
  };

  return (
    <div className="w-full flex flex-col items-center space-y-2 bg-white p-2 rounded-xl shadow-md">
      <div className="w-full flex space-x-2 p-3 items-center">
        <div>
          <Image
            src={session.data.user.image}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <form action="" className="grow flex space-x-2 items-center">
          <input
            className="focus:outline-none bg-gray-200 h-9 rounded-full px-4 placeholder:text-black grow"
            type="text"
            placeholder={session.data.user.name + " ??i, b???n ??ang ngh?? g?? th????"}
            onChange={(e) => setPostContent(e.target.value)}
            value={postContent}
          />
          <button
            type="submit"
            className="border-2 bg-blue-400 rounded-lg h-8 shadow-md p-2 flex items-center text-[14px] font-medium"
            onClick={(e) => sendPost(e)}
          >
            ????ng
          </button>
        </form>
      </div>
      {imageToPost && (
        <div className="px-12 w-full border my-4 block relative h-80">
          <XIcon
            onClick={removeImg}
            className="absolute top-1 right-4 z-10 w-[15px] h-[15px] hover:cursor-pointer"
          />
          <Image
            src={imageToPost}
            layout="fill"
            objectFit="contain"
            className="w-full h-full"
          />
        </div>
      )}
      <div className="w-[90%] h-[1px] bg-gray-300"></div>
      <div className="flex w-full justify-around">
        <InputIcon Icon={VideoCameraIcon} title="Video tr???c ti???p" />
        <div onClick={() => imgInputref.current.click()}>
          <InputIcon Icon={PhotographIcon} title="???nh/video" />
          <input
            hidden
            ref={imgInputref}
            type="file"
            id="myfile"
            name="myfile"
            onChange={addImageToPost}
          />
        </div>
        <InputIcon Icon={TagIcon} title="C???m x??c/ho???t ?????ng" />
      </div>
    </div>
  );
}

export default PostInput;
