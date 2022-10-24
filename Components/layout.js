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
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="grow bg-gray-100">{children}</main>
      </div>
    );
  }
}

export default Layout;
