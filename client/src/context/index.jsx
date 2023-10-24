import React, { useContext, createContext } from "react";
import { useAddress, useMetamask } from "@thirdweb-dev/react";
import { useDisconnect } from "@thirdweb-dev/react";

import { ethers } from "ethers";

import { contract_abi } from "../utils/contract_abi";
import { networks } from "../utils/networks";

// Create a context to manage state and actions
const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // Get the user's address, connect, and disconnect functions.
  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();

  const TokenInterface = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address owner) external view returns (uint256)",
  ];

  // Return the token balance
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
  };

  // Return the quote
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

  // Return the price of token amount in usd
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

    console.log(`value in USD: $${amount * priceInUSD}`);
    return amount * priceInUSD;
  };

  // Bridge token amount
  const bridge = async (sourceNetwork, destinationNetwork, token, amount) => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner();

    const TokenContract = await new ethers.Contract(
      networks[sourceNetwork][token],
      TokenInterface,
      signer
    );
    const contract = await new ethers.Contract(
      networks[sourceNetwork]["contract"],
      contract_abi,
      signer
    );

    const transferAmount = ethers.utils.parseEther(amount);

    const fees = await contract.getBridgeFees(
      networks[destinationNetwork]["id"],
      address,
      networks[sourceNetwork][token],
      transferAmount
    );

    console.log(parseFloat(fees));

    try {
      console.log("1. Approving token transfer...");

      // Send the approval transaction
      await TokenContract.approve(
        networks[sourceNetwork]["contract"],
        transferAmount
      );
      console.log("Approval transaction successful");

      console.log("2. Initiating bridge transaction...");

      // Send the bridge transaction
      const txResponse = await contract.bridge(
        networks[destinationNetwork]["id"],
        address,
        networks[sourceNetwork][token],
        transferAmount,
        {
          gasLimit: 20000000,
          value: fees,
        }
      );

      // Wait for the transaction to be mined and get the receipt
      const txReceipt = await txResponse.wait();

      if (txReceipt.status === 1) {
        console.log("Bridge transaction successful");
        return true;
      } else {
        console.error("Bridge transaction failed");
        return false;
      }
    } catch (error) {
      console.error("Transaction error:", error);
      return false;
    }
  };

  // Swap before bridge token
  const swapAndBridge = async (
    sourceNetwork,
    destinationNetwork,
    fromToken,
    toToken,
    amount
  ) => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner();

    const TokenContract = await new ethers.Contract(
      networks[sourceNetwork][fromToken],
      TokenInterface,
      signer
    );
    const contract = await new ethers.Contract(
      networks[sourceNetwork]["contract"],
      contract_abi,
      signer
    );

    const transferAmount = ethers.utils.parseEther(amount);

    const fees = await contract.getSwapAndBridgeFees(
      networks[destinationNetwork]["id"],
      address,
      networks[sourceNetwork][fromToken],
      networks[sourceNetwork][toToken],
      transferAmount
    );

    console.log(parseFloat(fees));

    try {
      console.log("1. Approving token transfer...");

      // Send the approval transaction
      await TokenContract.approve(
        networks[sourceNetwork]["contract"],
        transferAmount
      );
      console.log("Approval transaction successful");

      console.log("2. Initiating swap and bridge transaction...");

      // Send the transaction
      const txResponse = await contract.swapAndBridge(
        networks[destinationNetwork]["id"],
        address,
        networks[sourceNetwork][fromToken],
        networks[sourceNetwork][toToken],
        transferAmount,
        {
          gasLimit: 20000000,
          value: fees,
        }
      );

      // Wait for the transaction to be mined and get the receipt
      const txReceipt = await txResponse.wait();

      if (txReceipt.status === 1) {
        console.log("Bridge transaction successful");
        return true;
      } else {
        console.error("Bridge transaction failed");
        return false;
      }
    } catch (error) {
      console.error("Transaction error:", error);
      return false;
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
