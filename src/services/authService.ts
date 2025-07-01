import { AuthUser } from '../store/authStore';
import { githubApiService, GitHubUserSummary } from './githubApiService';

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID || 'your-github-client-id';
const GITHUB_REDIRECT_URI = process.env.REACT_APP_GITHUB_REDIRECT_URI || `${window.location.origin}/auth/github/callback`;

export class AuthService {
  // GitHub OAuth methods
  static initiateGitHubLogin() {
    const scope = 'read:user user:email public_repo';
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state for verification
    localStorage.setItem('github_oauth_state', state);
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=${encodeURIComponent(scope)}&state=${state}`;
    
    window.location.href = githubAuthUrl;
  }

  static async handleGitHubCallback(code: string, state: string): Promise<AuthUser | null> {
    try {
      console.log('🔄 Starting GitHub OAuth callback handling...', { code: code.substring(0, 10) + '...', state });

      // Check if we're already processing this code to prevent React StrictMode double execution
      const processingKey = `github_oauth_processing_${code}`;
      if (localStorage.getItem(processingKey)) {
        console.log('⚠️ OAuth already being processed, skipping duplicate');
        return null;
      }
      
      // Mark as processing immediately
      localStorage.setItem(processingKey, 'true');
      
      // Verify state
      const storedState = localStorage.getItem('github_oauth_state');
      console.log('🔐 OAuth State Verification:', { received: state, stored: storedState });
      
      if (state !== storedState) {
        console.error('❌ State mismatch - clearing all OAuth state');
        localStorage.removeItem('github_oauth_state');
        localStorage.removeItem(processingKey); // Clean up processing flag
        throw new Error('Invalid state parameter - please try connecting again');
      }
      
      // Clear stored state immediately to prevent reuse
      localStorage.removeItem('github_oauth_state');
      
      // Exchange code for access token via our backend (secure)
      const tokenResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'}/api/auth/github/token`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirect_uri: GITHUB_REDIRECT_URI,
        }),
      });
      
      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok || tokenData.error) {
        throw new Error(tokenData.error || 'Failed to get access token');
      }
      
      // Get user data from GitHub API
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      const userData = await userResponse.json();
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      // Get real karma data from our backend
      let karmaData: GitHubUserSummary | null = null;
      try {
        const summaryResult = await githubApiService.getUserSummary(userData.login);
        if (summaryResult.success && summaryResult.data) {
          karmaData = summaryResult.data;
        }
      } catch (error) {
        console.warn('Failed to get karma data from backend, using basic GitHub data:', error);
      }

      // Create AuthUser object with real karma data
      const authUser: AuthUser = {
        id: `github_${userData.id}`,
        type: 'github',
        githubData: {
          username: userData.login,
          name: userData.name || userData.login,
          avatar_url: userData.avatar_url,
          email: userData.email,
          public_repos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
        },
        // Use real karma data from backend, fall back to basic calculation
        karmaScore: karmaData?.karmaScore || Math.min(userData.public_repos * 2 + userData.followers * 0.1, 100),
        trustFactor: karmaData?.trustFactor || 0.5 + (userData.public_repos * 0.01),
        totalContributions: karmaData?.totalContributions ? 
          (karmaData.totalContributions.commits + karmaData.totalContributions.pullRequests + karmaData.totalContributions.issues) : 
          userData.public_repos + 10,
      };
      
      // Clear processing flag on success
      localStorage.removeItem(processingKey);
      
      console.log('✅ GitHub OAuth callback completed successfully');
      return authUser;
    } catch (error) {
      console.error('❌ GitHub OAuth error:', error);
      
      // Clear processing flag on error
      const processingKey = `github_oauth_processing_${code}`;
      localStorage.removeItem(processingKey);
      
      // Also clear any remaining OAuth state on error
      localStorage.removeItem('github_oauth_state');
      
      return null;
    }
  }

  // Wallet connection helper
  static createWalletUser(address: string, chainId?: number): AuthUser {
    return {
      id: `wallet_${address}`,
      type: 'wallet',
      walletAddress: address,
      // Mock initial karma data - in production, this would come from your backend
      karmaScore: 65,
      trustFactor: 0.75,
      totalContributions: 25,
    };
  }

  // Fetch user profile data from backend
  static async fetchUserProfile(userId: string): Promise<Partial<AuthUser> | null> {
    try {
      if (userId.startsWith('github_')) {
        // Extract GitHub username from stored AuthUser ID
        const storedUser = this.getStoredUser();
        if (storedUser?.githubData?.username) {
          const summaryResult = await githubApiService.getUserSummary(storedUser.githubData.username);
          
          if (summaryResult.success && summaryResult.data) {
            const karmaData = summaryResult.data;
            return {
              karmaScore: karmaData.karmaScore,
              trustFactor: karmaData.trustFactor,
              totalContributions: karmaData.totalContributions.commits + 
                                karmaData.totalContributions.pullRequests + 
                                karmaData.totalContributions.issues,
            };
          }
        }
        
        // Fallback to mock data for GitHub users if backend fails
        return {
          karmaScore: 75,
          trustFactor: 0.8,
          totalContributions: 50,
        };
      } else if (userId.startsWith('wallet_')) {
        // For wallet users, return basic mock data (no GitHub analysis)
        return {
          karmaScore: 65,
          trustFactor: 0.7,
          totalContributions: 25,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  }

  // Helper to get stored user data
  private static getStoredUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem('umikarma_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // Check if current URL is GitHub callback
  static isGitHubCallback(): { isCallback: boolean; code?: string; state?: string } {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    return {
      isCallback: !!(code && state),
      code: code || undefined,
      state: state || undefined,
    };
  }

  // Clear all OAuth-related storage (useful for debugging)
  static clearOAuthState(): void {
    localStorage.removeItem('github_oauth_state');
    localStorage.removeItem('umikarma-auth');
    console.log('Cleared all OAuth state');
  }
} 