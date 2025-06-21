/// <reference types="react-scripts" />

// Extend the Window interface to include ethereum object
declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: Array<{
          chainId: string;
          chainName: string;
          nativeCurrency: {
            name: string;
            symbol: string;
            decimals: number;
          };
          rpcUrls: string[];
          blockExplorerUrls?: string[];
        }>;
      }) => Promise<any>;
      isMetaMask?: boolean;
      selectedAddress?: string;
    };
  }
}
