import React, { useState } from "react";
import TokenSelectModal from "./TokenSelectModal";
import TokenSelect from "./TokenSelect";
import NetworkSelect from "./NetworkSelect";
import WalletIcon from "@mui/icons-material/Wallet";

const BridgeCard = ({ direction }) => {
  const [open, setOpen] = useState(false);
  const [network, setNetwork] = useState("Ethereum");
  const [token, setToken] = useState("BnM");
  const [number, setNumber] = useState(null);
  const [usdValue, setUsdValue] = useState(0.0);
  return (
    <div className="max-w-[700px]  bg-white border-slate-200 border rounded-xl flex flex-col">
      <TokenSelectModal open={open} close={setOpen} changeToken={setToken} />
      <div className="w-full border-b border-slate-200 flex justify-start p-3 gap-3">
        <p className="text-gray-500 my-auto">{direction}</p>
        <NetworkSelect network={network} changeNetwork={setNetwork} />
      </div>
      <div className="w-full flex justify-between p-5">
        {direction == "From" ? (
          <input
            type="number"
            className="input outline-none my-auto text-4xl text-black w-[80%]"
            placeholder="0.0"
            min={0}
            value={number}
            onChange={() => setNumber(value)}
            style={{ WebkitAppearance: "none" }}
          />
        ) : (
          <input
            type="number"
            className="input outline-none my-auto text-4xl text-black w-[80%] disabled:bg-transparent"
            placeholder="0.0"
            disabled
            min={0}
            value={number}
            onChange={() => setNumber(value)}
            style={{ WebkitAppearance: "none" }}
          />
        )}

        <TokenSelect token={token} onClick={() => setOpen((prev) => !prev)} />
      </div>
      <div className="w-full flex justify-between p-5">
        <h1 className="my-auto text-2xl text-gray-500">
          $ {usdValue.toFixed(2)}
        </h1>
        <button className="rounded-lg bg-gray-100 p-2 my-auto hover:bg-gray-200 transition duration-200">
          <WalletIcon /> connect wallet
        </button>
      </div>
    </div>
  );
};

export default BridgeCard;
