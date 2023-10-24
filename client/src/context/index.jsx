import React, { useContext, createContext } from "react";
import { useAddress, useContract, useMetamask } from "@thirdweb-dev/react";
import { useDisconnect } from "@thirdweb-dev/react";

import { ethers } from "ethers";

import { contract_abi } from "../utils/contract_abi";
import { networks } from "../utils/networks";

// Networks identifiers
const networkId = {
  Sepolia: "16015286601757825753",
  Mumbai: "12532609583862916517",
};

// Create a context to manage state and actions
const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  //Add all L2s contracts
  const { contract } = useContract(
    "0xaAEEf1d1C542e54C4Bd90C1D89Ed8FE1d14D539A",
    contract_abi
  );

  // const { mumbaiContract } = useContract(
  //   "0x0F0C2a062C1865e969b99bEE4C43aDCdcfdB5ba0",
  //   contract_abi
  // );

  // Get the user's address, connect, and disconnect functions.
  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();

  const BnMInterface = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address owner) external view returns (uint256)",
  ];
  const TokenInterface = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address owner) external view returns (uint256)",
  ];
  const BnMAddress = "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40";

  const getBalance = async (network, token) => {
    let provider = new ethers.providers.JsonRpcProvider(
      networks[network]["rpcUrl"]
    );
    const TokenContract = await new ethers.Contract(
      networks[network][token],
      TokenInterface,
      provider
    );

    const balance = await TokenContract.balanceOf(address);
    return ethers.utils.formatEther(balance);
    //return 10;
  };

  const getSwapAmount = async (network, fromToken, toToken, amount) => {
    let provider = new ethers.providers.JsonRpcProvider(
      networks[network]["rpcUrl"]
    );

    const BridgeContract = await new ethers.Contract(
      networks[network],
      contract_abi,
      provider
    );

    try {
      const swapAmount = await BridgeContract.getSwapAmount(
        networks[network][fromToken],
        networks[network][toToken],
        ethers.utils.parseEther(amount)
      );
      console.log("swapAmount", parseFloat(swapAmount));

      return ethers.utils.formatEther(swapAmount);
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getUsdPrice = async (amount) => {
    let provider = new ethers.providers.JsonRpcProvider(
      networks["Sepolia"]["rpcUrl"]
    );
    const priceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";

    const priceFeedContract = new ethers.Contract(
      priceFeedAddress,
      ["function latestAnswer() view returns (int256)"],
      provider
    );
    const priceInWei = await priceFeedContract.latestAnswer();
    const priceInUSD = ethers.utils.formatUnits(priceInWei, 8); // Convert from Wei to USD

    console.log(`Current ETH Price in USD: $${amount * priceInUSD}`);
    return amount * priceInUSD;
  };

  const bridge = async (
    sourceNetwork,
    destinationNetwork,
    token,
    swapAmount
  ) => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    // let provider = new ethers.providers.JsonRpcProvider(
    //   "https://polygon-mumbai.infura.io/v3/7abc4fcbab5a4df096b366dd89b46f6a"
    // );
    let signer = provider.getSigner();

    const BnMcontract = await new ethers.Contract(
      networks[sourceNetwork][token],
      BnMInterface,
      signer
    );
    //console.log("Provider:", networks[sourceNetwork]["BnM"]);
    // const balance = await BnMcontract.balanceOf(address);
    // console.log("balance:", balance);
    // console.log("swapAmount", swapAmount);
    console.log(ethers.utils.parseEther(swapAmount));
    const amount = ethers.utils.parseEther(swapAmount);
    console.log(sourceNetwork);
    switch (sourceNetwork) {
      case "Sepolia":
        console.log("1");
        //console.log(tokenAddress[sourceNetwork]);
        const fees = await contract.call("getBridgeFees", [
          networkId[destinationNetwork],
          address,
          tokenAddress[sourceNetwork][token],
          amount,
        ]);
        console.log(parseFloat(fees));

        await BnMcontract.approve(
          "0xaAEEf1d1C542e54C4Bd90C1D89Ed8FE1d14D539A",
          amount
        );

        let provider = new ethers.providers.JsonRpcProvider(
          networks[sourceNetwork]["rpcUrl"]
        );
        let testContract = await new ethers.Contract(
          networks[sourceNetwork]["contract"],
          contract_abi,
          signer
        );

        try {
          console.log("2");
          // const data = await contract.call(
          //   "bridge",
          //   [
          //     networkId[destinationNetwork],
          //     address,
          //     tokenAddress[sourceNetwork][token],
          //     amount,
          //   ],
          //   {
          //     value: fees,
          //   }
          // );
          const data = await testContract.bridge(
            networkId[destinationNetwork],
            address,
            tokenAddress[sourceNetwork][token],
            amount,
            {
              gasLimit: 20000000,
              value: fees,
            }
          );
          console.log("Contract call success", data);
          return true;
        } catch (error) {
          console.log("Contract call failure", error);
          return false;
        }
      case "Mumbai":
        await BnMcontract.approve(
          "0xaAEEf1d1C542e54C4Bd90C1D89Ed8FE1d14D539A",
          amount
        );
        break;
    }
  };
  const swapAndBridge = async (sourceNetwork, destinationNetwork) => {
    switch (sourceNetwork) {
      case "Sepolia":
        let provider = new ethers.providers.JsonRpcProvider(
          networks[sourceNetwork]["rpcUrl"]
        );
        let contract = await new ethers.Contract(
          networks[sourceNetwork]["contract"],
          contract_abi,
          provider
        );
        break;
      case "Mumbai":
        break;
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        connect,
        disconnect,
        bridge,
        swapAndBridge,
        getBalance,
        getSwapAmount,
        getUsdPrice,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Custom hook to access the state and actions.
export const useStateContext = () => useContext(StateContext);
