import React from 'react';
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

interface ContractErrorProps {
  error: Error | null;
  isContractDeployed: boolean;
  onRetry?: () => void;
  className?: string;
}

const ContractError: React.FC<ContractErrorProps> = ({ 
  error, 
  isContractDeployed, 
  onRetry, 
  className = '' 
}) => {
  if (!error && isContractDeployed) return null;

  // Different error types and messages
  const getErrorInfo = () => {
    if (!isContractDeployed) {
      return {
        type: 'deployment',
        title: 'Contracts Not Deployed',
        message: 'Smart contracts are still being deployed to Umi Devnet. Please wait for deployment confirmation.',
        color: 'blue',
        icon: InformationCircleIcon,
        showRetry: false
      };
    }

    if (!error) return null;

    // Parse common error types
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('user rejected') || errorMessage.includes('user denied')) {
      return {
        type: 'rejected',
        title: 'Transaction Rejected',
        message: 'You rejected the transaction in your wallet. Please try again if you want to proceed.',
        color: 'amber',
        icon: ExclamationTriangleIcon,
        showRetry: true
      };
    }

    if (errorMessage.includes('insufficient funds')) {
      return {
        type: 'funds',
        title: 'Insufficient Funds',
        message: 'You don\'t have enough ETH to pay for the transaction. Get some test ETH from the Umi faucet.',
        color: 'red',
        icon: ExclamationTriangleIcon,
        showRetry: false
      };
    }

    if (errorMessage.includes('network') || errorMessage.includes('rpc')) {
      return {
        type: 'network',
        title: 'Network Error',
        message: 'Unable to connect to Umi Devnet. Check your network connection and try again.',
        color: 'red',
        icon: ExclamationTriangleIcon,
        showRetry: true
      };
    }

    if (errorMessage.includes('contract not deployed')) {
      return {
        type: 'deployment',
        title: 'Contract Not Available',
        message: 'Smart contract is not deployed yet. Please wait for deployment to complete.',
        color: 'blue',
        icon: InformationCircleIcon,
        showRetry: true
      };
    }

    // Generic error
    return {
      type: 'generic',
      title: 'Transaction Failed',
      message: error.message || 'An unexpected error occurred. Please try again.',
      color: 'red',
      icon: ExclamationTriangleIcon,
      showRetry: true
    };
  };

  const errorInfo = getErrorInfo();
  if (!errorInfo) return null;

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-500',
      title: 'text-blue-800',
      message: 'text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-500',
      title: 'text-amber-800',
      message: 'text-amber-700',
      button: 'bg-amber-600 hover:bg-amber-700'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-500',
      title: 'text-red-800',
      message: 'text-red-700',
      button: 'bg-red-600 hover:bg-red-700'
    }
  };

  const colors = colorClasses[errorInfo.color as keyof typeof colorClasses];
  const IconComponent = errorInfo.icon;

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <IconComponent className={`h-5 w-5 ${colors.icon} mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <h4 className={`font-medium ${colors.title} text-sm mb-1`}>
            {errorInfo.title}
          </h4>
          <p className={`${colors.message} text-sm`}>
            {errorInfo.message}
          </p>
          
          {/* Helpful links based on error type */}
          {errorInfo.type === 'funds' && (
            <div className="mt-2">
              <a 
                href="https://faucet.umi.network" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center text-xs ${colors.title} hover:underline`}
              >
                Get test ETH from Umi faucet →
              </a>
            </div>
          )}

          {errorInfo.type === 'network' && (
            <div className="mt-2 text-xs space-y-1">
              <p className={colors.message}>
                • Check if you're connected to Umi Devnet (Chain ID: 42069)
              </p>
              <p className={colors.message}>
                • Try switching to Polygon Amoy as a fallback network
              </p>
            </div>
          )}

          {/* Retry button */}
          {errorInfo.showRetry && onRetry && (
            <div className="mt-3">
              <button
                onClick={onRetry}
                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium text-white ${colors.button} rounded transition-colors`}
              >
                <ArrowPathIcon className="h-3 w-3 mr-1" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractError; 