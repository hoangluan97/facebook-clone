import React from "react";

function HeaderIcon({ Icon }) {
  return (
    <div className="cursor-pointer md:px-10 sm:h-9 flex items-center md:hover:bg-gray-100 rounded-full">
      <Icon className="h-6 md:h-8" />
    </div>
  );
}

export default HeaderIcon;
