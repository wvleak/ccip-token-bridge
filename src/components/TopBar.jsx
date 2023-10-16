import { ConnectWallet } from "@thirdweb-dev/react";
import React from "react";

const TopBar = () => {
  return (
    <nav className="w-full flex justify-between items-center py-5 top-0 z-20">
      <div className="flex items-center gap-2">
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
      <ConnectWallet switchToActiveChain={true} />
    </nav>
  );
};

export default TopBar;
