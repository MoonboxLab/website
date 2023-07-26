'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
  coinbaseWallet,
  walletConnectWallet,
  okxWallet,
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import CustomAvatar from '@/components/CustomAvatar';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    // polygon,
    // optimism,
    // arbitrum,
    // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [publicProvider()]
);

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;

const demoAppInfo = {
  appName: 'Connect Wallet',
};

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      okxWallet({ projectId, chains }),
      coinbaseWallet({ chains, appName: "CoinbaseWallet" }),
    ],
  },
  {
    groupName: "More",
    wallets: [
      walletConnectWallet({ projectId, chains })
    ]
  }
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
      <RainbowKitProvider
        chains={chains}
        appInfo={demoAppInfo}
        modalSize="compact"
        avatar={CustomAvatar}
      >
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
