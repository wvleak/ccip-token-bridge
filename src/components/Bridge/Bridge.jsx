import React from "react";
import BridgeCard from "./BridgeCard";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import PlayForWorkIcon from "@mui/icons-material/PlayForWork";
import SouthIcon from "@mui/icons-material/South";
import SwapVertIcon from "@mui/icons-material/SwapVert";

const Bridge = () => {
  return (
    <section className="relative mb-10 mx-auto my-auto flex flex-col gap-5 mt-[75px] max-w-[700px] w-[80vw]">
      <BridgeCard direction="From" />
      <div className="absolute top-[223px] right-[50%] border border-gray-200 rounded-full w-10 h-10 bg-gray-400 backdrop-blur-lg bg-opacity-5 flex justify-center">
        {/* <p className="my-auto">^</p> */}
        <SwapVertIcon className="my-auto" />
      </div>
      <BridgeCard direction="To" />
      <button className="w-full bg-blue-500 rounded-xl py-3 text-white text-2xl font-medium hover:opacity-60 transition duration-100">
        Swap
      </button>
    </section>
  );
};

export default Bridge;
