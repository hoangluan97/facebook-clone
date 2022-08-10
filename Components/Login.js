import React from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

function Login() {
  const router = useRouter();
  return (
    <div className="mt-10 space-y-16 flex flex-col justify-center items-center">
      <div>
        <Image
          className="bg-transparent"
          src="https://www.transparentpng.com/thumb/facebook-logo-png/photo-facebook-logo-png-hd-25.png"
          width={300}
          height={300}
          layout="fixed"
        />
      </div>
      <div className="flex space-x-5">
        <div
          onClick={() => {
            router.push("/");
            signIn();
          }}
          className="flex justify-center cursor-pointer border-2 text-black border-blue-600 w-[200px] p-3"
        >
          Login with Facebook
        </div>
        <div
          onClick={signOut}
          className="flex justify-center cursor-pointer border-2 border-black w-[200px] p-3"
        >
          Login with your account
        </div>
      </div>
    </div>
  );
}

export default Login;
