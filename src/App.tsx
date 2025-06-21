import React, { useState } from 'react';
import { 
  ShieldCheckIcon, 
  SparklesIcon,
  ArrowDownTrayIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import WelcomeScreen from './components/WelcomeScreen';
import KarmaCard from './components/KarmaCard';
import ContributionList from './components/ContributionList';

interface ContributionData {
  type: 'github' | 'dao' | 'forum';
  title: string;
  description: string;
  impact: number;
  date: string;
  aiSummary: string;
}

interface UserProfile {
  wallet: string;
  githubHandle: string;
  karmaScore: number;
  trustFactor: number;
  totalContributions: number;
  recentActivity: ContributionData[];
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock user data for MVP demo
  const mockUserProfile: UserProfile = {
    wallet: "0x742d35Cc6635C0532925a3b8D93b98D4E5f789E2",
    githubHandle: "alice-dev",
    karmaScore: 82,
    trustFactor: 0.95,
    totalContributions: 47,
    recentActivity: [
      {
        type: 'github',
        title: 'Critical bug fix in consensus logic',
        description: 'Fixed memory leak in validator consensus mechanism',
        impact: 95,
        date: '2024-06-20',
        aiSummary: 'High-impact security fix that prevented potential network instability. Code review showed thorough testing and clear documentation.'
      },
      {
        type: 'dao',
        title: 'Governance Proposal #42 - Vote Cast',
        description: 'Voted in favor of treasury allocation proposal',
        impact: 70,
        date: '2024-06-19',
        aiSummary: 'Active participation in governance with alignment to community consensus. Consistent voting pattern shows engagement.'
      },
      {
        type: 'forum',
        title: 'Technical Discussion: Layer 2 Scaling',
        description: 'Provided detailed analysis on rollup implementations',
        impact: 85,
        date: '2024-06-18',
        aiSummary: 'Valuable technical contribution with clear explanations and actionable insights. High community engagement.'
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
        type: 'forum',
        title: 'Security Audit Discussion',
        description: 'Led discussion on smart contract security best practices',
        impact: 92,
        date: '2024-06-16',
        aiSummary: 'Expert-level security insights that helped identify potential vulnerabilities. Constructive discussion leadership with actionable recommendations.'
      }
    ]
  };

  const connectWallet = async () => {
    setLoading(true);
    // Simulate wallet connection and data fetching
    setTimeout(() => {
      setIsConnected(true);
      setUserProfile(mockUserProfile);
      setLoading(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setUserProfile(null);
  };

  const exportKarmaProof = () => {
    if (!userProfile) return;
    
    const proofData = {
      wallet: userProfile.wallet,
      githubHandle: userProfile.githubHandle,
      karmaScore: userProfile.karmaScore,
      trustFactor: userProfile.trustFactor,
      totalContributions: userProfile.totalContributions,
      timestamp: new Date().toISOString(),
      recentContributions: userProfile.recentActivity.slice(0, 3)
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proofData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `umikarma-proof-${userProfile.githubHandle}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!isConnected) {
    return <WelcomeScreen onConnect={connectWallet} loading={loading} />;
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
        </div>

        {/* User Profile Card */}
        {userProfile && (
          <KarmaCard
            karmaScore={userProfile.karmaScore}
            totalContributions={userProfile.totalContributions}
            trustFactor={userProfile.trustFactor}
            recentActivities={userProfile.recentActivity.length}
            githubHandle={userProfile.githubHandle}
            wallet={userProfile.wallet}
          />
        )}

        {/* Recent Activities */}
        {userProfile && (
          <ContributionList contributions={userProfile.recentActivity} />
        )}

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
                  Minimum required: 70/100 • Your score: {userProfile?.karmaScore}/100
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
                  Minimum required: 80/100 • Your score: {userProfile?.karmaScore}/100
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
                  Minimum required: 90/100 • Your score: {userProfile?.karmaScore}/100
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
                   <div>&nbsp;&nbsp;.getUser('{userProfile?.wallet.slice(0, 8)}...')</div>
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
    </div>
  );
}

export default App;
