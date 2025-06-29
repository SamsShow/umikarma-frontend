import { http } from 'wagmi';
import { createConfig } from 'wagmi';
import { Chain } from 'viem';
import { metaMask, coinbaseWallet, injected } from 'wagmi/connectors';
import { polygonAmoy } from 'wagmi/chains';

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

// Note: WalletConnect is handled by Web3Modal, not directly in wagmi config

export const wagmiConfig = createConfig({
  chains: [umiDevnet, polygonAmoy] as const,
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'UmiKarma',
      appLogoUrl: 'http://localhost:3000/logo192.png',
    }),
    injected(),
  ],
  transports: {
    [umiDevnet.id]: http('https://devnet.moved.network', {
      timeout: 20_000, // Increased timeout to 20 seconds
      retryCount: 1, // Allow 1 retry to handle intermittent issues
      retryDelay: 3_000, // 3 second delay between retries
      fetchOptions: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    }),
    [polygonAmoy.id]: http(), // Uses default RPC with default retry settings
  },
});

export const supportedChains = [
  {
    id: umiDevnet.id,
    name: 'Umi Devnet',
    nativeCurrency: 'ETH',
    blockExplorers: ['https://devnet.explorer.moved.network'],
    rpcUrl: 'https://devnet.moved.network',
    faucetUrl: 'https://faucet.umi.network', // Based on documentation
    status: 'primary', // Primary choice
    corsIssues: true, // Known CORS restrictions from browsers
    walletBypass: true, // Modern wallets bypass CORS
  },
  {
    id: polygonAmoy.id,
    name: 'Polygon Amoy Testnet',
    nativeCurrency: 'MATIC',
    blockExplorers: ['https://amoy.polygonscan.com'],
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    faucetUrl: 'https://faucet.polygon.technology',
    status: 'fallback', // Fallback option
    corsIssues: false,
    walletBypass: false,
  },
];

// Network status detection helper
export const detectNetworkStatus = async (chainId: number): Promise<'online' | 'cors-issue' | 'offline'> => {
  const chain = supportedChains.find(c => c.id === chainId);
  if (!chain) return 'offline';

  try {
    // Try a simple fetch to detect CORS vs offline
    const response = await fetch(chain.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'eth_chainId',
        params: [],
        id: 1,
        jsonrpc: '2.0'
      })
    });
    
    return response.ok ? 'online' : 'offline';
  } catch (error) {
    // Check if it's a CORS error specifically
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return chain.corsIssues ? 'cors-issue' : 'offline';
    }
    return 'offline';
  }
}; 