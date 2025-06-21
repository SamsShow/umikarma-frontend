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
  const { user, setUser, setLoading, loading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Handle GitHub OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const { isCallback, code, state } = AuthService.isGitHubCallback();
      
      if (isCallback && code && state) {
        setLoading(true);
        setError(null);
        
        try {
          const authUser = await AuthService.handleGitHubCallback(code, state);
          
          if (authUser) {
            setUser(authUser);
            onSuccess?.();
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            throw new Error('Failed to authenticate with GitHub');
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
          setError(errorMessage);
          onError?.(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    };

    handleCallback();
  }, [setUser, setLoading, onSuccess, onError]);

  const handleGitHubLogin = () => {
    if (loading) return;
    
    setError(null);
    AuthService.initiateGitHubLogin();
  };

  const handleDisconnect = () => {
    setUser(null);
  };

  // If user is already connected via GitHub
  if (user && user.type === 'github' && user.githubData) {
    return (
      <div className="clean-card max-w-md mx-auto">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircleIcon className="h-8 w-8 text-accent-500" />
          <div>
            <h3 className="font-semibold text-karma-900">GitHub Connected</h3>
            <p className="text-sm text-karma-600">@{user.githubData.username}</p>
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
          Disconnect GitHub
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
          Link your GitHub account to automatically track your contributions
        </p>
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
        onClick={handleGitHubLogin}
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