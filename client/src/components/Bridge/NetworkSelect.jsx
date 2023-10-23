import React, { useState } from "react";
import NetworkSelectDrawer from "./NetworkSelectDrawer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const NetworkSelect = ({ network, changeNetwork, direction }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative bg-gray-100 hover:bg-gray-200 transition duration-200 rounded-lg my-auto text-sm font-medium py-1 px-2 flex gap-2 cursor-pointer items-center"
      onClick={() => setOpen((prev) => !prev)}
    >
      <img
        src={`src/assets/networks/${network}.png`}
        alt="logo"
        width={15}
        height={15}
        className="object-contain"
      />
      {network}
      <ExpandMoreIcon />
      <NetworkSelectDrawer
        open={open}
        onSelect={changeNetwork}
        network={network}
        direction={direction}
      />
    </div>
  );
};

export default NetworkSelect;
