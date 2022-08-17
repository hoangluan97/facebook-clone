import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getSession, signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import Header from "../Components/Header";
import Login from "../Components/Login";
import { db } from "../FirebaseConfig";

function Layout({ children }) {
  const session = useSession();

  if (!session || session.status === "unauthenticated") {
    return <Login />;
  }
  if (session.status === "authenticated") {
    // const [user, loading, error] = useDocument(
    //   doc(db, `users/${session.data.user.email}`)
    // );
    // useEffect(() => {
    //   if (user && !loading) {
    //     if (!user.exists) {
    //       console.log(user.exists);
    //       signOut();
    //     }
    //   }
    // }, [user]);
    return (
      <>
        <Header />
        <main>{children}</main>
      </>
    );
  }
}

export default Layout;
