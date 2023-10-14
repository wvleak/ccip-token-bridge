import React from "react";

const TokenSelectModal = ({ open, close }) => {
  const tokens = ["WETH", "BNB", "MATIC"];
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center transition-colors z-10
    text-white  
    ${open ? "visible bg-black/20" : "invisible"}`}
      onClick={() => close((prev) => !prev)}
    >
      <div className="bg-gray-100 w-[100%] max-w-[500px] rounded-xl p-4">
        <h1 className="text-black mb-4 text-2xl">Select token</h1>
        <div className="bg-white w-full  rounded-xl text-black p-2">
          <ul>
            {tokens.map((token) => (
              <li className="hover:bg-gray-200 rounded-md p-1">
                <button className="text-black">{token}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TokenSelectModal;
