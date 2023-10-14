import React from "react";

const TopBar = () => {
  return (
    <div className="w-full flex items-center py-5 top-0 z-20 gap-2">
      <img
        src="src/assets/blue-logo.png"
        alt="logo"
        width={30}
        height={30}
        className="object-contain"
        d
      />
      <p className="logo_text">SimpleBridge</p>
    </div>
  );
};

export default TopBar;
