import React from "react";
import SideBarRow from "./SideBarRow";
import { BeakerIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";

function LeftSideBar() {
  const session = useSession();
  return (
    <div className="hidden xl:inline-flex md:w-[280px] xl:w-[24%] 2xl:w-[360px] flex-col p-4 space-y-2 font-medium sticky top-16 self-start">
      <div className="flex items-center space-x-2 ">
        <Image
          src={session.data.user.image}
          width={40}
          height={40}
          layout="fixed"
          className="rounded-full"
        />
        <p>{session.data.user.name}</p>
      </div>
      <SideBarRow Icon={BeakerIcon} title="Menu" />
      <SideBarRow Icon={BeakerIcon} title="Menu" />
      <SideBarRow Icon={BeakerIcon} title="Menu" />
      <SideBarRow Icon={BeakerIcon} title="Menu" />
    </div>
  );
}

export default LeftSideBar;
