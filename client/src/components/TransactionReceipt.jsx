const TransactionReceipt = ({ txHash, close }) => {
  return (
    <div className="fixed inset-0 z-20 h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
      <div
        className="fixed inset-0 w-full h-full"
        onClick={() => close((prev) => !prev)}
      ></div>
      <div className="z-30 flex items-center justify-center flex-col">
        <div className="flex gap-3">
          <p className="font-epilogue font-bold text-[20px] text-white text-center">
            Transaction Approved
          </p>
          <img
            src="/src/assets/success.png"
            width={20}
            height={20}
            className="object-contain"
          />
        </div>

        <p className="font-epilogue font-bold text-[15px] text-white text-center">
          See on{" "}
          <a
            href={"https://ccip.chain.link/tx/" + txHash}
            target="_blank"
            className="text-blue-600 hover:text-gray-300 transition duration-100"
          >
            CCIP Explorer.
          </a>
        </p>
      </div>
    </div>
  );
};

export default TransactionReceipt;
