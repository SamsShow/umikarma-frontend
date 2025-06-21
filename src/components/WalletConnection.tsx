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
import { AuthService } from '../services/authService';
import NetworkSwitcher from './NetworkSwitcher';

interface WalletConnectionProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ onSuccess, onError }) => {
  const { address, isConnected, chain } = useAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { setUser, setLoading, user } = useAuthStore();
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
        // Create wallet user and fetch profile data
        const walletUser = AuthService.createWalletUser(address, chain?.id);
        
        // Simulate fetching additional profile data with error handling
        AuthService.fetchUserProfile(walletUser.id)
          .then((profileData) => {
            if (profileData) {
              setUser({ ...walletUser, ...profileData });
            } else {
              setUser(walletUser);
            }
            setLoading(false);
            setConnectionProcessed(true);
            isProcessingConnection.current = false;
            onSuccessRef.current?.();
          })
          .catch((err) => {
            console.error('Error fetching profile:', err);
            setUser(walletUser);
            setLoading(false);
            setConnectionProcessed(true);
            isProcessingConnection.current = false;
            onSuccessRef.current?.();
          });
      } catch (err) {
        console.error('Error creating wallet user:', err);
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
  }, [isConnected, address, chain?.id, connectionProcessed, setUser, setLoading]);

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
    setUser(null);
    setConnectionProcessed(false);
    isProcessingConnection.current = false;
  }, [disconnect, setUser]);

  if (isConnected && address) {
    return (
      <div className="clean-card max-w-md mx-auto">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircleIcon className="h-8 w-8 text-accent-500" />
          <div>
            <h3 className="font-semibold text-karma-900">Wallet Connected</h3>
            <p className="text-sm text-karma-600">Chain: {chain?.name || 'Unknown'}</p>
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
          Disconnect Wallet
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
          Connect to access your UmiKarma reputation profile
        </p>
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

        <div className="border-t border-karma-100 pt-4">
          <NetworkSwitcher />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-karma-100">
        <div className="text-xs text-karma-500 text-center space-y-1">
          <p>
            <strong>Umi Devnet:</strong> Get test ETH from{' '}
            <a 
              href="https://devnet.explorer.moved.network" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Umi Explorer
            </a>
          </p>
          <p>
            <strong>Polygon Amoy:</strong> Get test MATIC from{' '}
            <a 
              href="https://faucet.polygon.technology" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Polygon Faucet
            </a>
          </p>
          <p>By connecting, you agree to UmiKarma's Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection; 