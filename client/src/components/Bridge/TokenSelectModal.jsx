import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const TokenSelectModal = ({ open, close, changeToken }) => {
  const tokens = ["BnM", "LnM"];

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center transition-colors z-10
    text-white  
    ${open ? "visible bg-black/20" : "invisible"}`}
    >
      <div
        className="fixed inset-0 w-full h-full"
        onClick={() => close((prev) => !prev)}
      ></div>
      <div className="bg-gray-100 w-[100%] max-w-[500px] rounded-xl p-4 z-20">
        <div className="flex justify-between">
          <h1 className="text-black mb-4 text-2xl font-medium">
            Select a token
          </h1>
          <div
            onClick={() => close((prev) => !prev)}
            className="h-8 w-8 rounded-full bg-gray-200 flex justify-center hover:bg-gray-300 transition duration-200"
          >
            <CloseIcon className="my-auto text-black" fontSize="small" />
          </div>
        </div>
        <div className="bg-white w-full  rounded-xl text-black p-2">
          <ul>
            {tokens.map((token) => (
              <li className="hover:bg-gray-200 rounded-md p-1 flex gap-2">
                <img
                  src="/public/assets/networks/Sepolia.png"
                  alt="logo"
                  width={30}
                  height={30}
                  className={`object-contain ${
                    token == "BnM" ? "grayscale" : "sepia"
                  }`}
                />
                <button
                  onClick={() => {
                    changeToken(token);
                    close((prev) => !prev);
                  }}
                  className="text-black font-medium w-full text-left"
                >
                  {token}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TokenSelectModal;
