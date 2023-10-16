import React from "react";
import { Ethereum } from "../../assets";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const TokenSelect = ({ token, onClick }) => {
  return (
    <div
      className="shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200 py-2 px-4 text-3xl cursor-pointer flex gap-3 items-center"
      onClick={onClick}
    >
      <img
        src={Ethereum}
        alt="logo"
        width={30}
        height={30}
        className={`object-contain ${token == "BnM" ? "grayscale" : "sepia"}`}
      />
      {token}
      <ArrowDropDownIcon fontSize="large" />
    </div>
  );
};

export default TokenSelect;
