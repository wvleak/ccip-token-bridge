import React from "react";
import { Ethereum } from "../../assets";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const TokenSelect = ({ onClick }) => {
  return (
    <div
      className="rounded-full bg-gray-100 py-2 px-4 text-3xl cursor-pointer flex gap-3 items-center"
      onClick={onClick}
    >
      <img
        src={Ethereum}
        alt="logo"
        width={30}
        height={30}
        className="object-contain"
      />
      ETH
      <ArrowDropDownIcon fontSize="large" />
    </div>
  );
};

export default TokenSelect;
