import React, { useState, useEffect } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { PlusCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { umiDevnet, supportedChains } from '../config/web3Config';
import { polygonAmoy } from 'wagmi/chains';

const NetworkSwitcher: React.FC = () => {
  const { chain } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const [umiRpcStatus, setUmiRpcStatus] = useState<'checking' | 'online' | 'cors-issue' | 'offline'>('checking');

  // Check Umi Devnet RPC status with better error detection
  useEffect(() => {
    const checkUmiRpc = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch('https://devnet.uminetwork.com/', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1
          }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          if (data.result) {
            setUmiRpcStatus('online');
          } else {
            setUmiRpcStatus('cors-issue');
          }
        } else {
          setUmiRpcStatus('cors-issue');
        }
      } catch (error: any) {
        console.warn('Umi Devnet RPC check failed:', error);
        
        // Distinguish between different types of errors
        if (error.name === 'AbortError') {
          setUmiRpcStatus('offline');
        } else if (error.message?.includes('CORS') || error.message?.includes('fetch')) {
          setUmiRpcStatus('cors-issue');
        } else {
          setUmiRpcStatus('offline');
        }
      }
    };

    checkUmiRpc();
    
    // Recheck every 30 seconds
    const interval = setInterval(checkUmiRpc, 30000);
    return () => clearInterval(interval);
  }, []);

  const addUmiNetwork = async () => {
    if (!window.ethereum) {
      alert('Please install a Web3 wallet like MetaMask or Rabby');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${umiDevnet.id.toString(16)}`, // 0xa455 for 42069
          chainName: umiDevnet.name,
          nativeCurrency: umiDevnet.nativeCurrency,
          rpcUrls: umiDevnet.rpcUrls.default.http,
          blockExplorerUrls: umiDevnet.blockExplorers?.default ? [umiDevnet.blockExplorers.default.url] : [],
        }],
      });
    } catch (error) {
      console.error('Failed to add Umi Network:', error);
    }
  };

  const addPolygonAmoy = async () => {
    if (!window.ethereum) {
      alert('Please install a Web3 wallet like MetaMask or Rabby');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${polygonAmoy.id.toString(16)}`,
          chainName: polygonAmoy.name,
          nativeCurrency: polygonAmoy.nativeCurrency,
          rpcUrls: polygonAmoy.rpcUrls.default.http,
          blockExplorerUrls: polygonAmoy.blockExplorers?.default ? [polygonAmoy.blockExplorers.default.url] : [],
        }],
      });
    } catch (error) {
      console.error('Failed to add Polygon Amoy:', error);
    }
  };

  const handleSwitchToUmi = () => {
    if (switchChain) {
      switchChain({ chainId: umiDevnet.id });
    }
  };

  const handleSwitchToAmoy = () => {
    if (switchChain) {
      switchChain({ chainId: polygonAmoy.id });
    }
  };

  const isOnUmiNetwork = chain?.id === umiDevnet.id;
  const isOnPolygonAmoy = chain?.id === polygonAmoy.id;

  if (isOnUmiNetwork) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-accent-600 bg-accent-50 px-3 py-2 rounded-lg">
          <div className="h-2 w-2 bg-accent-500 rounded-full"></div>
          <span>Connected to Umi Devnet</span>
        </div>
        {(umiRpcStatus === 'offline' || umiRpcStatus === 'cors-issue') && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
            <div className="flex items-center space-x-2">
              <XCircleIcon className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-amber-800">
                {umiRpcStatus === 'cors-issue' 
                  ? 'Note: RPC accessible but may have CORS restrictions from browser. Try using wallet injection.'
                  : 'Note: Umi Devnet RPC appears to be offline. You may experience connection issues.'
                }
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isOnPolygonAmoy) {
    return (
      <div className="flex items-center space-x-2 text-sm text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
        <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
        <span>Connected to Polygon Amoy (Fallback)</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {chain && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-amber-800">
              Currently on {chain.name} (Chain ID: {chain.id})
            </span>
          </div>
        </div>
      )}

      {/* Umi Devnet Status and Actions */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-karma-900">Umi Devnet (Primary)</h3>
          <div className="flex items-center space-x-2">
            {umiRpcStatus === 'checking' && (
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
            )}
            {umiRpcStatus === 'online' && (
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            )}
            {umiRpcStatus === 'cors-issue' && (
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            )}
            {umiRpcStatus === 'offline' && (
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
            )}
            <span className="text-xs text-karma-600">
              {umiRpcStatus === 'checking' ? 'Checking...' : 
               umiRpcStatus === 'online' ? 'Online' :
               umiRpcStatus === 'cors-issue' ? 'CORS Issue' : 'Offline'}
            </span>
          </div>
        </div>

        {umiRpcStatus === 'cors-issue' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
              <div className="text-xs text-yellow-800">
                <p className="font-medium">RPC responds but has browser restrictions</p>
                <p>The wallet injection should handle this automatically. You can still connect and use Umi Devnet.</p>
              </div>
            </div>
          </div>
        )}

        {umiRpcStatus === 'offline' && (
          <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
            <div className="flex items-center space-x-2">
              <XCircleIcon className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-800">
                Umi Devnet RPC is currently offline. Try the fallback network below.
              </span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={addUmiNetwork}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-100 hover:bg-primary-200 text-primary-800 rounded-lg transition-colors text-sm"
          >
            <PlusCircleIcon className="h-4 w-4" />
            <span>Add Umi Network</span>
          </button>
          
          <button
            onClick={handleSwitchToUmi}
            disabled={isPending || umiRpcStatus === 'offline'}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            {isPending ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Switch to Umi Devnet</span>
            )}
          </button>
        </div>

        <div className="text-xs text-karma-500 mt-2">
          <p><strong>Network Details:</strong></p>
          <ul className="mt-1 space-y-1">
            <li>• Chain ID: 42069</li>
                            <li>• RPC URL: https://devnet.uminetwork.com/</li>
            <li>• Currency: ETH</li>
                            <li>• Explorer: https://devnet.explorer.uminetwork.com</li>
          </ul>
        </div>
      </div>

      {/* Polygon Amoy Fallback */}
      <div className="border rounded-lg p-4 bg-purple-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-purple-900">Polygon Amoy Testnet (Fallback)</h3>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-purple-600">Online</span>
          </div>
        </div>

        <p className="text-xs text-purple-700 mb-3">
          {umiRpcStatus === 'cors-issue' 
            ? 'Use this network if you encounter browser restrictions with Umi Devnet.'
            : 'Use this network while Umi Devnet is offline. All wallet features will work normally.'
          }
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={addPolygonAmoy}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg transition-colors text-sm"
          >
            <PlusCircleIcon className="h-4 w-4" />
            <span>Add Polygon Amoy</span>
          </button>
          
          <button
            onClick={handleSwitchToAmoy}
            disabled={isPending}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            {isPending ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Switch to Polygon Amoy</span>
            )}
          </button>
        </div>

        <div className="text-xs text-purple-600 mt-2">
          <p><strong>Network Details:</strong></p>
          <ul className="mt-1 space-y-1">
            <li>• Chain ID: 80002</li>
            <li>• Currency: MATIC</li>
            <li>• Explorer: https://amoy.polygonscan.com</li>
            <li>• Faucet: https://faucet.polygon.technology</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NetworkSwitcher; 