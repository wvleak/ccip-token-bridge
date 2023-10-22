import React from "react";

const NetworkSelectDrawer = ({ open, onSelect, direction }) => {
  const networks = [
    "Ethereum",
    "Arbitrum One",
    "Polygon",
    "OP",
    "BNB Smart Chain",
    "Avalanche C-Chain",
  ];
  return (
    <div
      className={`absolute top-[35px] w-[180px] right-0 left-0 bg-white border border-slate-200 bg-opacity-30 backdrop-blur-md rounded-lg z-10 shadow-secondary  
        ${open ? "visible" : "invisible"}`}
    >
      <ul>
        {networks.map((network) => (
          <li className="p-1">
            <button
              className="hover:bg-gray-300 hover:bg-opacity-30 w-full rounded-md text-left flex items-center gap-2 p-2"
              onClick={() => onSelect(direction, network)}
            >
              <img
                src={`src/assets/networks/${network}.png`}
                alt="logo"
                width={15}
                height={15}
                className="object-contain"
              />
              {network}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NetworkSelectDrawer;
