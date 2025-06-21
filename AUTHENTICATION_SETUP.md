# UmiKarma Authentication Setup Guide

This guide will help you set up wallet connection and social login authentication for UmiKarma.

## Overview

UmiKarma now supports two authentication methods:
1. **Wallet Connection** - Connect Web3 wallets (MetaMask, WalletConnect, Coinbase Wallet)
2. **GitHub OAuth** - Link GitHub accounts to track code contributions

## Quick Start

1. **Install Dependencies**
   ```bash
   cd umikarma-frontend
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your actual values:
   ```env
   REACT_APP_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
   REACT_APP_GITHUB_CLIENT_ID=your-github-client-id
   REACT_APP_GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

## Configuration Steps

### 1. WalletConnect Setup

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy your Project ID
4. Add it to `.env.local` as `REACT_APP_WALLETCONNECT_PROJECT_ID`

**Supported Wallets:**
- MetaMask
- WalletConnect compatible wallets
- Coinbase Wallet
- Injected wallets

### 2. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: UmiKarma
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/auth/github/callback`
4. Copy the Client ID and Client Secret
5. Add them to `.env.local`:
   ```env
   REACT_APP_GITHUB_CLIENT_ID=your_client_id
   REACT_APP_GITHUB_CLIENT_SECRET=your_client_secret
   ```

**GitHub Permissions Requested:**
- Public profile information
- Public repositories and contributions
- Email address (if public)
- Repository activity and commit history

## Authentication Flow

### Wallet Connection Flow
1. User clicks "Connect Wallet" 
2. Web3Modal opens with wallet options
3. User selects and connects their wallet
4. Application creates user profile with wallet address
5. User is redirected to dashboard

### GitHub OAuth Flow
1. User clicks "Connect with GitHub"
2. Redirected to GitHub authorization page
3. User grants permissions
4. GitHub redirects back with authorization code
5. Application exchanges code for access token
6. Fetches user profile from GitHub API
7. Creates user profile with GitHub data
8. User is redirected to dashboard

## User Data Structure

```typescript
interface AuthUser {
  id: string;                    // Unique identifier
  type: 'wallet' | 'github';     // Authentication method
  walletAddress?: string;        // Wallet address (if wallet auth)
  githubData?: {                 // GitHub data (if GitHub auth)
    username: string;
    name: string;
    avatar_url: string;
    email?: string;
    public_repos: number;
    followers: number;
    following: number;
  };
  karmaScore?: number;           // Current karma score
  trustFactor?: number;          // Trust factor (0-1)
  totalContributions?: number;   // Total contribution count
}
```

## State Management

The application uses Zustand for authentication state management with persistence:

```typescript
// Access authentication state
const { user, isAuthenticated, logout } = useAuthStore();

// Check if user is authenticated
if (isAuthenticated && user) {
  // User is logged in
}
```

## Components Overview

### `AuthModal`
- Main authentication modal with choice between wallet and GitHub
- Handles authentication flow switching
- Error handling and success callbacks

### `WalletConnection`
- Integrates with Web3Modal for wallet connections
- Supports multiple wallet providers
- Handles connection errors and states

### `SocialLogin`
- GitHub OAuth integration
- Handles OAuth callback processing
- Displays connected GitHub profile

### `AuthService`
- Utility functions for authentication
- GitHub OAuth flow management
- User profile creation helpers

## Development Notes

### Mock Data
- The application currently uses mock karma scores and contribution data
- Real data integration requires backend API implementation

### Error Handling
- Authentication errors are displayed in the UI
- Network errors are logged to console
- State cleanup on authentication failures

### Security Considerations
- GitHub Client Secret should be handled by backend in production
- OAuth state verification prevents CSRF attacks
- Wallet connections use secure Web3 providers

## Production Deployment

### Environment Variables for Production
```env
REACT_APP_WALLETCONNECT_PROJECT_ID=prod-project-id
REACT_APP_GITHUB_CLIENT_ID=prod-github-client-id
REACT_APP_GITHUB_REDIRECT_URI=https://yourdomain.com/auth/github/callback
REACT_APP_API_BASE_URL=https://api.yourdomain.com
```

### GitHub OAuth Production Setup
1. Create a new GitHub OAuth app for production
2. Set production domain in callback URL
3. Update environment variables
4. Implement backend endpoint to handle client secret securely

### WalletConnect Production Setup
1. Update WalletConnect project settings with production domain
2. Configure proper metadata for your application
3. Test with multiple wallet providers

## Troubleshooting

### Common Issues

**Wallet Connection Fails**
- Check WalletConnect Project ID is correct
- Ensure wallet is installed and unlocked
- Try different wallet providers

**GitHub OAuth Fails**
- Verify GitHub Client ID and Secret
- Check callback URL matches GitHub app settings
- Ensure state parameter validation

**State Persistence Issues**
- Clear browser localStorage if needed
- Check Zustand persist configuration
- Verify store hydration

### Debug Mode

Enable debug logging in development:
```typescript
// In authService.ts
console.log('GitHub OAuth initiated:', { clientId, redirectUri });
```

## Next Steps

1. **Backend Integration**: Implement API endpoints for real karma calculation
2. **Multi-Account Support**: Allow users to connect both wallet and GitHub
3. **Additional Providers**: Add more social login options (Twitter, Discord)
4. **Enhanced Security**: Implement JWT tokens and refresh mechanisms
5. **Analytics**: Track authentication success rates and user preferences

## Support

For issues and questions:
- Check the browser console for error logs
- Verify environment variable configuration
- Test with different browsers and wallet combinations
- Review GitHub OAuth app settings

The authentication system is designed to be modular and extensible for future enhancements. 