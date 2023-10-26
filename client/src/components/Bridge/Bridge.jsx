import React, { useState, useEffect } from "react";
import BridgeCard from "./BridgeCard";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useStateContext } from "../../context";
import { networks } from "../../utils/networks_info";
import LoadingScreen from "../Loaders/LoadingScreen";
import TransactionReceipt from "../TransactionReceipt";

const Bridge = () => {
  // Context
  const {
    address,
    bridge,
    swapAndBridge,
    connect,
    getBalance,
    getSwapAmount,
    getUsdPrice,
  } = useStateContext();

  // States
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
  const [inTransaction, setInTransaction] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [txConfirmed, setTxConfirmed] = useState(false);

  // HANDLERS
  const handleClick = async () => {
    let txHash;
    if (!address) {
      connect();
    } else if (fromToken == toToken) {
      setInTransaction(true);
      txHash = await bridge(fromNetwork, toNetwork, fromToken, fromAmout);
      setInTransaction(false);
    } else {
      setInTransaction(true);
      txHash = await swapAndBridge(
        fromNetwork,
        toNetwork,
        fromToken,
        toToken,
        fromAmout
      );
      setInTransaction(false);
    }

    if (txHash) {
      setTxHash(txHash);
      setTxConfirmed(true);
    }
  };

  // EFFECT FUNCTIONS
  const changeAmount = async (value) => {
    setIsLoading(true);
    if (fromToken != toToken) {
      if (!value) {
        setToAmount(null);
      } else {
        const rawAmount = await getSwapAmount(
          fromNetwork,
          fromToken,
          toToken,
          fromAmout
        );
        const roundedAmount = parseFloat(rawAmount).toFixed(6); // Restrict to 4 decimal places
        setToAmount(roundedAmount);
      }
    } else {
      !value ? setToAmount(null) : setToAmount(value);
    }
    setIsLoading(false);
  };

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

  const changeWallet = async (network) => {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...networks[network],
          },
        ],
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // USE EFFECTS
  useEffect(() => {
    changeAmount(fromAmout);
  }, [fromAmout, fromToken, toToken]);

  useEffect(() => {
    changeWallet(fromNetwork);
  }, [fromNetwork]);

  useEffect(() => {
    const resetBalance = () => {
      setFromBalance(0);
      setToBalance(0);
    };
    const updateBalance = async () => {
      setBalanceLoading(true);
      setFromBalance(await getBalance(fromNetwork, fromToken));
      setToBalance(await getBalance(toNetwork, toToken));
      setBalanceLoading(false);
    };
    address ? updateBalance() : resetBalance();
  }, [fromNetwork, toNetwork, fromToken, toToken, address]);

  useEffect(() => {
    const setUsdPrices = async () => {
      setPriceLoading(true);
      fromAmout
        ? setFromUsdPrice(await getUsdPrice(fromAmout))
        : setFromUsdPrice(0);
      toAmout ? setToUsdPrice(await getUsdPrice(toAmout)) : setToUsdPrice(0);
      setPriceLoading(false);
    };
    setUsdPrices();
  }, [fromAmout, toAmout]);

  return (
    <section className="relative mb-10 mx-auto my-auto flex flex-col gap-5 mt-[75px] max-w-[700px] w-[80vw]">
      {inTransaction && <LoadingScreen text="Transaction is in progress" />}
      {txConfirmed && (
        <TransactionReceipt txHash={txHash} close={setTxConfirmed} />
      )}
      <BridgeCard
        direction="From"
        network={fromNetwork}
        setNetwork={changeNetwork}
        token={fromToken}
        setToken={setFromToken}
        onAmountChange={(value) => setFromAmount(value)}
        amount={fromAmout}
        balance={fromBalance}
        usdPrice={fromUsdPrice}
        balanceLoading={balanceLoading}
        priceLoading={priceLoading}
      />
      <div className="absolute top-[213px] right-[50%] border border-gray-200 rounded-full w-10 h-10 bg-gray-400 backdrop-blur-lg bg-opacity-5 flex justify-center">
        <SwapVertIcon className="my-auto" />
      </div>
      <BridgeCard
        direction="To"
        network={toNetwork}
        setNetwork={changeNetwork}
        token={toToken}
        setToken={setToToken}
        balance={toBalance}
        amount={toAmout}
        usdPrice={toUsdPrice}
        isLoading={isLoading}
        balanceLoading={balanceLoading}
        priceLoading={priceLoading}
      />
      <button
        className="w-full bg-blue-500 rounded-xl py-3 text-white text-2xl font-medium hover:opacity-60 transition duration-100"
        onClick={handleClick}
      >
        {address ? "Swap" : "Connect Wallet"}
      </button>
    </section>
  );
};

export default Bridge;
