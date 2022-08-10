import React from "react";

function SideBarRow({ Icon, title }) {
  return (
    <div className="cursor-pointer flex space-x-4 hover:bg-gray-300/50 h-12 items-center pl-4 rounded-md">
      <Icon className="h-6" />
      <p className="text-[16px] font-medium">{title}</p>
    </div>
  );
}

export default SideBarRow;
