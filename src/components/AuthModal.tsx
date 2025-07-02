import React, { useState } from 'react';
import { 
  XMarkIcon,
  WalletIcon,
  CodeBracketIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';
import WalletConnection from './WalletConnection';
import SocialLogin from './SocialLogin';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

type AuthMode = 'choose' | 'wallet' | 'social';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, onError }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('choose');
  const [error, setError] = useState<string | null>(null);

  // Production ready modal

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
    setAuthMode('choose');
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    onError?.(errorMessage);
  };

  const handleClose = () => {
    onClose();
    setAuthMode('choose');
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-karma-100">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-karma-900 rounded-lg flex items-center justify-center">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-karma-900">
              {authMode === 'choose' && 'Connect to UmiKarma'}
              {authMode === 'wallet' && 'Connect Wallet'}
              {authMode === 'social' && 'Connect GitHub'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-karma-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-karma-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {authMode === 'choose' && (
            <div>
              <div className="text-center mb-6">
                <p className="text-karma-600">
                  Choose how you'd like to connect to start building your reputation
                </p>
              </div>

              <div className="space-y-4">
                {/* Wallet Option */}
                <button
                  onClick={() => setAuthMode('wallet')}
                  className="w-full p-6 border-2 border-karma-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-primary-100 group-hover:bg-primary-200 rounded-lg flex items-center justify-center transition-colors">
                      <WalletIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-karma-900 mb-1">Connect Wallet</h3>
                      <p className="text-sm text-karma-600 mb-2">
                        Use your Web3 wallet to prove ownership and track on-chain activity
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-karma-100 text-karma-700 px-2 py-1 rounded">MetaMask</span>
                        <span className="text-xs bg-karma-100 text-karma-700 px-2 py-1 rounded">WalletConnect</span>
                        <span className="text-xs bg-karma-100 text-karma-700 px-2 py-1 rounded">Coinbase</span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* GitHub Option */}
                <button
                  onClick={() => setAuthMode('social')}
                  className="w-full p-6 border-2 border-karma-200 rounded-xl hover:border-accent-300 hover:bg-accent-50 transition-all text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-accent-100 group-hover:bg-accent-200 rounded-lg flex items-center justify-center transition-colors">
                      <CodeBracketIcon className="h-6 w-6 text-accent-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-karma-900 mb-1">Connect GitHub</h3>
                      <p className="text-sm text-karma-600 mb-2">
                        Link your GitHub account to automatically track code contributions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-karma-100 text-karma-700 px-2 py-1 rounded">Repositories</span>
                        <span className="text-xs bg-karma-100 text-karma-700 px-2 py-1 rounded">Commits</span>
                        <span className="text-xs bg-karma-100 text-karma-700 px-2 py-1 rounded">Issues</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-karma-100">
                <p className="text-xs text-karma-500 text-center">
                  💡 Pro tip: Connect both wallet + GitHub for maximum karma and trust scores!
                </p>
              </div>
            </div>
          )}

          {authMode === 'wallet' && (
            <div>
              <div className="mb-4">
                <button
                  onClick={() => setAuthMode('choose')}
                  className="text-sm text-karma-600 hover:text-karma-900 flex items-center space-x-1"
                >
                  <span>← Back to options</span>
                </button>
              </div>
              <WalletConnection onSuccess={handleSuccess} onError={handleError} />
            </div>
          )}

          {authMode === 'social' && (
            <div>
              <div className="mb-4">
                <button
                  onClick={() => setAuthMode('choose')}
                  className="text-sm text-karma-600 hover:text-karma-900 flex items-center space-x-1"
                >
                  <span>← Back to options</span>
                </button>
              </div>
              <SocialLogin onSuccess={handleSuccess} onError={handleError} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 