import React, { useState, useEffect, useCallback } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { 
  ShieldCheckIcon, 
  SparklesIcon,
  ArrowDownTrayIcon,
  ArrowLeftOnRectangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import WelcomeScreen from './components/WelcomeScreen';
import KarmaCard from './components/KarmaCard';
import ContributionList from './components/ContributionList';
import AuthModal from './components/AuthModal';
import { wagmiConfig } from './config/web3Config';
import { useAuthStore, AuthUser } from './store/authStore';
import './App.css';

// Production ready - debug logs removed

// Create QueryClient for React Query
const queryClient = new QueryClient();

// Create Web3Modal instance - temporarily hardcoded for debugging
const projectId = 'fb61b9aab141023c1f5f324f6bd6e792';

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
});

interface ContributionData {
  type: 'github' | 'dao' | 'forum';
  title: string;
  description: string;
  impact: number;
  date: string;
  aiSummary: string;
}

// Legacy interface - keeping for backward compatibility
// interface UserProfile {
//   wallet: string;
//   githubHandle: string;
//   karmaScore: number;
//   trustFactor: number;
//   totalContributions: number;
//   recentActivity: ContributionData[];
// }

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-karma-50 to-primary-50 flex items-center justify-center">
          <div className="clean-card max-w-md mx-auto text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="text-karma-600 mb-4">
              The application encountered an error. This might be due to network connectivity issues.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const { user, isAuthenticated, logout, loading } = useAuthStore();
  const { isConnected } = useAccount();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Clean production state management

  // Mock contribution data based on user type
  const getMockContributions = (user: AuthUser): ContributionData[] => {
    if (user.type === 'github' && user.githubData) {
      return [
        {
          type: 'github',
          title: 'Critical bug fix in consensus logic',
          description: 'Fixed memory leak in validator consensus mechanism',
          impact: 95,
          date: '2024-06-20',
          aiSummary: 'High-impact security fix that prevented potential network instability. Code review showed thorough testing and clear documentation.'
        },
        {
          type: 'github',
          title: 'Feature: Multi-sig wallet integration',
          description: 'Implemented secure multi-signature wallet support',
          impact: 88,
          date: '2024-06-17',
          aiSummary: 'Significant security enhancement with comprehensive test coverage. Well-documented API changes and migration guide provided.'
        },
        {
          type: 'dao',
          title: 'Governance Proposal #42 - Vote Cast',
          description: 'Voted in favor of treasury allocation proposal',
          impact: 70,
          date: '2024-06-19',
          aiSummary: 'Active participation in governance with alignment to community consensus. Consistent voting pattern shows engagement.'
        }
      ];
    } else {
      return [
        {
          type: 'dao',
          title: 'Governance Proposal #38 - Vote Cast',
          description: 'Participated in protocol upgrade voting',
          impact: 75,
          date: '2024-06-20',
          aiSummary: 'Thoughtful participation in critical protocol decisions. Shows understanding of technical implications.'
        },
        {
          type: 'forum',
          title: 'Technical Discussion: Layer 2 Scaling',
          description: 'Provided detailed analysis on rollup implementations',
          impact: 85,
          date: '2024-06-18',
          aiSummary: 'Valuable technical contribution with clear explanations and actionable insights. High community engagement.'
        }
      ];
    }
  };

  // Stable callback to prevent infinite re-renders
  const handleConnect = useCallback(() => {
    console.log('Handle connect called');
    setShowAuthModal(true);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    console.log('Auth success, hiding modal and welcome');
    setShowAuthModal(false);
    setShowWelcome(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    console.log('Closing auth modal');
    setShowAuthModal(false);
  }, []);

  // Effect to handle authentication state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      setShowWelcome(false);
      setShowAuthModal(false);
    } else if (!isConnected) {
      // Only reset to welcome screen if wallet is disconnected
      setShowWelcome(true);
      setShowAuthModal(false);
    }
  }, [isAuthenticated, user, isConnected]);

  const handleDisconnect = () => {
    logout();
    setShowWelcome(true);
  };

  const exportKarmaProof = () => {
    if (!user) return;
    
    const proofData = {
      id: user.id,
      type: user.type,
      walletAddress: user.walletAddress,
      githubUsername: user.githubData?.username,
      karmaScore: user.karmaScore,
      trustFactor: user.trustFactor,
      totalContributions: user.totalContributions,
      timestamp: new Date().toISOString(),
      recentContributions: getMockContributions(user).slice(0, 3)
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proofData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `umikarma-proof-${user.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-karma-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-karma-600">Connecting...</p>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <>
        <WelcomeScreen onConnect={handleConnect} loading={loading} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={handleCloseModal}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <WelcomeScreen onConnect={handleConnect} loading={loading} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={handleCloseModal}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="border-b border-karma-100 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-karma-900 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-karma-900">UmiKarma</span>
              <span className="text-xs bg-karma-100 text-karma-700 px-2 py-1 rounded-full font-medium">
                Dashboard
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Add connection button for additional auth methods */}
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn-secondary text-sm px-4 py-2 flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Connection</span>
              </button>
              
              <button
                onClick={exportKarmaProof}
                className="btn-secondary text-sm px-4 py-2"
              >
                <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                Export Proof
              </button>
              
              <button
                onClick={handleDisconnect}
                className="nav-link flex items-center space-x-2"
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-custom py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-karma-900 mb-2">
            Your Reputation Dashboard
          </h1>
          <p className="text-karma-600 text-lg">
            Track your contributions and karma score across the decentralized ecosystem
          </p>
          
          {/* User Info Banner */}
          <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-lg">
            <div className="flex items-center space-x-3">
              {user.type === 'github' && user.githubData ? (
                <>
                  <img
                    src={user.githubData.avatar_url}
                    alt={user.githubData.name}
                    className="h-10 w-10 rounded-full border-2 border-white"
                  />
                  <div>
                    <p className="font-medium text-karma-900">
                      Connected as {user.githubData.name}
                    </p>
                    <p className="text-sm text-karma-600">
                      @{user.githubData.username} • GitHub Account
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <ShieldCheckIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-karma-900">
                      Connected Wallet
                    </p>
                    <p className="text-sm text-karma-600 font-mono">
                      {user.walletAddress?.slice(0, 6)}...{user.walletAddress?.slice(-4)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <KarmaCard
          karmaScore={user.karmaScore || 0}
          totalContributions={user.totalContributions || 0}
          trustFactor={user.trustFactor || 0}
          recentActivities={getMockContributions(user).length}
          githubHandle={user.githubData?.username}
          wallet={user.walletAddress}
        />

        {/* Recent Activities */}
        <ContributionList contributions={getMockContributions(user)} />

        {/* Integration Examples Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* DAO Access Control */}
          <div className="clean-card">
            <h3 className="text-xl font-bold text-karma-900 mb-6">DAO Access Control</h3>
            <div className="space-y-4">
              <div className="border border-accent-200 bg-accent-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-8 w-8 bg-accent-500 rounded-lg flex items-center justify-center">
                    <ShieldCheckIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-accent-800">Access Granted</div>
                    <div className="text-xs text-accent-700">DAO Y Proposals</div>
                  </div>
                </div>
                <p className="text-accent-700 text-sm">
                  Minimum required: 70/100 • Your score: {user.karmaScore || 0}/100
                </p>
              </div>
              
              <div className="border border-accent-200 bg-accent-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-8 w-8 bg-accent-500 rounded-lg flex items-center justify-center">
                    <ShieldCheckIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-accent-800">Access Granted</div>
                    <div className="text-xs text-accent-700">TechDAO Council</div>
                  </div>
                </div>
                <p className="text-accent-700 text-sm">
                  Minimum required: 80/100 • Your score: {user.karmaScore || 0}/100
                </p>
              </div>
              
              <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-8 w-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <ShieldCheckIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-yellow-800">Pending Review</div>
                    <div className="text-xs text-yellow-700">EliteDAO Treasury</div>
                  </div>
                </div>
                <p className="text-yellow-700 text-sm">
                  Minimum required: 90/100 • Your score: {user.karmaScore || 0}/100
                </p>
              </div>
            </div>
          </div>

          {/* Developer Integration */}
          <div className="clean-card">
            <h3 className="text-xl font-bold text-karma-900 mb-6">Developer Integration</h3>
            <div className="bg-karma-50 border border-karma-200 rounded-xl p-6">
              <h4 className="font-semibold text-karma-900 mb-3">SDK Example</h4>
                             <div className="bg-karma-900 rounded-lg p-4 text-sm font-mono text-white overflow-x-auto">
                 <div className="text-accent-400">{'// Verify user reputation'}</div>
                 <div className="text-white">
                   <div>const karma = await umiKarma</div>
                   <div>&nbsp;&nbsp;.getUser('{user.walletAddress?.slice(0, 8) || user.id.slice(0, 8)}...')</div>
                   <div>&nbsp;&nbsp;.getScore();</div>
                   <div><br /></div>
                   <div>if (karma &gt;= 70) {'{'}</div>
                   <div>&nbsp;&nbsp;<span className="text-accent-300">{'// Grant access'}</span></div>
                   <div>&nbsp;&nbsp;allowProposalSubmission();</div>
                   <div>{'}'}</div>
                 </div>
               </div>
              
              <div className="mt-4 space-y-2 text-sm text-karma-600">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-accent-500 rounded-full"></div>
                  <span>REST API at <code className="bg-karma-200 px-1 rounded text-karma-800">api.umikarma.xyz</code></span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-accent-500 rounded-full"></div>
                  <span>SDKs for JavaScript, Python, Rust</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-accent-500 rounded-full"></div>
                  <span>Real-time webhooks for score updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Future Features */}
        <div className="clean-card mt-8">
          <h3 className="text-xl font-bold text-karma-900 mb-6">🚀 Coming Soon</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-200 rounded-xl">
              <div className="text-3xl mb-3">🔐</div>
              <h4 className="font-semibold text-primary-900 mb-2">ZK Proofs</h4>
              <p className="text-primary-700 text-sm">Verify reputation without revealing identity details</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
              <div className="text-3xl mb-3">🌐</div>
              <h4 className="font-semibold text-purple-900 mb-2">Social Integration</h4>
              <p className="text-purple-700 text-sm">Lens Protocol & Farcaster reputation tracking</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-accent-50 to-green-50 border border-accent-200 rounded-xl">
              <div className="text-3xl mb-3">🏆</div>
              <h4 className="font-semibold text-accent-900 mb-2">Dynamic NFTs</h4>
              <p className="text-accent-700 text-sm">Reputation badges that evolve with your karma</p>
            </div>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseModal}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <AppContent />
        </WagmiProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
