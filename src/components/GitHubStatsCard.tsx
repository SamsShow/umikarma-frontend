import React, { useEffect, useState } from 'react';
import { 
  CodeBracketIcon, 
  StarIcon, 
  UserGroupIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  LinkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { githubApiService, GitHubUserSummary } from '../services/githubApiService';

interface GitHubStatsCardProps {
  githubUsername?: string;
  showRealTimeData?: boolean;
}

export const GitHubStatsCard: React.FC<GitHubStatsCardProps> = ({
  githubUsername,
  showRealTimeData = false
}) => {
  const [githubData, setGithubData] = useState<GitHubUserSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showRealTimeData && githubUsername) {
      fetchGitHubData();
    }
  }, [showRealTimeData, githubUsername]);

  const fetchGitHubData = async () => {
    if (!githubUsername) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await githubApiService.getUserSummary(githubUsername);
      
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

  if (!githubUsername) {
    return (
      <div className="clean-card mb-8">
        <div className="text-center py-12">
          <CodeBracketIcon className="h-16 w-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Connect GitHub for Enhanced Analytics</h3>
          <p className="text-slate-600">
            Link your GitHub account to see detailed contribution analysis and get personalized karma insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="clean-card mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <CodeBracketIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Your GitHub Analytics</h3>
            <p className="text-slate-600 text-sm">Real-time data from your repositories</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Status Indicator */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            githubData 
              ? 'bg-green-100 text-green-800' 
              : isLoading 
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {githubData ? (
              <CheckCircleIcon className="h-4 w-4 mr-1" />
            ) : error ? (
              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowPathIcon className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            )}
            {githubData ? 'Live Data' : isLoading ? 'Loading...' : 'Ready'}
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={fetchGitHubData}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 text-sm font-medium"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Failed to load GitHub data</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <button
            onClick={fetchGitHubData}
            className="mt-2 text-red-700 hover:text-red-800 text-sm font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !githubData && (
        <div className="text-center py-12">
          <ArrowPathIcon className="h-8 w-8 mx-auto text-blue-600 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Analyzing Your GitHub Profile</h3>
          <p className="text-slate-600">Fetching your latest contributions and calculating karma score...</p>
        </div>
      )}

      {/* GitHub Data Display */}
      {githubData && (
        <>
          {/* Profile Section */}
          <div className="flex items-center space-x-4 mb-8 p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
            <img
              src={githubData.avatar_url}
              alt={githubData.username}
              className="w-16 h-16 rounded-full border-2 border-white shadow-md"
            />
            <div className="flex-1">
              <h4 className="text-xl font-bold text-slate-900">
                {githubData.name || githubData.username}
              </h4>
              <p className="text-slate-600 mb-2">@{githubData.username}</p>
              <a
                href={githubData.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                View GitHub Profile
              </a>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {Math.round(githubData.karmaScore)}
              </div>
              <div className="text-slate-600 font-medium">Karma Score</div>
              <div className="text-sm text-slate-500">Trust: {Math.round(githubData.trustFactor * 100)}%</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
              <CodeBracketIcon className="h-8 w-8 mx-auto text-green-600 mb-3" />
              <div className="text-2xl font-bold text-green-800 mb-1">
                {githubData.totalContributions.commits.toLocaleString()}
              </div>
              <div className="text-green-700 font-medium">Commits</div>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
              <StarIcon className="h-8 w-8 mx-auto text-purple-600 mb-3" />
              <div className="text-2xl font-bold text-purple-800 mb-1">
                {githubData.totalContributions.pullRequests.toLocaleString()}
              </div>
              <div className="text-purple-700 font-medium">Pull Requests</div>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-200">
              <ExclamationTriangleIcon className="h-8 w-8 mx-auto text-orange-600 mb-3" />
              <div className="text-2xl font-bold text-orange-800 mb-1">
                {githubData.totalContributions.issues.toLocaleString()}
              </div>
              <div className="text-orange-700 font-medium">Issues</div>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
              <UserGroupIcon className="h-8 w-8 mx-auto text-blue-600 mb-3" />
              <div className="text-2xl font-bold text-blue-800 mb-1">
                {githubData.totalContributions.repositories.toLocaleString()}
              </div>
              <div className="text-blue-700 font-medium">Repositories</div>
            </div>
          </div>

          {/* Languages */}
          {githubData.topLanguages.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Top Programming Languages</h4>
              <div className="flex flex-wrap gap-2">
                {githubData.topLanguages.slice(0, 10).map((language, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Button */}
          <div className="text-center pt-6 border-t border-slate-200">
            <button
              onClick={() => {
                // This will switch to the GitHub Analysis tab
                const analysisTab = document.querySelector('[data-tab="github-analysis"]') as HTMLButtonElement;
                if (analysisTab) {
                  analysisTab.click();
                }
              }}
              className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              View Detailed Analysis
            </button>
          </div>

          {/* Last Updated */}
          <div className="mt-4 flex items-center justify-center text-sm text-slate-500">
            <ClockIcon className="h-4 w-4 mr-1" />
            Last updated: {new Date(githubData.lastActivity).toLocaleDateString()}
          </div>
        </>
      )}

      {/* No Data State */}
      {!isLoading && !githubData && !error && (
        <div className="text-center py-12">
          <CodeBracketIcon className="h-16 w-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Ready to Analyze</h3>
          <p className="text-slate-600 mb-4">
            Click refresh to load your GitHub statistics and karma analysis.
          </p>
          <button
            onClick={fetchGitHubData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Load My GitHub Stats
          </button>
        </div>
      )}
    </div>
  );
}; 