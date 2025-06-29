import React, { useEffect, useState } from 'react';
import { UserIcon, TrophyIcon, ShieldCheckIcon, CalendarIcon, ArrowPathIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { githubApiService, GitHubUserSummary } from '../services/githubApiService';

interface KarmaCardProps {
  karmaScore: number;
  totalContributions: number;
  trustFactor: number;
  recentActivities: number;
  githubHandle?: string;
  wallet?: string;
  showRealTimeData?: boolean;
}

const KarmaCard: React.FC<KarmaCardProps> = ({
  karmaScore,
  totalContributions,
  trustFactor,
  recentActivities,
  githubHandle,
  wallet,
  showRealTimeData = false
}) => {
  const [githubData, setGithubData] = useState<GitHubUserSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch real GitHub data if enabled and GitHub handle is provided
  useEffect(() => {
    if (showRealTimeData && githubHandle) {
      fetchGitHubData();
    }
  }, [showRealTimeData, githubHandle]);

  const fetchGitHubData = async () => {
    if (!githubHandle) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await githubApiService.getUserSummary(githubHandle);
      
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
  };

  // Use real GitHub data if available, otherwise fall back to props
  const displayData = githubData ? {
    karmaScore: githubData.karmaScore,
    totalContributions: githubData.totalContributions.commits + 
                       githubData.totalContributions.pullRequests + 
                       githubData.totalContributions.issues,
    trustFactor: githubData.trustFactor,
    recentActivities: githubData.totalContributions.repositories,
    username: githubData.username,
    name: githubData.name,
    avatar: githubData.avatar_url,
    topLanguages: githubData.topLanguages
  } : {
    karmaScore,
    totalContributions,
    trustFactor,
    recentActivities,
    username: githubHandle,
    name: null,
    avatar: null,
    topLanguages: []
  };

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

  return (
    <div className="clean-card mb-8">
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
              {displayData.name || (displayData.username ? `@${displayData.username}` : 'Anonymous User')}
            </h2>
            {displayData.name && displayData.username && (
              <p className="text-karma-600 text-sm mb-1">@{displayData.username}</p>
            )}
            <p className="text-karma-600 font-mono text-sm">
              {wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : 'No wallet connected'}
            </p>
            
            {/* Status Indicators */}
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${githubData ? 'bg-green-500' : 'bg-accent-500'}`}></div>
                <span className="text-sm text-karma-600">
                  {githubData ? 'Live GitHub Data' : 'Connected & Verified'}
                </span>
              </div>
              
              {showRealTimeData && githubHandle && (
                <button
                  onClick={fetchGitHubData}
                  disabled={isLoading}
                  className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                >
                  <ArrowPathIcon className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Updating...' : 'Refresh'}
                </button>
              )}
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                {error}
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
          {githubData && (
            <p className="text-xs text-karma-500 mt-1">
              Trust: {Math.round(displayData.trustFactor * 100)}%
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center p-6 bg-karma-50 rounded-xl border border-karma-100">
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
        
        <div className="text-center p-6 bg-karma-50 rounded-xl border border-karma-100">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-white rounded-xl shadow-soft">
              <ShieldCheckIcon className="h-6 w-6 text-accent-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-karma-900 mb-1">
            {(displayData.trustFactor * 100).toFixed(0)}%
          </div>
          <div className="text-karma-600 text-sm font-medium">Trust Factor</div>
          {githubData && (
            <div className="text-xs text-karma-500 mt-1">
              Based on contribution quality
            </div>
          )}
        </div>
        
        <div className="text-center p-6 bg-karma-50 rounded-xl border border-karma-100">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-white rounded-xl shadow-soft">
              <CodeBracketIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-karma-900 mb-1">
            {displayData.recentActivities}
          </div>
          <div className="text-karma-600 text-sm font-medium">
            {githubData ? 'Repositories' : 'Recent Activities'}
          </div>
          {githubData && (
            <div className="text-xs text-karma-500 mt-1">
              {githubData.totalContributions.issues} issues resolved
            </div>
          )}
        </div>
      </div>

      {/* GitHub Languages */}
      {githubData && displayData.topLanguages.length > 0 && (
        <div className="border-t border-karma-100 pt-6">
          <h4 className="text-sm font-medium text-karma-700 mb-3">Top Languages</h4>
          <div className="flex flex-wrap gap-2">
            {displayData.topLanguages.slice(0, 6).map((language, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {language}
              </span>
            ))}
            {displayData.topLanguages.length > 6 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-karma-100 text-karma-600">
                +{displayData.topLanguages.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* GitHub Analysis CTA */}
      {githubHandle && !githubData && showRealTimeData && (
        <div className="border-t border-karma-100 pt-6">
          <div className="text-center bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Get Real-Time GitHub Analysis</h4>
            <p className="text-xs text-blue-700 mb-3">
              Connect to our backend to see live karma scoring, contribution analysis, and AI insights.
            </p>
            <button
              onClick={fetchGitHubData}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TrophyIcon className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Analyzing...' : 'Analyze GitHub Profile'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KarmaCard; 