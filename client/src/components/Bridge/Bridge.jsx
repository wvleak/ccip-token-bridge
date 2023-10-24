import React, { useState, useEffect } from "react";
import BridgeCard from "./BridgeCard";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useStateContext } from "../../context";

const Bridge = () => {
  const {
    address,
    bridge,
    swapAndBridge,
    connect,
    getBalance,
    getSwapAmount,
    getUsdPrice,
  } = useStateContext();

  const handlePriceChange = async (value) => {
    setIsLoading(true);
    //await getUsdPrice(value);
    setFromAmount(value);
    setFromUsdPrice(await getUsdPrice(fromAmout));
    if (fromToken != toToken) {
      console.log(
        await getSwapAmount(fromNetwork, fromToken, toToken, fromAmout)
      );
      !value
        ? setToAmount(null)
        : setToAmount(
            await getSwapAmount(fromNetwork, fromToken, toToken, fromAmout)
          );
    } else {
      !value ? setToAmount(null) : setToAmount(value);
    }

    setToUsdPrice(
      await getUsdPrice(
        await getSwapAmount(fromNetwork, fromToken, toToken, fromAmout)
      )
    );
    setIsLoading(false);
  };
  const [fromNetwork, setFromNetwork] = useState("Sepolia");
  const [toNetwork, setToNetwork] = useState("Mumbai");
  const [fromToken, setFromToken] = useState("BnM");
  const [toToken, setToToken] = useState("BnM");
  const [isLoading, setIsLoading] = useState(false);
  const [fromAmout, setFromAmount] = useState(null);
  const [toAmout, setToAmount] = useState(null);
  const [fromBalance, setFromBalance] = useState(0);
  const [toBalance, setToBalance] = useState(0);
  const [fromUsdPrice, setFromUsdPrice] = useState(0);
  const [toUsdPrice, setToUsdPrice] = useState(0);

  const changeNetwork = async (direction, network) => {
    if (direction == "From") {
      setFromNetwork(network);
      if (toNetwork == network) {
        network == "Sepolia" ? setToNetwork("Mumbai") : setToNetwork("Sepolia");
      }
    } else {
      setToNetwork(network);
      if (fromNetwork == network) {
        network == "Sepolia"
          ? setFromNetwork("Mumbai")
          : setFromNetwork("Sepolia");
      }
    }
  };

  const handleClick = async () => {
    if (!address) {
      connect();
    } else if (fromToken == toToken) {
      await bridge(fromNetwork, toNetwork, fromToken, swapAmout);
    }
  };

  useEffect(() => {
    const resetBalance = () => {
      setFromBalance(0);
      setToBalance(0);
    };
    const updateBalance = async () => {
      setFromBalance(await getBalance(fromNetwork, fromToken));
      setToBalance(await getBalance(toNetwork, toToken));
    };
    address ? updateBalance() : resetBalance();
    //updateBalance();
  }, [fromNetwork, toNetwork, fromToken, toToken, address]);

  return (
    <section className="relative mb-10 mx-auto my-auto flex flex-col gap-5 mt-[75px] max-w-[700px] w-[80vw]">
      <BridgeCard
        direction="From"
        network={fromNetwork}
        setNetwork={changeNetwork}
        token={fromToken}
        setToken={setFromToken}
        onPriceChange={handlePriceChange}
        amount={fromAmout}
        balance={fromBalance}
        usdPrice={fromUsdPrice}
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
        balance={toBalance}
        amount={toAmout}
        usdPrice={toUsdPrice}
        isLoading={isLoading}
      />
      <button
        className="w-full bg-blue-500 rounded-xl py-3 text-white text-2xl font-medium hover:opacity-60 transition duration-100"
        onClick={handleClick}
      >
        Swap
      </button>
    </section>
  );
};

export default Bridge;
