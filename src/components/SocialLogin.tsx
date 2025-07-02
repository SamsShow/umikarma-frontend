import React, { useEffect, useState } from 'react';
import { 
  CodeBracketIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon 
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import { AuthService } from '../services/authService';

interface SocialLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ onSuccess, onError }) => {
  const { user, connectGitHub, setLoading, loading, logout } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Handle GitHub OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const { isCallback, code, state } = AuthService.isGitHubCallback();
      
      if (isCallback && code && state) {
        console.log('🎯 OAuth callback detected in component');
        
        // Check if we've already processed this callback in this session
        const sessionKey = `github_oauth_session_${code.substring(0, 10)}`;
        if (sessionStorage.getItem(sessionKey)) {
          console.log('🔄 OAuth callback already processed in this session, skipping');
          return;
        }
        
        // Mark as processed for this session
        sessionStorage.setItem(sessionKey, 'true');
        
        setLoading(true);
        setError(null);
        
        try {
          const githubUser = await AuthService.handleGitHubCallback(code, state);
          
          if (githubUser) {
            // Extract the GitHub data from the AuthUser object
            if (githubUser.githubData) {
              connectGitHub(
                githubUser.githubData,
                {
                  karmaScore: githubUser.karmaScore,
                  trustFactor: githubUser.trustFactor,
                  totalContributions: githubUser.totalContributions,
                }
              );
              
              if (onSuccess) {
                onSuccess();
              }
            } else {
              setError('GitHub authentication data is incomplete. Please try again.');
            }
          } else {
            // Show a more helpful error message when GitHub auth fails
            setError('GitHub authentication failed. Please try again or contact support.');
          }
        } catch (err) {
          console.error('GitHub OAuth error:', err);
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(`Authentication error: ${errorMessage}. Try clearing your browser cookies and cache.`);
          
          if (onError) {
            onError(errorMessage);
          }
        } finally {
          setLoading(false);
          
          // Always clean up URL after processing
          if (window.location.search.includes('code=')) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      }
    };
    
    handleCallback();
  }, [connectGitHub, onError, onSuccess, setLoading]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // No need to clear OAuth state anymore since we're using a stateless approach
      AuthService.initiateGitHubLogin();
      // No need to set loading to false here since we're redirecting
    } catch (err) {
      console.error('Failed to initiate GitHub login:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to start GitHub login: ${errorMessage}`);
      setLoading(false);
      
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const handleDisconnect = () => {
    // If user has both wallet and GitHub, only remove GitHub part
    if (user?.type === 'combined' && user.walletAddress) {
      // Keep wallet data but remove GitHub
      const walletOnlyUser = {
        id: `wallet_${user.walletAddress}`,
        type: 'wallet' as const,
        walletAddress: user.walletAddress,
        karmaScore: user.karmaScore ? Math.max(user.karmaScore - 5, 0) : 65,
        trustFactor: user.trustFactor ? Math.max(user.trustFactor - 0.1, 0.5) : 0.75,
        totalContributions: user.totalContributions,
      };
      
      useAuthStore.getState().setUser(walletOnlyUser);
    } else {
      // Complete logout if no wallet connection
      logout();
    }
  };

  // Check if GitHub is connected (either GitHub-only or combined)
  const isGitHubConnected = user && user.githubData;

  // If user is already connected via GitHub
  if (isGitHubConnected && user.githubData) {
    return (
      <div className="clean-card max-w-md mx-auto">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircleIcon className="h-8 w-8 text-accent-500" />
          <div>
            <h3 className="font-semibold text-karma-900">GitHub Connected</h3>
            <p className="text-sm text-karma-600">@{user.githubData.username}</p>
            {user.type === 'combined' && (
              <p className="text-xs text-primary-600 font-medium">🔗 Combined with Wallet</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={user.githubData.avatar_url}
            alt={user.githubData.name}
            className="h-16 w-16 rounded-full border-2 border-karma-200"
          />
          <div className="flex-1">
            <h4 className="font-medium text-karma-900">{user.githubData.name}</h4>
            <p className="text-sm text-karma-600 mb-2">@{user.githubData.username}</p>
            <div className="flex items-center space-x-4 text-xs text-karma-500">
              <span>{user.githubData.public_repos} repos</span>
              <span>{user.githubData.followers} followers</span>
              <span>{user.githubData.following} following</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleDisconnect}
          className="btn-secondary w-full"
        >
          {user.type === 'combined' ? 'Disconnect GitHub (Keep Wallet)' : 'Disconnect GitHub'}
        </button>
      </div>
    );
  }

  return (
    <div className="clean-card max-w-md mx-auto">
      <div className="text-center mb-6">
        <CodeBracketIcon className="h-12 w-12 text-karma-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-karma-900 mb-2">
          Connect with GitHub
        </h3>
        <p className="text-karma-600">
          {user?.type === 'wallet' ? 
            'Connect GitHub to boost your karma score!' : 
            'Link your GitHub account to automatically track your contributions'
          }
        </p>
        {user?.type === 'wallet' && (
          <p className="text-sm text-primary-600 mt-2 font-medium">
            🎯 Adding GitHub to existing wallet profile
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center space-x-3 p-4 bg-karma-900 hover:bg-karma-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <CodeBracketIcon className="h-5 w-5" />
            <span>Continue with GitHub</span>
          </>
        )}
      </button>

      <div className="mt-4 p-4 bg-accent-50 rounded-lg">
        <h4 className="font-medium text-accent-900 mb-2 flex items-center">
          <UserIcon className="h-4 w-4 mr-2" />
          What we'll access:
        </h4>
        <ul className="text-sm text-accent-700 space-y-1">
          <li>• Your public profile information</li>
          <li>• Your public repositories and contributions</li>
          <li>• Your email address (if public)</li>
          <li>• Repository activity and commit history</li>
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-karma-100">
        <p className="text-xs text-karma-500 text-center">
          We only access public information and never modify your repositories
        </p>
      </div>
    </div>
  );
};

export default SocialLogin; 