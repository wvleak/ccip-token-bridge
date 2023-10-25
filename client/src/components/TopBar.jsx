import React from "react";

import { useMetamask, useAddress, useDisconnect } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import LogoutIcon from "@mui/icons-material/Logout";

const TopBar = () => {
  const connect = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <nav className="w-full flex justify-between items-center py-5 top-0 z-20">
      <div className="flex items-center gap-2">
        <img
          src="public/assets/blue-logo.png"
          alt="logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text font-mono italic">SimpleBridge</p>
      </div>
      {address ? (
        <div className="flex items-center gap-2">
          <p className="text-black truncate w-[100px] rounded-lg bg-gray-100 py-2 px-3 font-medium my-auto">
            {address}
          </p>
          <LogoutIcon
            onClick={disconnect}
            className="cursor-pointer hover:text-gray-400"
          />
        </div>
      ) : (
        <button
          className="rounded-lg bg-gray-100 py-2 px-3 font-medium my-auto hover:bg-gray-200 transition duration-200"
          onClick={() =>
            connect({
              chainId: Sepolia.chainId,
            })
          }
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
};

export default TopBar;
