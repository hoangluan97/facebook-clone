import Head from "next/head";
import React from "react";
import LeftSideBar from "../Components/LeftSideBar";
import NewsFeed from "../Components/NewsFeed";
import RightSideBar from "../Components/RightSideBar";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Facebook</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <main className="flex justify-start w-full">
        <LeftSideBar className="" />
        <NewsFeed />
        <RightSideBar className="sticky top-0 self-start" />
      </main>
    </div>
  );
}
