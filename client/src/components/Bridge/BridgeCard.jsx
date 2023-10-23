import React, { useState } from "react";
import TokenSelectModal from "./TokenSelectModal";
import TokenSelect from "./TokenSelect";
import NetworkSelect from "./NetworkSelect";
import WalletIcon from "@mui/icons-material/Wallet";
import SkeletonLoader from "../SkeletonLoader";

const BridgeCard = ({
  direction,
  network,
  setNetwork,
  token,
  setToken,
  isLoading,
  onPriceChange,
  swapAmount,
}) => {
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState(null);
  const [usdValue, setUsdValue] = useState(0);
  const [balance, setBalance] = useState(0);

  const formatValue = (value) => {
    const stringValue = value.toFixed(2).toString();
    const splitValue = stringValue.split(".");
    return (
      <>
        {splitValue[0]}.<span className="text-lg">{splitValue[1]}</span>
      </>
    );
  };

  return (
    <div className="max-w-[700px]  bg-white border-slate-200 border rounded-xl flex flex-col">
      <TokenSelectModal open={open} close={setOpen} changeToken={setToken} />
      <div className="w-full border-b border-slate-200 flex justify-start p-3 gap-3">
        <p className="text-gray-500 my-auto">{direction}</p>
        <NetworkSelect
          network={network}
          changeNetwork={setNetwork}
          direction={direction}
        />
      </div>
      <div className="w-full flex justify-between p-5">
        {direction == "From" ? (
          <input
            type="number"
            className="input outline-none my-auto text-4xl text-black w-[80%]"
            placeholder="0.0"
            min={0}
            value={swapAmount}
            onChange={(e) => {
              onPriceChange(e.target.value);
            }}
            style={{ WebkitAppearance: "none" }}
          />
        ) : isLoading ? (
          <SkeletonLoader style="w-[70%] h-9" />
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
        {isLoading ? (
          <SkeletonLoader style="w-[30%] h-9" />
        ) : (
          <h1 className="my-auto text-2xl text-gray-500">
            $ {formatValue(usdValue)}
          </h1>
        )}
        <div className="flex items-center gap-2">
          <WalletIcon
            className={direction == "From" ? "text-[#086bff]" : "text-gray-500"}
          />
          <h1
            className={`my-auto text-2xl ${
              direction == "From" ? "text-[#086bff]" : "text-gray-500"
            }`}
          >
            {formatValue(balance)}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default BridgeCard;
