import React from "react";

const Heading = () => {
  return (
    <section className="w-full flex flex-center flex-col">
      <h1 className="head_text text-center">
        Bridge & Swap
        <br className="max-md:hidden" />
        <span className="blue_gradient text-center"> Tokens Cross-Chain</span>
      </h1>
      <p className="mt-5 mx-auto text-lg text-gray-600 sm:text-xl max-w-2xl text-center">
        SimpleBridge helps you swap your tokens cross-chain using Chainlink CCIP
        protocol.
      </p>
    </section>
  );
};

export default Heading;
