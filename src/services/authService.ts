import { AuthUser } from '../store/authStore';

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
      // Verify state
      const storedState = localStorage.getItem('github_oauth_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }
      
      // Clear stored state
      localStorage.removeItem('github_oauth_state');
      
      // Exchange code for access token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: GITHUB_REDIRECT_URI,
        }),
      });
      
      const tokenData = await tokenResponse.json();
      
      if (tokenData.error) {
        throw new Error(tokenData.error_description || 'Failed to get access token');
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
      
      // Create AuthUser object
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
        // Mock initial karma data - in production, this would come from your backend
        karmaScore: 75,
        trustFactor: 0.85,
        totalContributions: userData.public_repos + 10,
      };
      
      return authUser;
    } catch (error) {
      console.error('GitHub OAuth error:', error);
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

  // Fetch user profile data (mock for now)
  static async fetchUserProfile(userId: string): Promise<Partial<AuthUser> | null> {
    try {
      // In production, this would be an API call to your backend
      // For now, return mock data based on user type
      
      const mockProfiles = {
        github_user: {
          karmaScore: 88,
          trustFactor: 0.92,
          totalContributions: 156,
        },
        wallet_user: {
          karmaScore: 72,
          trustFactor: 0.68,
          totalContributions: 43,
        },
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (userId.startsWith('github_')) {
        return mockProfiles.github_user;
      } else if (userId.startsWith('wallet_')) {
        return mockProfiles.wallet_user;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
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
} 