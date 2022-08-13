import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Layout from "./layout";
import { useState } from "react";
import React from "react";

export const Context = React.createContext(null);

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [showChatBox, setShowChatBox] = useState("hidden");
  const [showNoti, setShowNoti] = useState("hidden");

  return (
    <SessionProvider session={session}>
      <Context.Provider
        value={{
          chatbox: [showChatBox, setShowChatBox],
          noti: [showNoti, setShowNoti],
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Context.Provider>
    </SessionProvider>
  );
}

export default MyApp;
