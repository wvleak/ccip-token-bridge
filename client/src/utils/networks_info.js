export const networks = {
  Sepolia: {
    chainId: `0x${Number(11155111).toString(16)}`,
    chainName: "Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [
      "https://rpc.sepolia.org",
      "wss://ethereum-sepolia.publicnode.com",
      "https://gateway.tenderly.co/public/sepolia",
      "https://eth-sepolia.public.blastapi.io",

      "https://api.zan.top/node/v1/eth/sepolia/public",
    ],
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
  },
  Mumbai: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: [
      "https://rpc-mumbai.maticvigil.com",
      "https://polygon-mumbai-bor.publicnode.com",
      "wss://polygon-mumbai-bor.publicnode.com",
      "https://polygon-mumbai.gateway.tenderly.co",
      "wss://polygon-mumbai.gateway.tenderly.co",
    ],
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
  },
  "OP Testnet": {
    chainId: `0x${Number(420).toString(16)}`,
    chainName: "Optimistic Ethereum Testnet Goerli",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://goerli.optimism.io/"],
    blockExplorerUrls: ["https://goerli-optimism.etherscan.io/"],
  },
  "Arbitrum Goerli": {
    chainId: `0x${Number(421613).toString(16)}`,
    chainName: "Arbitrum Goerli",
    nativeCurrency: {
      name: "Arbitrum Goerli Ether",
      symbol: "AGOR",
      decimals: 18,
    },
    rpcUrls: [
      "https://goerli-rollup.arbitrum.io/rpc",
      "https://arbitrum-goerli.publicnode.com",
      "wss://arbitrum-goerli.publicnode.com",
    ],
    blockExplorerUrls: ["https://goerli.arbiscan.io"],
  },
  "Avalanche Fuji": {
    chainId: `0x${Number(43113).toString(16)}`,
    chainName: "Avalanche Fuji",
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: [
      "https://api.avax-test.network/ext/bc/C/rpc",
      "https://avalanche-fuji-c-chain.publicnode.com",
      "wss://avalanche-fuji-c-chain.publicnode.com",
    ],
    blockExplorerUrls: ["https://testnet.snowtrace.io"],
  },
  "Base Goerli": {
    chainId: `0x${Number(84531).toString(16)}`,
    chainName: "Base Goerli",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [
      "https://goerli.base.org",
      "https://base-goerli.public.blastapi.io",
      "https://base-goerli.publicnode.com",
    ],
    blockExplorerUrls: ["https://goerli.basescan.org/"],
  },
};
