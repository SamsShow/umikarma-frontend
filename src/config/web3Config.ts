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
      http: ['https://devnet.uminetwork.com/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Umi Explorer',
      url: 'https://devnet.explorer.uminetwork.com',
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
    [umiDevnet.id]: http('https://devnet.uminetwork.com/', {
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
    blockExplorers: ['https://devnet.explorer.uminetwork.com'],
    rpcUrl: 'https://devnet.uminetwork.com/',
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

export const networks = {
  UMI_NETWORK: {
    chainId: '0x539', // 1337 in hex
    chainName: 'Umi Network EVM',
    rpcUrls: ['https://ethereum.uminetwork.com/'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://explorer.uminetwork.com/'],
  },
  POLYGON_AMOY: {
    chainId: '0x13882', // 80002 in hex
    chainName: 'Polygon Amoy Testnet',
    rpcUrls: ['https://rpc-amoy.polygon.technology/'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    blockExplorerUrls: ['https://amoy.polygonscan.com/'],
  },
};

// Contract addresses by network
export const contractAddresses = {
  UMI_NETWORK: {
    ReputationRegistry: '0xb27dcfA63e6A6bb8000212F82a51eb93C8F541dF',
    KarmaScorer: '0x782b79661679ADCC90af2476B14DE105B6186562',
    // AccessController not deployed due to gas issues
  },
  POLYGON_AMOY: {
    // Fallback network for testing
    ReputationRegistry: '',
    KarmaScorer: '',
    AccessController: '',
  },
};

// Default network configuration
export const defaultNetwork = networks.UMI_NETWORK;
export const defaultChainId = '0x539'; // Umi Network EVM

// Helper functions
export const getNetworkByChainId = (chainId: string) => {
  const networkEntry = Object.entries(networks).find(
    ([, network]) => network.chainId === chainId
  );
  return networkEntry ? networkEntry[1] : null;
};

export const getContractAddresses = (chainId: string) => {
  switch (chainId) {
    case '0x539': // Umi Network EVM
      return contractAddresses.UMI_NETWORK;
    case '0x13882': // Polygon Amoy
      return contractAddresses.POLYGON_AMOY;
    default:
      return contractAddresses.UMI_NETWORK; // Default to Umi Network
  }
};

export const isValidNetwork = (chainId: string): boolean => {
  return Object.values(networks).some(network => network.chainId === chainId);
}; 