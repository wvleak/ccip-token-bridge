import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import {
  walletConnect,
  metamaskWallet,
  coinbaseWallet,
} from "@thirdweb-dev/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider
      supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect()]}
      activeChain={Sepolia}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
