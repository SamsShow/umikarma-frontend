import React, { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  UserPlusIcon,
  ClockIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { CONTRACT_ADDRESSES, DEPLOYMENT_CONFIG } from '../config/contracts';
import { 
  useIsUserRegistered, 
  useRegisterUser, 
  useUserProfile,
  formatKarmaScore,
  formatTrustFactor
} from '../services/contractService';

interface ContractStatusProps {
  className?: string;
}

const ContractStatus: React.FC<ContractStatusProps> = ({ className = '' }) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [githubHandle, setGithubHandle] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Contract status checks
  const contractsDeployed = !!(
    CONTRACT_ADDRESSES.REPUTATION_REGISTRY && 
    CONTRACT_ADDRESSES.KARMA_SCORER && 
    CONTRACT_ADDRESSES.ACCESS_CONTROLLER
  );

  const isCorrectNetwork = chainId === DEPLOYMENT_CONFIG.CHAIN_ID;

  // User registration status
  const { isRegistered, isLoading: isCheckingRegistration } = useIsUserRegistered(address);
  const { profile, isLoading: isLoadingProfile } = useUserProfile(address);
  const { 
    registerUser, 
    isPending: isRegistering, 
    isConfirming, 
    isConfirmed, 
    error: registrationError 
  } = useRegisterUser();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubHandle.trim()) return;
    
    try {
      registerUser(githubHandle.trim());
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  // Reset form after successful registration
  React.useEffect(() => {
    if (isConfirmed) {
      setGithubHandle('');
      setShowRegisterForm(false);
    }
  }, [isConfirmed]);

  if (!isConnected) {
    return (
      <div className={`clean-card ${className}`}>
        <div className="text-center py-6">
          <InformationCircleIcon className="h-12 w-12 text-karma-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-karma-900 mb-2">
            Smart Contract Status
          </h3>
          <p className="text-karma-600">Connect your wallet to view contract status</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`clean-card ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-karma-900 mb-4">
          Smart Contract Status
        </h3>

        {/* Network Status */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 bg-karma-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {isCorrectNetwork ? (
                <CheckCircleIcon className="h-5 w-5 text-accent-500" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
              )}
              <span className="text-sm font-medium">Network</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono">
                {isCorrectNetwork ? 'Umi Devnet' : `Chain ${chainId}`}
              </p>
              {!isCorrectNetwork && (
                <p className="text-xs text-amber-600">Switch to Umi Devnet</p>
              )}
            </div>
          </div>

          {/* Contract Deployment Status */}
          <div className="flex items-center justify-between p-3 bg-karma-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {contractsDeployed ? (
                <CheckCircleIcon className="h-5 w-5 text-accent-500" />
              ) : (
                <ClockIcon className="h-5 w-5 text-amber-500" />
              )}
              <span className="text-sm font-medium">Contracts</span>
            </div>
            <div className="text-right">
              <p className="text-sm">
                {contractsDeployed ? 'Deployed' : 'Pending'}
              </p>
              {!contractsDeployed && (
                <p className="text-xs text-amber-600">Awaiting confirmation</p>
              )}
            </div>
          </div>
        </div>

        {/* Contract Addresses (if deployed) */}
        {contractsDeployed && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-karma-700 mb-3">Contract Addresses</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-karma-600">ReputationRegistry:</span>
                <code className="text-karma-900 bg-karma-100 px-2 py-1 rounded">
                  {CONTRACT_ADDRESSES.REPUTATION_REGISTRY.slice(0, 8)}...
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-karma-600">KarmaScorer:</span>
                <code className="text-karma-900 bg-karma-100 px-2 py-1 rounded">
                  {CONTRACT_ADDRESSES.KARMA_SCORER.slice(0, 8)}...
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-karma-600">AccessController:</span>
                <code className="text-karma-900 bg-karma-100 px-2 py-1 rounded">
                  {CONTRACT_ADDRESSES.ACCESS_CONTROLLER.slice(0, 8)}...
                </code>
              </div>
            </div>
          </div>
        )}

        {/* User Registration Status */}
        {contractsDeployed && isCorrectNetwork && (
          <div className="border-t border-karma-200 pt-6">
            <h4 className="text-sm font-semibold text-karma-700 mb-4">Registration Status</h4>
            
            {isCheckingRegistration ? (
              <div className="flex items-center space-x-2 text-karma-600">
                <ClockIcon className="h-4 w-4 animate-spin" />
                <span className="text-sm">Checking registration...</span>
              </div>
            ) : isRegistered ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-accent-50 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-accent-500" />
                  <div>
                    <p className="text-sm font-medium text-accent-900">Registered</p>
                    <p className="text-xs text-accent-700">Your wallet is registered on-chain</p>
                  </div>
                </div>

                {/* Show profile data if available */}
                {profile && !isLoadingProfile && (
                  <div className="bg-karma-50 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-karma-900 mb-3">On-Chain Profile</h5>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-karma-600">Karma Score:</span>
                        <div className="font-medium text-karma-900">
                          {formatKarmaScore(profile.karmaScore)}/100
                        </div>
                      </div>
                      <div>
                        <span className="text-karma-600">Trust Factor:</span>
                        <div className="font-medium text-karma-900">
                          {formatTrustFactor(profile.trustFactor)}
                        </div>
                      </div>
                      <div>
                        <span className="text-karma-600">Contributions:</span>
                        <div className="font-medium text-karma-900">
                          {profile.totalContributions}
                        </div>
                      </div>
                      <div>
                        <span className="text-karma-600">Verified:</span>
                        <div className="font-medium">
                          {profile.isVerified ? (
                            <span className="text-accent-600">✓ Yes</span>
                          ) : (
                            <span className="text-amber-600">⏳ Pending</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {profile.githubHandle && (
                      <div className="mt-3 pt-3 border-t border-karma-200">
                        <span className="text-karma-600 text-xs">GitHub Handle:</span>
                        <div className="font-medium text-karma-900 text-sm">
                          @{profile.githubHandle}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                  <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">Not Registered</p>
                    <p className="text-xs text-amber-700">Register to access UmiKarma features</p>
                  </div>
                </div>

                {!showRegisterForm ? (
                  <button
                    onClick={() => setShowRegisterForm(true)}
                    className="w-full flex items-center justify-center space-x-2 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    <UserPlusIcon className="h-4 w-4" />
                    <span>Register Wallet</span>
                  </button>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label htmlFor="githubHandle" className="block text-sm font-medium text-karma-700 mb-2">
                        GitHub Handle (optional)
                      </label>
                      <input
                        type="text"
                        id="githubHandle"
                        value={githubHandle}
                        onChange={(e) => setGithubHandle(e.target.value)}
                        placeholder="your-github-username"
                        className="w-full px-3 py-2 border border-karma-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <p className="text-xs text-karma-500 mt-1">
                        Link your GitHub for enhanced karma tracking
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowRegisterForm(false)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-karma-700 bg-karma-100 hover:bg-karma-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isRegistering || isConfirming}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        {isRegistering ? 'Signing...' : isConfirming ? 'Confirming...' : 'Register'}
                      </button>
                    </div>

                    {registrationError && (
                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                        Registration failed: {registrationError.message}
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* Deployment Progress Notice */}
        {!contractsDeployed && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">Using Demo Data</p>
                <p className="text-blue-700 text-xs">
                  Smart contracts are being deployed to Umi Devnet. While waiting for deployment, 
                  you can explore the full UmiKarma experience with demonstration data. 
                  Real blockchain integration will be available once contracts are confirmed.
                </p>
                <div className="mt-2 text-xs text-blue-600">
                  <p>Status: Enjoying the full demo experience with mock data</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractStatus; 