# SimpleBridge
## Motivation
SimpleBridge objective is to experiment the new CCIP protocol from Chainlink. The app allows you to swap and bridge supported tokens between multiple Ethereum L2 networks. <br>
See [Live Demo.](https://ccip-token-bridge.vercel.app/)

## Screenshot
<img width="1424" alt="Capture d’écran 2023-10-25 à 16 33 18" src="https://github.com/wvleak/token_beats/assets/73338115/b1a719d0-b467-4c1a-81bb-1d39c3d05bf4">

## Description

This application deploys a single contract across various chains. It leverages its own token balance for swaps using a constant product formula and facilitates token transfers through the CCIP router. It's important to note that a CCIP transaction can take up to 30 minutes for validation. 

Currently, this application is deployed on testnets, and it supports two test tokens: CCIP-BnM and CCIP-LnM. You can obtain these test tokens [here](https://docs.chain.link/ccip/test-tokens#mint-tokens-in-the-documentation). Please be aware that CCIP fees are paid in the native tokens of each respective blockchain, so make sure you have an adequate supply before engaging in any operations.

## Supported Networks
- Ethereum Sepolia
- Polygon Mumbai
- Arbitrum Goerli
- OP Goerli
- Base Goerli
- Avalanche Fuji

## Supported Tokens
- CCIP-BnM
- CCIP-LnM

To acquire these test tokens, visit [this link](https://docs.chain.link/ccip/test-tokens#mint-tokens-in-the-documentation).

## ⚠️ Disclaimer

These contracts are not intended for production use and are created solely for experimental purposes. The token swapping formula employed carries a high level of risk.
