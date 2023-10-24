import React, { useState, useEffect } from "react";
import BridgeCard from "./BridgeCard";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useStateContext } from "../../context";

const networks = {
  Sepolia: {
    chainId: `0x${Number(11155111).toString(16)}`,
    chainName: "Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [
      "https://rpc.sepolia.org",
      "wss://ethereum-sepolia.publicnode.com",
      "https://gateway.tenderly.co/public/sepolia",
      "https://eth-sepolia.public.blastapi.io",

      "https://api.zan.top/node/v1/eth/sepolia/public",
    ],
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
  },
  Mumbai: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: [
      "https://rpc-mumbai.maticvigil.com",
      "https://polygon-mumbai-bor.publicnode.com",
      "wss://polygon-mumbai-bor.publicnode.com",
      "https://polygon-mumbai.gateway.tenderly.co",
      "wss://polygon-mumbai.gateway.tenderly.co",
    ],
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
  },
  "OP Testnet": {
    chainId: `0x${Number(420).toString(16)}`,
    chainName: "Optimistic Ethereum Testnet Goerli",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://goerli.optimism.io/"],
    blockExplorerUrls: ["https://goerli-optimism.etherscan.io/"],
  },
  "Arbitrum Goerli": {
    chainId: `0x${Number(421613).toString(16)}`,
    chainName: "Arbitrum Goerli",
    nativeCurrency: {
      name: "Arbitrum Goerli Ether",
      symbol: "AGOR",
      decimals: 18,
    },
    rpcUrls: [
      "https://goerli-rollup.arbitrum.io/rpc",
      "https://arbitrum-goerli.publicnode.com",
      "wss://arbitrum-goerli.publicnode.com",
    ],
    blockExplorerUrls: ["https://goerli.arbiscan.io"],
  },
  "Avalanche Fuji": {
    chainId: `0x${Number(43113).toString(16)}`,
    chainName: "Avalanche Fuji",
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: [
      "https://api.avax-test.network/ext/bc/C/rpc",
      "https://avalanche-fuji-c-chain.publicnode.com",
      "wss://avalanche-fuji-c-chain.publicnode.com",
    ],
    blockExplorerUrls: ["https://testnet.snowtrace.io"],
  },
  "Base Goerli": {
    chainId: `0x${Number(84531).toString(16)}`,
    chainName: "Base Goerli",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [
      "https://goerli.base.org",
      "https://base-goerli.public.blastapi.io",
      "https://base-goerli.publicnode.com",
    ],
    blockExplorerUrls: ["https://goerli.basescan.org/"],
  },
};

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
    setFromAmount(value);
    //setFromUsdPrice(await getUsdPrice(fromAmout));
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

    // setToUsdPrice(
    //   await getUsdPrice(
    //     await getSwapAmount(fromNetwork, fromToken, toToken, fromAmout)
    //   )
    // );
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

  useEffect(() => {
    changeWallet(fromNetwork);
  }, [fromNetwork]);

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
      await bridge(fromNetwork, toNetwork, fromToken, fromAmout);
    } else {
      await swapAndBridge(
        fromNetwork,
        toNetwork,
        fromToken,
        toToken,
        fromAmout
      );
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
  }, [fromNetwork, toNetwork, fromToken, toToken, address]);

  useEffect(() => {
    const setUsdPrices = async () => {
      fromAmout
        ? setFromUsdPrice(await getUsdPrice(fromAmout))
        : setFromUsdPrice(0);
      toAmout ? setToUsdPrice(await getUsdPrice(toAmout)) : setToUsdPrice(0);
    };
    setUsdPrices();
  }, [fromAmout, toAmout]);

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
