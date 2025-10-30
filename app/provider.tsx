"use client";

import * as React from "react";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, sepolia, bsc, bscTestnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  walletConnectWallet,
  okxWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";

// 创建自定义 chain 配置，覆盖 RPC URLs
const customSepolia = {
  ...sepolia,
  rpcUrls: {
    ...sepolia.rpcUrls,
    default: {
      http: ["https://ethereum-sepolia-rpc.publicnode.com/"],
      webSocket: ["wss://ethereum-sepolia-rpc.publicnode.com/"],
    },
    public: {
      http: ["https://ethereum-sepolia-rpc.publicnode.com/"],
      webSocket: ["wss://ethereum-sepolia-rpc.publicnode.com/"],
    },
  },
} as unknown as typeof sepolia;

const customBscTestnet = {
  ...bscTestnet,
  rpcUrls: {
    ...bscTestnet.rpcUrls,
    default: {
      http: ["https://bsc-testnet.public.blastapi.io"],
      webSocket: ["wss://bsc-testnet-rpc.publicnode.com"],
    },
    public: {
      http: ["https://bsc-testnet.public.blastapi.io"],
      webSocket: ["wss://bsc-testnet-rpc.publicnode.com"],
    },
  },
} as unknown as typeof bscTestnet;
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    ...(process.env.NEXT_PUBLIC_TEST_ENV === "true"
      ? [mainnet, customSepolia, bsc, customBscTestnet]
      : [mainnet, bsc]),
  ],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string }),
    publicProvider(),
  ],
);

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ projectId, chains }),
      okxWallet({ projectId, chains }),
      coinbaseWallet({ chains, appName: "CoinbaseWallet" }),
    ],
  },
  {
    groupName: "More",
    wallets: [walletConnectWallet({ projectId, chains })],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function WagmiProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
