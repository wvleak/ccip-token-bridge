import React, { useState } from "react";
import BridgeCard from "./BridgeCard";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import PlayForWorkIcon from "@mui/icons-material/PlayForWork";
import SouthIcon from "@mui/icons-material/South";
import SwapVertIcon from "@mui/icons-material/SwapVert";

const Bridge = () => {
  const handlePriceChange = (value) => {
    setIsLoading(true);

    //setIsLoading(false);
  };
  const [fromNetwork, setFromNetwork] = useState("Ethereum");
  const [toNetwork, setToNetwork] = useState("Polygon");
  const [fromToken, setFromToken] = useState("BnM");
  const [toToken, setToToken] = useState("BnM");
  const [isLoading, setIsLoading] = useState(false);

  const changeNetwork = (direction, network) => {
    if (direction == "From") {
      setFromNetwork(network);
      if (toNetwork == network) {
        network == "Ethereum"
          ? setToNetwork("Polygon")
          : setToNetwork("Ethereum");
      }
    } else {
      setToNetwork(network);
      if (fromNetwork == network) {
        network == "Ethereum"
          ? setFromNetwork("Polygon")
          : setFromNetwork("Ethereum");
      }
    }
  };
  return (
    <section className="relative mb-10 mx-auto my-auto flex flex-col gap-5 mt-[75px] max-w-[700px] w-[80vw]">
      <BridgeCard
        direction="From"
        network={fromNetwork}
        setNetwork={changeNetwork}
        token={fromToken}
        setToken={setFromToken}
        onPriceChange={handlePriceChange}
      />
      <div className="absolute top-[213px] right-[50%] border border-gray-200 rounded-full w-10 h-10 bg-gray-400 backdrop-blur-lg bg-opacity-5 flex justify-center">
        <SwapVertIcon className="my-auto" />
      </div>
      <BridgeCard
        direction="To"
        //onPriceChange={onPriceChange}
        network={toNetwork}
        setNetwork={changeNetwork}
        token={toToken}
        setToken={setToToken}
        isLoading={isLoading}
      />
      <button className="w-full bg-blue-500 rounded-xl py-3 text-white text-2xl font-medium hover:opacity-60 transition duration-100">
        Swap
      </button>
    </section>
  );
};

export default Bridge;
