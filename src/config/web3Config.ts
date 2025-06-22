import { createConfig, configureChains } from 'wagmi';
import { Chain } from 'viem';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { polygonAmoy } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

// Define Umi Network Devnet based on official documentation
export const umiDevnet = {
  id: 42069,
  name: 'Umi Devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://devnet.moved.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Umi Explorer',
      url: 'https://devnet.explorer.moved.network',
    },
  },
  testnet: true,
} as const satisfies Chain;

// Configure chains with providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [umiDevnet, polygonAmoy],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === umiDevnet.id) {
          return {
            http: 'https://devnet.moved.network',
          };
        }
        return null;
      },
    }),
    publicProvider(),
  ]
);

// Note: WalletConnect is handled by Web3Modal, not directly in wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'UmiKarma',
        appLogoUrl: 'http://localhost:3000/logo192.png',
      },
    }),
    new InjectedConnector({ chains }),
  ],
  publicClient,
     webSocketPublicClient,
});

export { chains };

export const supportedChains = [
  {
    id: umiDevnet.id,
    name: 'Umi Devnet',
    nativeCurrency: 'ETH',
    blockExplorers: ['https://devnet.explorer.moved.network'],
    rpcUrl: 'https://devnet.moved.network',
    faucetUrl: 'https://faucet.umi.network', // Based on documentation
    status: 'primary', // Primary choice
  },
  {
    id: polygonAmoy.id,
    name: 'Polygon Amoy Testnet',
    nativeCurrency: 'MATIC',
    blockExplorers: ['https://amoy.polygonscan.com'],
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    faucetUrl: 'https://faucet.polygon.technology',
    status: 'fallback', // Fallback option
  },
]; 