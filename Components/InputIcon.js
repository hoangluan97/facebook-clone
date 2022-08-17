import React from "react";

function InputIcon({ Icon, title }) {
  return (
    <div className="cursor-pointer flex space-x-4 hover:bg-gray-300/50 h-12 items-center p-2 rounded-md">
      <Icon className="h-6" />
      <p className="text-[16px] font-medium">{title}</p>
    </div>
  );
}

export default InputIcon;
