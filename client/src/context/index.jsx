import React, { useContext, createContext } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { useDisconnect } from "@thirdweb-dev/react";

import { ethers } from "ethers";

import { contract_abi } from "../utils/contract_abi";

// Networks identifiers
const networkId = {
  Sepolia: "16015286601757825753",
  Mumbai: "12532609583862916517",
};

// Token address
const tokenAddress = {
  Sepolia: {
    BnM: "0xfd57b4ddbf88a4e07ff4e34c487b99af2fe82a05",
    LnM: "0x466d489b6d36e7e3b824ef491c225f5830e81cc1",
  },
  Mumbai: {
    BnM: "0xfd57b4ddbf88a4e07ff4e34c487b99af2fe82a05",
    LnM: "0x466d489b6d36e7e3b824ef491c225f5830e81cc1",
  },
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
  ];
  const BnMAddress = "0xfd57b4ddbf88a4e07ff4e34c487b99af2fe82a05";

  const bridge = async (
    sourceNetwork,
    destinationNetwork,
    token,
    swapAmount
  ) => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner();
    const BnMcontract = await new ethers.Contract(
      BnMAddress,
      BnMInterface,
      signer
    );
    console.log("swapAmount", swapAmount);
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
        console.log(fees);

        await BnMcontract.approve(
          "0xaAEEf1d1C542e54C4Bd90C1D89Ed8FE1d14D539A",
          amount
        );

        try {
          console.log("2");
          const data = await contract.call(
            "bridge",
            [
              networkId[destinationNetwork],
              address,
              tokenAddress[sourceNetwork][token],
              amount,
            ],
            {
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
        break;
    }
  };
  const swapAndBridge = (sourceNetwork, destinationNetwork) => {
    switch (sourceNetwork) {
      case "Sepolia":
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
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Custom hook to access the state and actions.
export const useStateContext = () => useContext(StateContext);
