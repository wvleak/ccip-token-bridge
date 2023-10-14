import React, { useState } from "react";
import TokenSelectModal from "./TokenSelectModal";
import TokenSelect from "./TokenSelect";
import NetworkSelect from "./NetworkSelect";
import WalletIcon from "@mui/icons-material/Wallet";

const BridgeCard = ({ direction }) => {
  const [open, setOpen] = useState(false);
  const [network, setNetwork] = useState("Polygon");
  return (
    <div className="max-w-[700px]  bg-white border-slate-200 border rounded-xl flex flex-col">
      <TokenSelectModal open={open} close={setOpen} />
      <div className="w-full border-b border-slate-200 flex justify-start p-3 gap-3">
        <p className="text-gray-500 my-auto">{direction}</p>
        <NetworkSelect network={network} changeNetwork={setNetwork} />
      </div>
      <div className="w-full flex justify-between p-5">
        <h1 className="my-auto text-4xl text-gray-500">0.0</h1>
        <TokenSelect onClick={() => setOpen((prev) => !prev)} />
      </div>
      <div className="w-full flex justify-between p-5">
        <h1 className="my-auto text-2xl text-gray-500">
          $ 0.<span className="text-xl">00</span>
        </h1>
        <button className="rounded-lg bg-gray-100 p-2 my-auto">
          {" "}
          <WalletIcon /> connect wallet
        </button>
      </div>
    </div>
  );
};

export default BridgeCard;
