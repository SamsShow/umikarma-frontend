import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { 
  WalletIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import NetworkSwitcher from './NetworkSwitcher';

interface WalletConnectionProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ onSuccess, onError }) => {
  const { address, isConnected, chain } = useAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { connectWallet, setLoading, user, logout } = useAuthStore();
  const [showRpcNotice, setShowRpcNotice] = useState(true);
  const [connectionProcessed, setConnectionProcessed] = useState(false);
  const isProcessingConnection = useRef(false);

  // Stabilize callback refs to prevent infinite loops
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  // Handle wallet connection with proper error handling and loop prevention
  useEffect(() => {
    if (isConnected && address && !connectionProcessed && !isProcessingConnection.current) {
      isProcessingConnection.current = true;
      setLoading(true);
      
      try {
        // Use the new connectWallet method that handles merging
        connectWallet(address, chain?.id);
        
        setLoading(false);
        setConnectionProcessed(true);
        isProcessingConnection.current = false;
        onSuccessRef.current?.();
      } catch (err) {
        console.error('Error connecting wallet:', err);
        setLoading(false);
        setConnectionProcessed(true);
        isProcessingConnection.current = false;
        onErrorRef.current?.('Failed to process wallet connection');
      }
    }
    
    // Reset processed state when wallet disconnects
    if (!isConnected || !address) {
      setConnectionProcessed(false);
      isProcessingConnection.current = false;
    }
  }, [isConnected, address, chain?.id, connectionProcessed, connectWallet, setLoading]);

  const handleConnect = async () => {
    try {
      setConnectionProcessed(false); // Reset for new connection
      await open();
    } catch (err) {
      console.error('Connection error:', err);
      onErrorRef.current?.('Failed to open wallet connection');
    }
  };

  const handleDisconnect = useCallback(() => {
    disconnect();
    
    // If user has both wallet and GitHub, only remove wallet part
    if (user?.type === 'combined' && user.githubData) {
      // Keep GitHub data but remove wallet
      const githubOnlyUser = {
        id: `github_${user.githubData.username}`,
        type: 'github' as const,
        githubData: user.githubData,
        karmaScore: user.karmaScore ? Math.max(user.karmaScore - 5, 0) : 75,
        trustFactor: user.trustFactor ? Math.max(user.trustFactor - 0.1, 0.5) : 0.8,
        totalContributions: user.totalContributions,
      };
      
      useAuthStore.getState().setUser(githubOnlyUser);
    } else {
      // Complete logout if no GitHub connection
      logout();
    }
    
    setConnectionProcessed(false);
    isProcessingConnection.current = false;
  }, [disconnect, user, logout]);

  // Check if wallet is connected (either wallet-only or combined)
  const isWalletConnected = isConnected && address && (user?.walletAddress === address);

  if (isWalletConnected) {
    return (
      <div className="clean-card max-w-md mx-auto">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircleIcon className="h-8 w-8 text-accent-500" />
          <div>
            <h3 className="font-semibold text-karma-900">Wallet Connected</h3>
            <p className="text-sm text-karma-600">Chain: {chain?.name || 'Unknown'}</p>
            {user?.type === 'combined' && (
              <p className="text-xs text-accent-600 font-medium">✨ Combined with GitHub</p>
            )}
          </div>
        </div>
        
        <div className="bg-karma-50 rounded-lg p-4 mb-4">
          <p className="text-xs text-karma-500 mb-1">Connected Address</p>
          <p className="font-mono text-sm text-karma-900 break-all">
            {address}
          </p>
        </div>

        <div className="mb-4">
          <NetworkSwitcher />
        </div>

        <button 
          onClick={handleDisconnect}
          className="btn-secondary w-full"
        >
          {user?.type === 'combined' ? 'Disconnect Wallet (Keep GitHub)' : 'Disconnect Wallet'}
        </button>
      </div>
    );
  }

  // Check if WalletConnect is properly configured
  const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID;
  const isConfigured = projectId && projectId !== '' && projectId !== 'your-project-id-here';

  return (
    <div className="clean-card max-w-md mx-auto">
      <div className="text-center mb-6">
        <WalletIcon className="h-12 w-12 text-karma-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-karma-900 mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-karma-600">
          {user?.type === 'github' ? 
            'Connect your wallet to boost your karma score!' : 
            'Connect to access your UmiKarma reputation profile'
          }
        </p>
        {user?.type === 'github' && (
          <p className="text-sm text-accent-600 mt-2 font-medium">
            🎯 Adding wallet to existing GitHub profile
          </p>
        )}
      </div>

      {/* RPC Status Notice */}
      {showRpcNotice && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-2">
            <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-blue-800 text-sm">Umi Network Status</p>
                <button 
                  onClick={() => setShowRpcNotice(false)}
                  className="text-blue-400 hover:text-blue-600 text-sm"
                >
                  ×
                </button>
              </div>
              <p className="text-blue-700 text-xs mt-1">
                Umi Devnet RPC is online but may have browser restrictions. 
                <strong> Wallet injection bypasses this</strong> - you can connect normally! 
                Alternatively, use <strong>Polygon Amoy</strong> as a fallback.
              </p>
            </div>
          </div>
        </div>
      )}

      {!isConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 mb-1">Configuration Required</p>
              <p className="text-amber-700">
                WalletConnect Project ID is missing. Get one from{' '}
                <a 
                  href="https://cloud.walletconnect.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-900"
                >
                  WalletConnect Cloud
                </a>
                {' '}and add it to your .env.local file.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleConnect}
          className="w-full flex items-center justify-center space-x-3 p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          <WalletIcon className="h-5 w-5" />
          <span>Connect Wallet</span>
        </button>

        <div className="text-center">
          <p className="text-xs text-karma-500">
            Supports MetaMask, WalletConnect, Coinbase Wallet and more
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection; 