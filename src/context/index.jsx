import React, { useContext, createContext } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { useDisconnect } from "@thirdweb-dev/react";

// Create a context to manage state and actions.
const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    // Get the contract instance and methods.
    const { contract } = useContract(
      "0x27FFb4Fd562158A92ae91Db1bD7760a7d2b27E2e",
      contract_abi
    );
    //Add all L2s contracts
  
    // Get the user's address, connect, and disconnect functions.
    const address = useAddress();
    const connect = useMetamask();
    const disconnect = useDisconnect();
  
    // Function to bridge .
    const publishBeat = async (form) => {
      try {
        const data = await listBeat({
          args: [form.title, form.maxSupply, form.usdPrice, form.uri],
        });
  
        console.log("Contract call success", data);
        return true;
      } catch (error) {
        console.log("Contract call failure", error);
        return false;
      }
    };
  
    // Function to buy a beat.
    const buyBeat = async (beatId, price) => {
      try {
        const data = await contract.call("buyBeat", [beatId], {
          value: price,
        });
        console.log("Contract call success", data);
        return true;
      } catch (error) {
        console.log("Contract call failure", error);
        return false;
      }
    };
  
    // Function to get the ETH price based on USD price.
    const getEthPrice = async (usdPrice) => {
      const ethPrice = await contract.call("getEthPrice", [usdPrice]);
      return ethPrice;
    };
  
    // Function to get all beats.
    const getAllBeats = async () => {
      const beats = await contract.call("getAllBeats");
  
      const parsedBeats = beats.map((beat) => ({
        id: beat.beatId,
        name: beat.name,
        producer: beat.producer,
        maxSupply: beat.maxSupply,
        usdPrice: beat.usdPrice,
        sales: beat.sales,
        uri: beat.uri,
      }));
  
      return parsedBeats;
    };
  
    // Function to get the latest beats.
    const getLastBeats = async () => {
      const beats = await contract.call("getLastBeats");
  
      const parsedBeats = beats.map((beat) => ({
        id: beat.beatId,
        name: beat.name,
        producer: beat.producer,
        maxSupply: beat.maxSupply,
        usdPrice: beat.usdPrice,
        sales: beat.sales,
        uri: beat.uri,
      }));
  
      return parsedBeats;
    };
  
    // Function to get beats by a specific producer.
    const getProducerBeats = async (producerAddress) => {
      const allBeats = await getAllBeats();
  
      const filteredBeats = allBeats.filter(
        (beat) => beat.producer === producerAddress
      );
  
      return filteredBeats;
    };
  
    // Function to get a specific beat by its ID.
    const getBeat = async (beatId) => {
      const allBeats = await getAllBeats();
  
      const filteredBeats = allBeats.filter((beat) => beat.id == beatId);
  
      return filteredBeats;
    };
  
    // Function to get user profile data based on the address.
    const getUserProfile = async (userAddress) => {
      try {
        const response = await axios(`/api/profile/${userAddress}`);
  
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    // Function to get beat tags based on the title.
    const getBeatTags = async (title) => {
      try {
        const response = await axios(`/api/beats/${title}`);
  
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchBeatInfo = async (beats) => {
      const beatsInfoPromises = beats.map(async (beat) => {
        const producerInfoResponse = await getUserProfile(beat.producer);
        const producerInfo = {
          ...producerInfoResponse,
          address: beat.producer, // Add the address property
        };
        let tags = [];
        const data = await getBeatTags(beat.name);
        if (data) {
          tags = data.tags;
        }
        const imageResponse = await axios.get(beat.uri); // Fetch the image
        const supplyLeft = beat.maxSupply - beat.sales; // Calculate supplyLeft
  
        return {
          ...beat,
          producerInfo,
          tags,
          image: imageResponse.data.image, // Add the image property
          supplyLeft: supplyLeft, // Add the supplyLeft property
        };
      });
  
      return beatsInfoPromises;
    };
  
    return (
      <StateContext.Provider
        value={{
          address,
          contract,
          connect,
          disconnect,
        }}
      >
        {children}
      </StateContext.Provider>
    );
  };