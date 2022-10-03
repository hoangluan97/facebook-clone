import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import Header from "../Components/Header";
import Login from "../Components/Login";

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
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="grow bg-gray-100">{children}</main>
      </div>
    );
  }
}

export default Layout;
