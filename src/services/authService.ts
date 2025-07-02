import { AuthUser } from '../store/authStore';
import { githubApiService, GitHubUserSummary } from './githubApiService';

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID || 'your-github-client-id';
const GITHUB_REDIRECT_URI = process.env.REACT_APP_GITHUB_REDIRECT_URI || `${window.location.origin}/auth/github/callback`;

export class AuthService {
  // GitHub OAuth methods
  static initiateGitHubLogin() {
    // Generate a state parameter with timestamp to prevent CSRF
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 15);
    
    // Create a state parameter that contains verifiable information
    // This is a stateless approach that doesn't rely on localStorage
    const stateObj = {
      timestamp,
      random: randomPart,
      // Add a hash to verify this wasn't tampered with
      hash: this.generateStateHash(timestamp, randomPart)
    };
    
    // Convert to string and encode
    const state = btoa(JSON.stringify(stateObj));
    
    console.log('🔐 Generated OAuth state token (stateless)');
    
    // Encode redirect URI to prevent issues with special characters
    const encodedRedirectUri = encodeURIComponent(GITHUB_REDIRECT_URI);
    const encodedScope = encodeURIComponent('read:user user:email public_repo');
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodedRedirectUri}&scope=${encodedScope}&state=${state}`;
    
    // Navigate to GitHub auth page
    console.log('🔄 Redirecting to GitHub OAuth page...');
    window.location.href = githubAuthUrl;
  }
  
  // Generate a hash to validate state
  private static generateStateHash(timestamp: number, random: string): string {
    // Simple hash function for verification
    // In production, use a proper HMAC with a secret key
    const str = `${timestamp}:${random}:umikarma-secret`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  static async handleGitHubCallback(code: string, state: string): Promise<AuthUser | null> {
    try {
      console.log('🔄 Starting GitHub OAuth callback handling...', { code: code.substring(0, 10) + '...', state: state.substring(0, 10) + '...' });

      // Create a unique key for this specific callback attempt
      const callbackKey = `github_oauth_callback_${code.substring(0, 10)}`;
      const processingKey = `github_oauth_processing_${code.substring(0, 10)}`;
      
      // Check if this exact callback has already been successfully processed
      const existingResult = localStorage.getItem(callbackKey);
      if (existingResult) {
        console.log('✅ OAuth callback already successfully processed, returning cached result');
        try {
          const cachedUser = JSON.parse(existingResult);
          return cachedUser;
        } catch (e) {
          console.warn('Failed to parse cached OAuth result, proceeding with fresh processing');
          localStorage.removeItem(callbackKey);
        }
      }
      
      // Check if we're already processing this code to prevent React StrictMode double execution
      if (localStorage.getItem(processingKey)) {
        console.log('⚠️ OAuth already being processed, waiting for completion...');
        return null;
      }
      
      // Mark as processing immediately
      localStorage.setItem(processingKey, 'true');
      
      // Verify state using stateless approach
      let stateValid = false;
      try {
        // Decode state
        const decodedState = JSON.parse(atob(state));
        const { timestamp, random, hash } = decodedState;
        
        // Verify hash
        const calculatedHash = this.generateStateHash(timestamp, random);
        stateValid = calculatedHash === hash;
        
        // Check timestamp (no older than 10 minutes)
        const now = Date.now();
        const maxAge = 10 * 60 * 1000; // 10 minutes
        if (now - timestamp > maxAge) {
          console.error('❌ OAuth state expired');
          stateValid = false;
        }
        
        console.log('🔐 OAuth State Verification:', { valid: stateValid });
      } catch (e) {
        console.error('❌ Failed to decode or verify state', e);
        stateValid = false;
      }
      
      if (!stateValid) {
        console.error('❌ Invalid OAuth state - authentication failed');
        localStorage.removeItem(processingKey);
        localStorage.removeItem(callbackKey);
        throw new Error('Invalid state parameter - please try connecting again');
      }
      
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
      
      // Cache the successful result for potential duplicate processing
      localStorage.setItem(callbackKey, JSON.stringify(authUser));
      
      // Clear processing flag on success
      localStorage.removeItem(processingKey);
      
      // Clean up the URL immediately since we've successfully processed the callback
      window.history.replaceState({}, document.title, window.location.pathname);
      
      console.log('✅ GitHub OAuth callback completed successfully');
      
      // Clean up the cached result after a short delay to prevent memory bloat
      setTimeout(() => {
        localStorage.removeItem(callbackKey);
      }, 5000);
      
      return authUser;
    } catch (error) {
      console.error('❌ GitHub OAuth error:', error);
      
      // Clear processing flag on error
      const processingKey = `github_oauth_processing_${code.substring(0, 10)}`;
      const callbackKey = `github_oauth_callback_${code.substring(0, 10)}`;
      localStorage.removeItem(processingKey);
      localStorage.removeItem(callbackKey);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
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
    this.clearAllOAuthState();
    
    console.log('🧹 Cleared all OAuth state (localStorage + sessionStorage + URL params)');
  }
  
  // Helper to clear all OAuth state from all storages
  private static clearAllOAuthState(): void {
    // First save a backup of current state for debugging
    const currentState = {
      localStorage_state: localStorage.getItem('github_oauth_state'),
      sessionStorage_state: sessionStorage.getItem('github_oauth_state'),
      localStorage_meta: localStorage.getItem('github_oauth_state_meta'),
      sessionStorage_meta: sessionStorage.getItem('github_oauth_state_meta'),
      processing_keys: Object.keys(localStorage)
        .filter(key => key.startsWith('github_oauth_processing_') || key.startsWith('github_oauth_callback_')),
      session_keys: Object.keys(sessionStorage)
        .filter(key => key.startsWith('github_oauth_session_'))
    };
    
    console.log('🔍 Current OAuth state before clearing:', currentState);
    
    // Clear localStorage OAuth items
    localStorage.removeItem('github_oauth_state');
    localStorage.removeItem('github_oauth_state_meta');
    
    // Clear sessionStorage OAuth items
    sessionStorage.removeItem('github_oauth_state');
    sessionStorage.removeItem('github_oauth_state_meta');
    
    // Clear any processing flags
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('github_oauth_processing_') || key.startsWith('github_oauth_callback_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage OAuth items
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('github_oauth_session_')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear URL parameters if they exist
    const params = new URLSearchParams(window.location.search);
    let changed = false;
    
    if (params.has('code') || params.has('state') || params.has('oauth_pending') || params.has('state_backup')) {
      params.delete('code');
      params.delete('state');
      params.delete('oauth_pending');
      params.delete('state_backup');
      changed = true;
    }
    
    if (changed) {
      const newSearch = params.toString();
      const newPath = newSearch 
        ? `${window.location.pathname}?${newSearch}` 
        : window.location.pathname;
        
      window.history.replaceState({}, document.title, newPath);
    }
  }
  
  // Debug helper to show current OAuth state
  static debugOAuthState(): void {
    const state = {
      github_oauth_state: localStorage.getItem('github_oauth_state'),
      localStorage: Object.keys(localStorage)
        .filter(key => key.includes('github') || key.includes('oauth'))
        .reduce((obj, key) => {
          obj[key] = localStorage.getItem(key);
          return obj;
        }, {} as Record<string, string | null>),
      sessionStorage: Object.keys(sessionStorage)
        .filter(key => key.includes('github') || key.includes('oauth'))
        .reduce((obj, key) => {
          obj[key] = sessionStorage.getItem(key);
          return obj;
        }, {} as Record<string, string | null>),
      url: {
        hasCodeParam: window.location.search.includes('code='),
        hasStateParam: window.location.search.includes('state='),
        fullSearch: window.location.search
      }
    };
    
    console.log('🔍 Current OAuth State:', state);
  }
} 