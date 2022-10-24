import React from "react";
import SinglePost from "./SinglePost";

function PersonalPosts({ data }) {
  return (
    <div className="w-full lg:max-w-[600px]">
      {data.map((post, index) => (
        <SinglePost
          key={index}
          postOwner={post.data().postOwner}
          postId={post.id}
          name={post.data().name}
          avt={post.data().avt}
          postContent={post.data().postContent}
          postImgSrc={post.data().postImgSrc}
          timestamp={post.data().time}
        />
      ))}
    </div>
  );
}

export default PersonalPosts;
