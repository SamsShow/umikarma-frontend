import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ClockIcon, 
  CogIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  UserIcon,
  CodeBracketIcon,
  StarIcon,
  UserGroupIcon,
  CalendarIcon,
  LinkIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { 
  githubApiService, 
  GitHubUserSummary, 
  GitHubProfile, 
  GitHubAnalysisStatus,
  ContributionActivity 
} from '../services/githubApiService';
import { useAuthStore } from '../store/authStore';

interface GitHubAnalysisDashboardProps {
  initialUsername?: string;
}

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
  icon?: React.ReactNode;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ 
  title, 
  children, 
  isCollapsible = true, 
  defaultExpanded = true,
  icon 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white rounded-2xl shadow-xl mb-8">
      <div 
        className={`p-8 ${isCollapsible ? 'cursor-pointer' : ''} ${!isExpanded ? 'border-b border-slate-200' : ''}`}
        onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon}
            <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          </div>
          {isCollapsible && (
            <button className="text-slate-400 hover:text-slate-600">
              {isExpanded ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="px-8 pb-8">
          {children}
        </div>
      )}
    </div>
  );
};

const PaginationControls: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-slate-600">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const GitHubAnalysisDashboard: React.FC<GitHubAnalysisDashboardProps> = ({ 
  initialUsername = '' 
}) => {
  const { user } = useAuthStore();
  const [username, setUsername] = useState(initialUsername);
  const [searchQuery, setSearchQuery] = useState(initialUsername);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Data states
  const [summary, setSummary] = useState<GitHubUserSummary | null>(null);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [activities, setActivities] = useState<ContributionActivity[]>([]);
  const [analysisStatus, setAnalysisStatus] = useState<GitHubAnalysisStatus | null>(null);
  
  // UI states
  const [error, setError] = useState<string | null>(null);
  
  // Check if we're viewing the current user's profile
  const isCurrentUser = username && user?.githubData?.username === username;
  const currentUserGithubUsername = user?.githubData?.username;

  // Mock contributions for demonstration
  const mockContributions: ContributionActivity[] = [
    {
      type: 'commit',
      repository: 'umi-network/core',
      title: 'feat: Add new consensus mechanism',
      description: 'Implemented advanced Byzantine fault tolerance with improved performance',
      url: '#',
      date: '2024-06-25T10:00:00Z',
      impact: 95,
      languages: ['Move', 'Rust'],
      aiSummary: 'High-impact contribution improving network security and performance.'
    },
    {
      type: 'pull_request',
      repository: 'umi-network/sdk',
      title: 'fix: Resolve memory leak in transaction processing',
      description: 'Critical bug fix that prevents memory overflow during high transaction volume',
      url: '#',
      date: '2024-06-24T14:30:00Z',
      impact: 88,
      languages: ['TypeScript', 'Move'],
      aiSummary: 'Essential bug fix ensuring system stability under load.'
    },
    {
      type: 'issue',
      repository: 'ethereum/solidity',
      title: 'Enhancement: Improve gas optimization for large contracts',
      description: 'Proposed optimization techniques for reducing gas costs in complex smart contracts',
      url: '#',
      date: '2024-06-23T09:15:00Z',
      impact: 72,
      languages: ['Solidity'],
      aiSummary: 'Valuable optimization proposal benefiting the broader Ethereum ecosystem.'
    }
  ];

  // Pagination logic
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const paginatedActivities = activities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Load initial user data if username provided
  useEffect(() => {
    if (username) {
      loadUserData(username);
    }
  }, [username]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setError(null);
    setCurrentPage(1); // Reset pagination
    
    try {
      // Validate username first
      const validateResult = await githubApiService.validateUsername(searchQuery.trim());
      
      if (!validateResult.success || !validateResult.data?.exists) {
        setError(`GitHub user "${searchQuery}" not found`);
        return;
      }
      
      setUsername(searchQuery.trim());
    } catch (err) {
      setError('Failed to search for user');
    } finally {
      setIsSearching(false);
    }
  };

  const loadUserData = async (user: string) => {
    try {
      setError(null);
      
      // Load available data immediately
      const data = await githubApiService.getEnhancedUserData(user);
      
      setSummary(data.summary);
      setActivities(data.activities);
      setProfile(data.profile);
      
      // If no profile exists, we might need to trigger analysis
      if (!data.profile && data.summary) {
        // Check if analysis is already in progress
        const statusResult = await githubApiService.getAnalysisStatus(user);
        if (statusResult.success && statusResult.data) {
          setAnalysisStatus(statusResult.data);
          
          if (statusResult.data.status === 'in_progress') {
            pollAnalysisStatus(user);
          }
        }
      }
      
      // For current user, automatically suggest starting deep analysis if no complete profile
      const currentUserUsername = currentUserGithubUsername;
      if (user === currentUserUsername && !data.profile && data.summary) {
        // Auto-suggest analysis for current user
        console.log('Suggesting deep analysis for current user');
      }
    } catch (err) {
      setError('Failed to load user data');
      console.error('Error loading user data:', err);
    }
  };

  const startDeepAnalysis = async () => {
    if (!username) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await githubApiService.startUserAnalysis(username);
      
      if (result.success && result.data) {
        setAnalysisStatus(result.data);
        pollAnalysisStatus(username);
      } else {
        setError(result.error || 'Failed to start analysis');
      }
    } catch (err) {
      setError('Failed to start analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const pollAnalysisStatus = (user: string) => {
    const poll = async () => {
      try {
        const statusResult = await githubApiService.getAnalysisStatus(user);
        
        if (statusResult.success && statusResult.data) {
          setAnalysisStatus(statusResult.data);
          
          if (statusResult.data.status === 'completed') {
            // Reload user data to get the complete profile
            loadUserData(user);
          } else if (statusResult.data.status === 'failed') {
            setError(statusResult.data.error || 'Analysis failed');
          } else if (statusResult.data.status === 'in_progress') {
            // Continue polling
            setTimeout(poll, 2000);
          }
        }
      } catch (err) {
        console.error('Error polling analysis status:', err);
      }
    };
    
    poll();
  };

  const getKarmaScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-amber-600';
    if (score >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-red-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {isCurrentUser ? 'Your GitHub Karma Analysis' : 'GitHub Karma Analysis'}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {isCurrentUser 
              ? 'Comprehensive analysis of your GitHub contributions and reputation score'
              : 'Get comprehensive reputation analysis of any GitHub user with AI-powered insights'
            }
          </p>
          
          {/* Current User Badge */}
          {isCurrentUser && user?.githubData && (
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Viewing your profile: @{user.githubData.username}
            </div>
          )}
        </div>

        {/* Current User Quick Actions */}
        {currentUserGithubUsername && !isCurrentUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Want to analyze your own GitHub profile?
              </h3>
              <p className="text-blue-700 mb-4">
                Switch to your profile (@{currentUserGithubUsername}) for personalized insights.
              </p>
              <button
                onClick={() => {
                  setUsername(currentUserGithubUsername);
                  setSearchQuery(currentUserGithubUsername);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View My Profile
              </button>
            </div>
          </div>
        )}

        {/* Search Section - Collapsible */}
        <CollapsibleCard 
          title="GitHub User Search" 
          icon={<MagnifyingGlassIcon className="h-6 w-6 text-slate-600" />}
          defaultExpanded={!summary}
        >
          <div className="max-w-2xl mx-auto">
            {/* Mode Toggle */}
            {currentUserGithubUsername && (
              <div className="flex justify-center mb-6">
                <div className="bg-slate-100 p-1 rounded-lg inline-flex">
                  <button
                    onClick={() => {
                      setUsername(currentUserGithubUsername);
                      setSearchQuery(currentUserGithubUsername);
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isCurrentUser
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setUsername('');
                      setSearchQuery('');
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      !isCurrentUser
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Search Others
                  </button>
                </div>
              </div>
            )}
            
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
              {isCurrentUser ? 'Your GitHub Username' : 'GitHub Username'}
            </label>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  id="username"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={isCurrentUser ? `Your username: ${username}` : "Enter GitHub username (e.g., octocat)"}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSearching}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSearching ? 'Searching...' : 'Analyze'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            )}
          </div>
        </CollapsibleCard>

        {/* Repository Filtering Information - Collapsible */}
        <CollapsibleCard 
          title="Repository Filtering Active" 
          icon={<ExclamationTriangleIcon className="h-6 w-6 text-blue-600" />}
        >
          <p className="text-blue-800 mb-3">
            Only repositories that meet specific criteria are included in karma calculations:
          </p>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              Repositories with <strong>"umi"</strong> tag or topic
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              Repositories using <strong>Move</strong> or <strong>Solidity</strong> programming languages
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              Forked and archived repositories are excluded
            </div>
          </div>
          <p className="text-blue-700 text-sm mt-3">
            This filtering ensures karma scores reflect contributions to blockchain and Umi ecosystem projects.
            If you have eligible repositories but see a low score, make sure your repos are tagged appropriately.
          </p>
        </CollapsibleCard>

        {/* 1. KARMA DASHBOARD - First and non-collapsible */}
        {summary && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img
                  src={summary.avatar_url}
                  alt={summary.username}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {summary.name || summary.username}
                  </h2>
                  <p className="text-slate-600">@{summary.username}</p>
                  <a
                    href={summary.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-1"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    View on GitHub
                  </a>
                </div>
              </div>
              
              {!profile && (
                <button
                  onClick={startDeepAnalysis}
                  disabled={isAnalyzing}
                  className={`inline-flex items-center px-4 py-2 text-white rounded-lg focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                    isCurrentUser 
                      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                      : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
                  }`}
                >
                  {isAnalyzing ? (
                    <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                  )}
                  {isAnalyzing 
                    ? (isCurrentUser ? 'Analyzing Your Profile...' : 'Starting Analysis...') 
                    : (isCurrentUser ? 'Analyze My Profile' : 'Deep Analysis')
                  }
                </button>
              )}
            </div>

            {/* Karma Score Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getKarmaScoreColor(summary.karmaScore)}`}>
                  {Math.round(summary.karmaScore)}
                </div>
                <div className="text-slate-600 font-medium">Karma Score</div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(summary.karmaScore)}`}
                    style={{ width: `${summary.karmaScore}%` }}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {Math.round(summary.trustFactor * 100)}%
                </div>
                <div className="text-slate-600 font-medium">Trust Factor</div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                    style={{ width: `${summary.trustFactor * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {summary.totalContributions.commits + summary.totalContributions.pullRequests + summary.totalContributions.issues}
                </div>
                <div className="text-slate-600 font-medium">Total Contributions</div>
                <div className="text-sm text-slate-500 mt-1">
                  {summary.totalContributions.commits} commits • {summary.totalContributions.pullRequests} PRs • {summary.totalContributions.issues} issues
                </div>
              </div>
            </div>

            {/* Languages */}
            {summary.topLanguages.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Top Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {summary.topLanguages.slice(0, 8).map((language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. GITHUB ANALYSIS STATUS - Collapsible */}
        {analysisStatus && (
          <CollapsibleCard 
            title="Deep Analysis" 
            icon={<ChartBarIcon className="h-6 w-6 text-slate-600" />}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                analysisStatus.status === 'completed' 
                  ? 'bg-green-100 text-green-800'
                  : analysisStatus.status === 'failed'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {analysisStatus.status === 'completed' && <CheckCircleIcon className="h-4 w-4 mr-1" />}
                {analysisStatus.status === 'failed' && <ExclamationTriangleIcon className="h-4 w-4 mr-1" />}
                {analysisStatus.status === 'in_progress' && <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />}
                {analysisStatus.status.replace('_', ' ')}
              </div>
            </div>
            
            {analysisStatus.status === 'in_progress' && (
              <div>
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Progress</span>
                  <span>{analysisStatus.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                    style={{ width: `${analysisStatus.progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {analysisStatus.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                {analysisStatus.error}
              </div>
            )}
          </CollapsibleCard>
        )}

        {/* 3. DETAILED PROFILE - Collapsible */}
        {profile && (
          <CollapsibleCard 
            title={isCurrentUser ? 'Your Detailed Profile Analysis' : 'Detailed Profile Analysis'}
            icon={<UserIcon className="h-6 w-6 text-slate-600" />}
          >
            {isCurrentUser && (
              <div className="text-sm text-slate-600 mb-6">
                Last analyzed: {new Date(profile.lastAnalyzed).toLocaleDateString()}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <UserGroupIcon className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-slate-900">{profile.user.followers}</div>
                <div className="text-sm text-slate-600">Followers</div>
              </div>
              
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <CodeBracketIcon className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold text-slate-900">{profile.user.public_repos}</div>
                <div className="text-sm text-slate-600">Public Repos</div>
              </div>
              
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <StarIcon className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                <div className="text-2xl font-bold text-slate-900">{profile.totalContributions.totalImpactScore}</div>
                <div className="text-sm text-slate-600">Impact Score</div>
              </div>
              
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <CalendarIcon className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <div className="text-2xl font-bold text-slate-900">
                  {Math.round(profile.profileCompleteness)}%
                </div>
                <div className="text-sm text-slate-600">Completeness</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Contribution Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Commits</span>
                    <span className="font-semibold">{profile.totalContributions.commits.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Pull Requests</span>
                    <span className="font-semibold">{profile.totalContributions.pullRequests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Issues</span>
                    <span className="font-semibold">{profile.totalContributions.issues.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Code Reviews</span>
                    <span className="font-semibold">{profile.totalContributions.codeReviews.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Code Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Lines Added</span>
                    <span className="font-semibold text-green-600">+{profile.totalContributions.linesAdded.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Lines Deleted</span>
                    <span className="font-semibold text-red-600">-{profile.totalContributions.linesDeleted.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Repositories Contributed</span>
                    <span className="font-semibold">{profile.totalContributions.repositoriesContributed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Last Analyzed</span>
                    <span className="font-semibold">{new Date(profile.lastAnalyzed).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleCard>
        )}

        {/* 4. MOCK CONTRIBUTIONS - Separate card */}
        {mockContributions.length > 0 && (
          <CollapsibleCard 
            title="🎭 Demo Contributions" 
            icon={<EyeIcon className="h-6 w-6 text-purple-600" />}
          >
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <EyeIcon className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-800">Demo Data</span>
              </div>
              <p className="text-purple-700 text-sm">
                These are example contributions to demonstrate the karma scoring system. 
                They represent typical blockchain development activities.
              </p>
            </div>
            <div className="space-y-4">
              {mockContributions.map((activity, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mr-3 ${
                          activity.type === 'commit' ? 'bg-blue-100 text-blue-800' :
                          activity.type === 'pull_request' ? 'bg-green-100 text-green-800' :
                          activity.type === 'issue' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {activity.type.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-slate-600">{activity.repository}</span>
                      </div>
                      
                      <h4 className="font-medium text-slate-900 mb-1">{activity.title}</h4>
                      <p className="text-slate-600 text-sm mb-2">{activity.description}</p>
                      
                      {activity.aiSummary && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-2">
                          <div className="text-xs font-medium text-blue-800 mb-1">AI Summary</div>
                          <div className="text-sm text-blue-700">{activity.aiSummary}</div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {activity.languages.slice(0, 3).map((lang, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                              {lang}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-slate-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 text-right">
                      <div className={`text-lg font-bold ${getKarmaScoreColor(activity.impact)}`}>
                        {activity.impact}
                      </div>
                      <div className="text-xs text-slate-500">Impact</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleCard>
        )}

        {/* 5. RECENT CONTRIBUTIONS with PAGINATION - Collapsible */}
        {activities.length > 0 && (
          <CollapsibleCard 
            title={isCurrentUser ? 'Your Recent Contributions' : 'Recent Contributions'}
            icon={<ClockIcon className="h-6 w-6 text-slate-600" />}
          >
            <div className="space-y-4">
              {paginatedActivities.map((activity, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mr-3 ${
                          activity.type === 'commit' ? 'bg-blue-100 text-blue-800' :
                          activity.type === 'pull_request' ? 'bg-green-100 text-green-800' :
                          activity.type === 'issue' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {activity.type.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-slate-600">{activity.repository}</span>
                      </div>
                      
                      <h4 className="font-medium text-slate-900 mb-1">{activity.title}</h4>
                      <p className="text-slate-600 text-sm mb-2">{activity.description}</p>
                      
                      {activity.aiSummary && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-2">
                          <div className="text-xs font-medium text-blue-800 mb-1">AI Summary</div>
                          <div className="text-sm text-blue-700">{activity.aiSummary}</div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {activity.languages.slice(0, 3).map((lang, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                              {lang}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-slate-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 text-right">
                      <div className={`text-lg font-bold ${getKarmaScoreColor(activity.impact)}`}>
                        {activity.impact}
                      </div>
                      <div className="text-xs text-slate-500">Impact</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </CollapsibleCard>
        )}

        {/* No data state */}
        {!summary && !isSearching && username && (
          <div className="text-center py-12">
            <UserIcon className="h-16 w-16 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {isCurrentUser ? 'Ready to analyze your GitHub profile!' : 'No data found'}
            </h3>
            <p className="text-slate-600">
              {isCurrentUser 
                ? 'Click the search button above to start analyzing your contributions and build your karma score.'
                : 'Try searching for a different GitHub user.'
              }
            </p>
            {isCurrentUser && (
              <button
                onClick={handleSearch}
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Analyze My Profile
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 