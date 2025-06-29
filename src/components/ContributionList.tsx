import React, { useEffect, useState } from 'react';
import { 
  CodeBracketIcon, 
  ChartBarIcon, 
  ChatBubbleLeftRightIcon,
  UserIcon,
  SparklesIcon,
  ArrowPathIcon,
  LinkIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { githubApiService, ContributionActivity } from '../services/githubApiService';

interface ContributionData {
  type: 'github' | 'dao' | 'forum';
  title: string;
  description: string;
  impact: number;
  date: string;
  aiSummary: string;
}

interface ContributionListProps {
  contributions: ContributionData[];
  githubUsername?: string;
  showRealTimeData?: boolean;
}

const ContributionList: React.FC<ContributionListProps> = ({ 
  contributions, 
  githubUsername,
  showRealTimeData = false 
}) => {
  const [githubActivities, setGithubActivities] = useState<ContributionActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch GitHub activities if enabled
  useEffect(() => {
    if (showRealTimeData && githubUsername) {
      fetchGitHubActivities();
    }
  }, [showRealTimeData, githubUsername]);

  const fetchGitHubActivities = async () => {
    if (!githubUsername) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await githubApiService.getUserActivities(githubUsername, 20);
      
      if (result.success && result.data) {
        setGithubActivities(result.data);
      } else {
        setError(result.error || 'Failed to fetch GitHub activities');
      }
    } catch (err) {
      setError('Network error fetching GitHub activities');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert GitHub activities to ContributionData format
  const convertGitHubActivity = (activity: ContributionActivity): ContributionData => ({
    type: 'github',
    title: activity.title,
    description: activity.description,
    impact: activity.impact,
    date: activity.date,
    aiSummary: activity.aiSummary || 'No AI analysis available for this contribution.'
  });

  // Combine GitHub activities with existing contributions
  const allContributions = [
    ...githubActivities.map(convertGitHubActivity),
    ...contributions
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const displayContributions = showRealTimeData && githubActivities.length > 0 
    ? allContributions 
    : contributions;
  const getImpactColor = (impact: number) => {
    if (impact >= 80) return 'bg-accent-100 text-accent-800 border-accent-200';
    if (impact >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <CodeBracketIcon className="h-5 w-5" />;
      case 'dao':
        return <ChartBarIcon className="h-5 w-5" />;
      case 'forum':
        return <ChatBubbleLeftRightIcon className="h-5 w-5" />;
      default:
        return <UserIcon className="h-5 w-5" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      github: 'bg-karma-100 text-karma-800 border-karma-200',
      dao: 'bg-primary-100 text-primary-800 border-primary-200',
      forum: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return badges[type as keyof typeof badges] || 'bg-karma-100 text-karma-800 border-karma-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="clean-card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-2xl font-bold text-karma-900">Recent Contributions</h3>
          {showRealTimeData && githubUsername && (
            <p className="text-sm text-karma-600 mt-1">
              {githubActivities.length > 0 
                ? `Showing live data from @${githubUsername}` 
                : 'GitHub data will appear here when available'
              }
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-karma-600 bg-karma-100 px-3 py-1 rounded-full">
            {displayContributions.length} activities
          </span>
          
          {showRealTimeData && githubUsername && (
            <button
              onClick={fetchGitHubActivities}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800 text-sm">{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {displayContributions.map((activity, index) => {
          // Find corresponding GitHub activity for additional data
          const githubActivity = githubActivities.find(ga => 
            ga.title === activity.title && ga.date === activity.date
          );
          
          return (
            <div key={index} className="border border-karma-200 rounded-xl p-6 hover:shadow-soft transition-all duration-300 hover:border-karma-300">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-3 bg-karma-50 rounded-xl border border-karma-200 flex-shrink-0">
                    {getTypeIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold text-karma-900 text-lg">{activity.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeBadge(activity.type)}`}>
                        {activity.type.toUpperCase()}
                      </span>
                      {githubActivity?.type && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {githubActivity.type.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    
                    {/* Repository info for GitHub activities */}
                    {githubActivity && (
                      <div className="flex items-center gap-2 mb-2 text-sm text-karma-600">
                        <CodeBracketIcon className="h-4 w-4" />
                        <span>{githubActivity.repository}</span>
                        {githubActivity.url && (
                          <a
                            href={githubActivity.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 ml-2"
                          >
                            <LinkIcon className="h-3 w-3 mr-1" />
                            View
                          </a>
                        )}
                      </div>
                    )}
                    
                    <p className="text-karma-600 mb-3 leading-relaxed">{activity.description}</p>
                    
                    {/* Programming languages for GitHub activities */}
                    {githubActivity?.languages && githubActivity.languages.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {githubActivity.languages.slice(0, 4).map((lang, i) => (
                          <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {lang}
                          </span>
                        ))}
                        {githubActivity.languages.length > 4 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            +{githubActivity.languages.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col lg:items-end space-y-2 lg:ml-4 mt-4 lg:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getImpactColor(activity.impact)}`}>
                    Impact Score: {activity.impact}
                  </span>
                  <span className="text-karma-500 text-sm whitespace-nowrap">{formatDate(activity.date)}</span>
                  {githubActivity && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      Live Data
                    </span>
                  )}
                </div>
              </div>
              
              {/* AI Summary */}
              {activity.aiSummary && (
                <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-soft flex-shrink-0">
                      <SparklesIcon className="h-4 w-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-karma-700 leading-relaxed">
                        <span className="font-semibold text-primary-700">AI Analysis:</span> {activity.aiSummary}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {displayContributions.length === 0 && (
        <div className="text-center py-12 text-karma-500">
          <div className="p-4 bg-karma-100 rounded-2xl inline-flex mb-4">
            <CodeBracketIcon className="h-12 w-12 text-karma-400" />
          </div>
          <h4 className="text-lg font-medium text-karma-700 mb-2">No contributions found</h4>
          <p className="text-karma-600 mb-4">
            {showRealTimeData && githubUsername 
              ? `No activities found for @${githubUsername}. Try refreshing or check if the user has public repositories.`
              : 'Connect your accounts to start building your karma score!'
            }
          </p>
          
          {showRealTimeData && githubUsername && !isLoading && (
            <button
              onClick={fetchGitHubActivities}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Retry GitHub Analysis
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ContributionList; 