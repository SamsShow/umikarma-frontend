import React, { useEffect, useState, useCallback } from 'react';
import { UserIcon, TrophyIcon, ShieldCheckIcon, CalendarIcon, ArrowPathIcon, CodeBracketIcon, WalletIcon, CubeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { githubApiService, GitHubUserSummary } from '../services/githubApiService';
import { AuthUser } from '../store/authStore';
import { moveContractService, UserProfile } from '../services/moveContractService';
import AddContributionModal from './AddContributionModal';

interface KarmaCardProps {
  user: AuthUser;
  showRealTimeData?: boolean;
}

const KarmaCard: React.FC<KarmaCardProps> = ({
  user,
  showRealTimeData = false
}) => {
  const [githubData, setGithubData] = useState<GitHubUserSummary | null>(null);
  const [moveData, setMoveData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMove, setIsLoadingMove] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [showAddContribution, setShowAddContribution] = useState(false);

  // Fetch real GitHub data if enabled and GitHub handle is provided
  const fetchGitHubData = useCallback(async () => {
    if (!user.githubData?.username) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await githubApiService.getUserSummary(user.githubData.username);
      
      if (result.success && result.data) {
        setGithubData(result.data);
      } else {
        setError(result.error || 'Failed to fetch GitHub data');
      }
    } catch (err) {
      setError('Network error fetching GitHub data');
    } finally {
      setIsLoading(false);
    }
  }, [user.githubData?.username]);

  // Fetch Move contract data if wallet is connected
  const fetchMoveData = useCallback(async () => {
    if (!user.walletAddress) return;
    
    setIsLoadingMove(true);
    setMoveError(null);
    
    try {
      const profile = await moveContractService.getUserProfile(user.walletAddress);
      setMoveData(profile);
    } catch (err) {
      setMoveError('Failed to fetch on-chain data');
      console.error('Error fetching Move data:', err);
    } finally {
      setIsLoadingMove(false);
    }
  }, [user.walletAddress]);

  useEffect(() => {
    if (showRealTimeData && user.githubData?.username) {
      fetchGitHubData();
    }
  }, [showRealTimeData, user.githubData?.username, fetchGitHubData]);

  useEffect(() => {
    if (user.walletAddress) {
      fetchMoveData();
    }
  }, [user.walletAddress, fetchMoveData]);

  const handleContributionAdded = () => {
    // Refresh Move data after adding a contribution
    if (user.walletAddress) {
      fetchMoveData();
    }
  };

  // Use real data if available, otherwise fall back to user data
  const displayData = (() => {
    // Priority: Move data > GitHub data > user data
    if (moveData) {
      return {
        karmaScore: moveData.karmaScore,
        totalContributions: moveData.totalContributions,
        trustFactor: moveData.isVerified ? 0.9 : 0.5,
        recentActivities: moveData.contributions.length,
        username: user.githubData?.username,
        name: user.githubData?.name,
        avatar: user.githubData?.avatar_url,
        topLanguages: [],
        isOnChain: true
      };
    } else if (githubData) {
      return {
        karmaScore: githubData.karmaScore,
        totalContributions: githubData.totalContributions.commits + 
                           githubData.totalContributions.pullRequests + 
                           githubData.totalContributions.issues,
        trustFactor: githubData.trustFactor,
        recentActivities: githubData.totalContributions.repositories,
        username: githubData.username,
        name: githubData.name,
        avatar: githubData.avatar_url,
        topLanguages: githubData.topLanguages,
        isOnChain: false
      };
    } else {
      return {
        karmaScore: user.karmaScore || 0,
        totalContributions: user.totalContributions || 0,
        trustFactor: user.trustFactor || 0,
        recentActivities: user.totalContributions || 0,
        username: user.githubData?.username,
        name: user.githubData?.name,
        avatar: user.githubData?.avatar_url,
        topLanguages: [],
        isOnChain: false
      };
    }
  })();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-accent-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  // Helper function to get display name
  const getDisplayName = () => {
    if (displayData.name) return displayData.name;
    if (displayData.username) return `@${displayData.username}`;
    if (user.walletAddress) return `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`;
    return 'Anonymous User';
  };

  // Helper function to get connection status
  const getConnectionStatus = () => {
    const hasWallet = !!user.walletAddress;
    const hasGitHub = !!user.githubData;
    
    if (hasWallet && hasGitHub) {
      return { text: 'Wallet + GitHub Connected', color: 'bg-green-500', type: 'combined' };
    } else if (hasGitHub) {
      return { text: 'GitHub Connected', color: 'bg-accent-500', type: 'github' };
    } else if (hasWallet) {
      return { text: 'Wallet Connected', color: 'bg-primary-500', type: 'wallet' };
    }
    return { text: 'Not Connected', color: 'bg-gray-400', type: 'none' };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <div className="karma-card-special mb-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="flex items-center space-x-6 mb-6 lg:mb-0">
          {/* Avatar */}
          <div className="h-20 w-20 bg-karma-900 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            {displayData.avatar ? (
              <img 
                src={displayData.avatar} 
                alt={displayData.username || 'User'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="h-10 w-10 text-white" />
            )}
          </div>
          
          {/* User Info */}
          <div>
            <h2 className="text-2xl font-bold text-karma-900 mb-1">
              {getDisplayName()}
            </h2>
            
            {/* Show GitHub username if available and different from display name */}
            {displayData.name && displayData.username && (
              <p className="text-karma-600 text-sm mb-1">@{displayData.username}</p>
            )}
            
            {/* Show wallet address if available */}
            {user.walletAddress && (
              <p className="text-karma-600 font-mono text-sm flex items-center">
                <WalletIcon className="h-4 w-4 mr-1" />
                {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
              </p>
            )}
            
            {/* Show GitHub handle if wallet-only user */}
            {user.type === 'wallet' && !user.githubData && (
              <p className="text-karma-500 text-sm italic">No GitHub connected</p>
            )}
            
            {/* Status Indicators */}
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${connectionStatus.color}`}></div>
                <span className="text-sm text-karma-600">
                  {connectionStatus.text}
                </span>
                {connectionStatus.type === 'combined' && (
                  <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded-full font-medium">
                    ✨ Maximum Trust
                  </span>
                )}
              </div>
              
              {showRealTimeData && user.githubData?.username && (
                <button
                  onClick={fetchGitHubData}
                  disabled={isLoading}
                  className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                >
                  <ArrowPathIcon className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Updating...' : 'Refresh'}
                </button>
              )}
              
              {user.walletAddress && (
                <button
                  onClick={fetchMoveData}
                  disabled={isLoadingMove}
                  className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50"
                >
                  <CubeIcon className={`h-3 w-3 mr-1 ${isLoadingMove ? 'animate-spin' : ''}`} />
                  {isLoadingMove ? 'Updating...' : 'Refresh Chain'}
                </button>
              )}
            </div>
            
            {/* Connection Type Badges */}
            <div className="flex items-center space-x-2 mt-2">
              {user.walletAddress && (
                <span className="inline-flex items-center text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                  <WalletIcon className="h-3 w-3 mr-1" />
                  Wallet
                </span>
              )}
              {user.githubData && (
                <span className="inline-flex items-center text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">
                  <CodeBracketIcon className="h-3 w-3 mr-1" />
                  GitHub
                </span>
              )}
              {githubData && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Live Data
                </span>
              )}
              {moveData && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  On-Chain Data
                </span>
              )}
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                {error}
              </div>
            )}
            {moveError && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                {moveError}
              </div>
            )}
          </div>
        </div>
        
        {/* Karma Score Display */}
        <div className="text-center lg:text-right">
          <div className={`inline-flex items-center justify-center h-20 w-20 rounded-2xl ${getScoreBg(displayData.karmaScore)} mb-2 relative overflow-hidden`}>
            <div className={`text-3xl font-bold ${getScoreColor(displayData.karmaScore)} z-10`}>
              {Math.round(displayData.karmaScore)}
            </div>
            {/* Progress Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-gray-200">
                <div 
                  className={`w-16 h-16 rounded-full border-2 border-transparent bg-gradient-to-r ${getScoreGradient(displayData.karmaScore)} opacity-20`}
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + (displayData.karmaScore / 100) * 50}% 0%, 100% 100%, 0% 100%)`
                  }}
                />
              </div>
            </div>
          </div>
          <p className="text-karma-600 font-medium">Karma Score</p>
          <p className="text-sm text-karma-500">out of 100</p>
          <p className="text-xs text-karma-500 mt-1">
            Trust: {Math.round(displayData.trustFactor * 100)}%
          </p>
          {user.type === 'combined' && (
            <p className="text-xs text-accent-600 font-medium mt-1">
              +Bonus for dual verification
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
        <div className="stat-card text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-white rounded-xl shadow-soft">
              <TrophyIcon className="h-6 w-6 text-karma-700" />
            </div>
          </div>
          <div className="text-2xl font-bold text-karma-900 mb-1">
            {displayData.totalContributions.toLocaleString()}
          </div>
          <div className="text-karma-600 text-sm font-medium">Total Contributions</div>
          {githubData && (
            <div className="text-xs text-karma-500 mt-1">
              {githubData.totalContributions.commits} commits • {githubData.totalContributions.pullRequests} PRs
            </div>
          )}
        </div>

        <div className="stat-card text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-white rounded-xl shadow-soft">
              <ShieldCheckIcon className="h-6 w-6 text-karma-700" />
            </div>
          </div>
          <div className="text-2xl font-bold text-karma-900 mb-1">
            {Math.round(displayData.trustFactor * 100)}%
          </div>
          <div className="text-karma-600 text-sm font-medium">Trust Factor</div>
          <div className="text-xs text-karma-500 mt-1">
            {user.type === 'combined' ? 'Dual verified' : user.type === 'github' ? 'GitHub verified' : 'Wallet verified'}
          </div>
        </div>

        <div className="stat-card text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-white rounded-xl shadow-soft">
              <CalendarIcon className="h-6 w-6 text-karma-700" />
            </div>
          </div>
          <div className="text-2xl font-bold text-karma-900 mb-1">
            {displayData.recentActivities}
          </div>
          <div className="text-karma-600 text-sm font-medium">
            {user.githubData ? 'Active Repositories' : 'Recent Activities'}
          </div>
          {githubData && (
            <div className="text-xs text-karma-500 mt-1">
              {githubData.totalContributions.issues} issues opened
            </div>
          )}
        </div>
      </div>

      {/* Programming Languages (GitHub only) */}
      {displayData.topLanguages && displayData.topLanguages.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-karma-900 mb-4 flex items-center">
            <CodeBracketIcon className="h-5 w-5 mr-2" />
            Top Programming Languages
          </h4>
          <div className="flex flex-wrap gap-2">
            {displayData.topLanguages.slice(0, 6).map((lang, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-karma-100 text-karma-700 rounded-full text-sm font-medium"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Move Contract Contributions */}
      {moveData && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-karma-900 flex items-center">
              <CubeIcon className="h-5 w-5 mr-2" />
              On-Chain Contributions
            </h4>
            {user.walletAddress && (
              <button
                onClick={() => setShowAddContribution(true)}
                className="inline-flex items-center px-3 py-1 text-sm bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Contribution
              </button>
            )}
          </div>
          
          {moveData.contributions.length > 0 ? (
          <div className="space-y-3">
            {moveData.contributions.slice(0, 5).map((contribution, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-karma-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-karma-700 capitalize">
                    {contribution.type}
                  </span>
                  <span className="text-xs text-karma-500">
                    {new Date(contribution.timestamp * 1000).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-karma-600 mb-2">{contribution.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-karma-500">
                    Impact Score: {contribution.impactScore}/100
                  </span>
                  <div className="w-16 bg-karma-200 rounded-full h-2">
                    <div 
                      className="bg-accent-500 h-2 rounded-full" 
                      style={{ width: `${contribution.impactScore}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {moveData.contributions.length > 5 && (
              <p className="text-sm text-karma-500 text-center">
                +{moveData.contributions.length - 5} more contributions
              </p>
            )}
          </div>
          ) : (
            <div className="text-center py-8 text-karma-500">
              <CubeIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No on-chain contributions yet</p>
              {user.walletAddress && (
                <p className="text-xs mt-1">Click "Add Contribution" to get started</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Connection Suggestions */}
      {user.type !== 'combined' && (
        <div className="bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-200 rounded-xl p-4">
          <h4 className="font-semibold text-karma-900 mb-2 flex items-center">
            <TrophyIcon className="h-4 w-4 mr-2 text-accent-600" />
            Boost Your Karma
          </h4>
          <p className="text-sm text-karma-600 mb-3">
            {user.type === 'wallet' 
              ? 'Connect your GitHub account to increase your karma score and trust factor!'
              : 'Connect your wallet to increase your karma score and trust factor!'
            }
          </p>
          <div className="text-xs text-karma-500">
            💡 Combined profiles get higher karma scores and increased trust ratings
          </div>
        </div>
      )}

      {/* Add Contribution Modal */}
      {user.walletAddress && (
        <AddContributionModal
          isOpen={showAddContribution}
          onClose={() => setShowAddContribution(false)}
          userAddress={user.walletAddress}
          onContributionAdded={handleContributionAdded}
        />
      )}
    </div>
  );
};

export default KarmaCard; 