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

const networks = {
  Sepolia: {
    rpcUrl: "https://sepolia.infura.io/v3/7abc4fcbab5a4df096b366dd89b46f6a",
    BnM: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
    LnM: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
  },
  Mumbai: {
    rpcUrl:
      "https://polygon-mumbai.infura.io/v3/7abc4fcbab5a4df096b366dd89b46f6a",
    BnM: "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40",
    LnM: "0xc1c76a8c5bFDE1Be034bbcD930c668726E7C1987",
  },
  "OP Testnet": {
    rpcUrl:
      "https://optimism-goerli.infura.io/v3/7abc4fcbab5a4df096b366dd89b46f6a",
    BnM: "0xaBfE9D11A2f1D61990D1d253EC98B5Da00304F16",
    LnM: "0x835833d556299CdEC623e7980e7369145b037591",
  },
  "Arbitrum Goerli": {
    rpcUrl:
      "https://arbitrum-goerli.infura.io/v3/7abc4fcbab5a4df096b366dd89b46f6a",
    BnM: "0x0579b4c1C8AcbfF13c6253f1B10d66896Bf399Ef",
    LnM: "0x0E14dBe2c8e1121902208be173A3fb91Bb125CDB",
  },
  "Avalanche Fuji": {
    rpcUrl:
      "https://avalanche-fuji.infura.io/v3/7abc4fcbab5a4df096b366dd89b46f6a",
    BnM: "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4",
    LnM: "0x70F5c5C40b873EA597776DA2C21929A8282A3b35",
  },
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

// Contract addresses
const contractAddress = {
  Sepolia: "0xc4a03210542E07Ca26f9798054DF0d2ab5A6CEAE",
  Mumbai: "0x0F0C2a062C1865e969b99bEE4C43aDCdcfdB5ba0",
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
      contractAddress[network],
      contract_abi,
      provider
    );

    const swapAmount = await BridgeContract.getSwapAmount(
      networks[network][fromToken],
      networks[network][toToken],
      ethers.utils.parseEther(amount)
    );
    console.log("swapAmount", parseFloat(swapAmount));

    return ethers.utils.formatEther(swapAmount);
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
    //let provider = new ethers.providers.Web3Provider(window.ethereum);
    let provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.infura.io/v3/7abc4fcbab5a4df096b366dd89b46f6a"
    );
    //let signer = provider.getSigner();
    const BnMcontract = await new ethers.Contract(
      BnMAddress,
      BnMInterface,
      provider
    );
    //console.log("Provider:", networks[sourceNetwork]["BnM"]);
    const balance = await BnMcontract.balanceOf(address);
    console.log("balance:", balance);
    console.log("swapAmount", swapAmount);
    console.log(ethers.utils.parseEther(swapAmount));
    const amount = ethers.utils.parseEther(swapAmount);
    console.log(sourceNetwork);
    // switch (sourceNetwork) {
    //   case "Sepolia":
    //     console.log("1");
    //     //console.log(tokenAddress[sourceNetwork]);
    //     const fees = await contract.call("getBridgeFees", [
    //       networkId[destinationNetwork],
    //       address,
    //       tokenAddress[sourceNetwork][token],
    //       amount,
    //     ]);
    //     console.log(fees);

    //     await BnMcontract.approve(
    //       "0xaAEEf1d1C542e54C4Bd90C1D89Ed8FE1d14D539A",
    //       amount
    //     );

    //     try {
    //       console.log("2");
    //       const data = await contract.call(
    //         "bridge",
    //         [
    //           networkId[destinationNetwork],
    //           address,
    //           tokenAddress[sourceNetwork][token],
    //           amount,
    //         ],
    //         {
    //           value: fees,
    //         }
    //       );
    //       console.log("Contract call success", data);
    //       return true;
    //     } catch (error) {
    //       console.log("Contract call failure", error);
    //       return false;
    //     }
    //   case "Mumbai":
    //     break;
    // }
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
