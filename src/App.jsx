import Bridge from "./components/Bridge/Bridge";
import Heading from "./components/Heading";
import TopBar from "./components/TopBar";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import {
  walletConnect,
  metamaskWallet,
  coinbaseWallet,
} from "@thirdweb-dev/react";

function App() {
  return (
    <>
      <ThirdwebProvider
        supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect()]}
        activeChain={Sepolia}
      >
        <div className="main">
          <div className="gradient"></div>
        </div>
        <div className="relative z-10 flex justify-center items-center flex-center flex-col max-w-7xl mx-auto sm:px-16 px-6">
          <TopBar />
          <Heading />
          <Bridge />
        </div>
      </ThirdwebProvider>
    </>
  );
}

export default App;
