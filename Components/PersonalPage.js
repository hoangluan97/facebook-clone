import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import cat from "../image/cat.jpg";
import { useSession } from "next-auth/react";
import Profile from "./Profile";
import PersonalPosts from "./PersonalPosts";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { collection, doc, getDoc, orderBy, query } from "firebase/firestore";
import { db } from "../FirebaseConfig";

function PersonalPage() {
  const pageOwner = useRouter();
  const { Person } = pageOwner.query;
  const session = useSession();
  const [userData, setUserData] = useState({ userAvatar: "", userName: "" });
  useEffect(() => {
    const getData = async () => {
      let data = await getDoc(doc(db, `users/${Person}`));
      setUserData(data.data().userProfileData);
    };
    getData();
  }, []);
  const [posts, loading] = useCollection(
    query(collection(db, `users/${Person}/posts`), orderBy("time", "desc"))
  );
  const [postsData, setPostsData] = useState([]);
  useEffect(() => {
    if (posts && !loading) {
      setPostsData(posts.docs);
    }
  }, [posts]);
  return (
    <div className="flex flex-col justify-start items-center w-full h-full min-h-fit">
      <div className="shadow-md w-full flex flex-col items-center justify-around relative max-h-fit h-[250px] bg-gradient-to-b from-indigo-200 via-purple-200 to-white">
        <div>
          {userData.userAvatar && (
            <Image
              src={userData.userAvatar}
              width={150}
              height={150}
              layout="fixed"
              className="rounded-full"
            />
          )}
        </div>
        <h2 className="text-black mt-5 font-bold text-[30px]">
          {userData.userName}
        </h2>
      </div>
      <div className="mt-5 flex justify-center flex-col w-full md:w-[80%] sm:flex-row sm:space-x-3 items-center sm:items-start sm:space-y-0 space-y-3">
        <Profile Owner={Person} />
        <PersonalPosts data={postsData} />
      </div>
    </div>
  );
}

export default PersonalPage;
