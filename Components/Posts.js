import React, { useEffect, useState } from "react";
import SinglePost from "./SinglePost";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { useSession } from "next-auth/react";

function Posts() {
  const session = useSession();
  const [postData, loading, error] = useCollection(
    collection(db, `users/${session.data.user.email}/posts`)
  );
  const [friendsList] = useDocument(
    doc(db, `users/${session.data.user.email}`)
  );

  const [postList, setPostList] = useState([]);

  useEffect(() => {
    async function getFriendPost() {
      if (friendsList && postData?.docs && !loading && !postData.empty) {
        let postClone = postData.docs;
        if (friendsList.data().friends) {
          for (const friend of friendsList.data().friends) {
            let friendPostData = await getDocs(
              collection(db, `users/${friend}/posts`)
            );
            console.log(postClone[0]);
            friendPostData.forEach((doc) => {
              postClone.push(doc);
            });
          }
        }
        setPostList(postClone);
      }
    }
    (async () => await getFriendPost())();
  }, [postData]);

  const postListSorting = postList.sort(
    (postA, postB) => Number(postB.data().time) - Number(postA.data().time)
  );

  const postDisplay = postListSorting.map((post) => (
    <SinglePost
      key={post.id}
      postOwner={post.data().postOwner}
      postId={post.id}
      name={post.data().name}
      avt={post.data().avt}
      postContent={post.data().postContent}
      postImgSrc={post.data().postImgSrc}
      timestamp={post.data().time}
    />
  ));

  return (
    <div className="w-full space-y-4">
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {postDisplay}
    </div>
  );
}

export default Posts;
