import React, { useEffect, useState, useRef, useCallback } from "react";
import SinglePost from "./SinglePost";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { useSession } from "next-auth/react";

function Posts() {
  const session = useSession();
  const [friendsList] = useDocument(
    doc(db, `users/${session.data.user.email}`)
  );

  const [postList, setPostList] = useState([]);
  const [lastKey, setLastKey] = useState([]);

  const fetchInit = async () => {
    const first = query(
      collection(db, `users/${session.data.user.email}/posts`),
      orderBy("time", "desc"),
      limit(2)
    );
    const userData = await getDocs(first);
    setLastKey([userData.docs[userData.docs.length - 1]]);
    if (friendsList) {
      let postClone = [...userData.docs];
      if (friendsList.data().friends) {
        for (const friend of friendsList.data().friends) {
          let friendQuery = query(
            collection(db, `users/${friend}/posts`),
            orderBy("time", "desc"),
            limit(2)
          );
          let friendPostData = await getDocs(friendQuery);

          friendPostData.forEach((doc) => {
            postClone.push(doc);
          });
          setLastKey((prev) => [
            ...prev,
            friendPostData.docs[friendPostData.docs.length - 1],
          ]);
        }
        const postListSorting = postClone.sort(
          (postA, postB) =>
            Number(postB.data().time) - Number(postA.data().time)
        );
        setPostList(postListSorting);
      }
    }
  };
  onSnapshot(
    collection(db, `users/${session.data.user.email}/posts`),
    (snapShot) => {
      snapShot.docChanges().forEach((change, index) => {
        if (
          index === snapShot.docChanges().length - 1 &&
          change.type == "added"
        ) {
          if (
            postList.filter((value) => value.id == change.doc.id).length === 0
          ) {
            const newPosts = [change.doc, ...postList];
            const sortPost = newPosts.sort((a, b) => {
              Number(b.data().time) - Number(a.data().time);
            });
            setPostList(sortPost);
          }
        } else if (change.type == "removed") {
          const post = postList.filter((post) => post.id != change.doc.id);
          setPostList(post);
        }
      });
    }
  );

  useEffect(() => {
    fetchInit();
  }, [friendsList]);

  const fetchMorePosts = async (key) => {
    const lastKeyArr = Array(key.length).fill(false);
    const newBatchPosts = [];
    if (key[0]) {
      const first = query(
        collection(db, `users/${session.data.user.email}/posts`),
        orderBy("time", "desc"),
        startAfter(key[0]),
        limit(2)
      );
      const userData = await getDocs(first);
      newBatchPosts = [...userData.docs];

      lastKeyArr[0] = userData.docs[userData.docs.length - 1];
    }
    let numberLoop = 1;
    for (const friend of friendsList.data().friends) {
      if (key[numberLoop]) {
        const first = query(
          collection(db, `users/${friend}/posts`),
          orderBy("time", "desc"),
          startAfter(key[numberLoop]),
          limit(2)
        );
        const userData = await getDocs(first);
        newBatchPosts = [...newBatchPosts, ...userData.docs];
        newBatchPosts = newBatchPosts.filter(
          (value, index, arr) =>
            index == arr.findIndex((va) => va.id == value.id)
        );
        lastKeyArr[numberLoop] = userData.docs[userData.docs.length - 1];
      }
      numberLoop++;
    }

    setLastKey(lastKeyArr);
    const postsSorting = newBatchPosts.sort(
      (a, b) => Number(b.data().time) - Number(a.data().time)
    );
    setPostList((prev) => [...prev, ...postsSorting]);
  };

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (lastKey.every((value) => value == false)) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMorePosts(lastKey);
        }
      });
      if (node) observer.current.observe(node);
    },
    [postList]
  );

  const postDisplay = postList.map((post, index) => {
    if (index === postList.length - 2) {
      return (
        <div ref={lastBookElementRef} key={post.id}>
          <SinglePost
            postOwner={post.data().postOwner}
            postId={index}
            name={post.data().name}
            avt={post.data().avt}
            postContent={post.data().postContent}
            postImgSrc={post.data().postImgSrc}
            timestamp={post.data().time}
            imgId={post.data().imgId}
          />
        </div>
      );
    } else {
      return (
        <SinglePost
          key={index}
          postOwner={post.data().postOwner}
          postId={post.id}
          name={post.data().name}
          avt={post.data().avt}
          postContent={post.data().postContent}
          postImgSrc={post.data().postImgSrc}
          timestamp={post.data().time}
          imgId={post.data().imgId}
        />
      );
    }
  });

  return (
    <div className="w-full">
      {/* {error && <strong>Error: {JSON.stringify(error)}</strong>} */}
      {postDisplay}
    </div>
  );
}

export default Posts;
