import React, { useEffect, useState } from 'react';
import { 
  CodeBracketIcon, 
  ChartBarIcon, 
  ChatBubbleLeftRightIcon,
  UserIcon,
  SparklesIcon,
  ArrowPathIcon,
  LinkIcon,
  ExclamationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import { githubApiService, ContributionActivity } from '../services/githubApiService';
import MockDataService, { MockContribution } from '../services/mockData';
import CollapsibleCard from './CollapsibleCard';

interface ContributionData {
  type: 'github' | 'dao' | 'forum' | 'identity';
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
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
  useMockData?: boolean;
}

const PaginationControls: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-karma-200">
      <div className="text-sm text-karma-600">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <span className="px-4 py-2 text-sm font-semibold text-karma-700 bg-white/80 backdrop-blur-sm rounded-xl border border-karma-200/50">
          {currentPage}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const ContributionList: React.FC<ContributionListProps> = ({ 
  contributions, 
  githubUsername,
  showRealTimeData = false,
  isCollapsible = true,
  defaultExpanded = true,
  useMockData = false
}) => {
  const [githubActivities, setGithubActivities] = useState<ContributionActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  // Utility function to truncate text
  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

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

  // Convert mock contributions to ContributionData format
  const convertMockContribution = (mockContrib: MockContribution): ContributionData => ({
    type: mockContrib.type,
    title: mockContrib.title,
    description: mockContrib.description,
    impact: mockContrib.impact,
    date: mockContrib.date,
    aiSummary: mockContrib.aiSummary
  });

  // Get contributions based on data source priority
  const getDisplayContributions = () => {
    if (useMockData || (contributions.length === 0 && githubActivities.length === 0)) {
      // Use mock data if explicitly requested or as fallback
      return MockDataService.getUserContributions().map(convertMockContribution);
    } else if (showRealTimeData && githubActivities.length > 0) {
  // Combine GitHub activities with existing contributions
      return [
    ...githubActivities.map(convertGitHubActivity),
    ...contributions
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      // Use provided contributions
      return contributions;
    }
  };

  const displayContributions = getDisplayContributions();

  // Pagination logic
  const totalPages = Math.ceil(displayContributions.length / itemsPerPage);
  const paginatedContributions = displayContributions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when contributions change
  useEffect(() => {
    setCurrentPage(1);
  }, [displayContributions.length]);

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
      case 'identity':
        return <IdentificationIcon className="h-5 w-5" />;
      default:
        return <UserIcon className="h-5 w-5" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      github: 'bg-karma-100 text-karma-800 border-karma-200',
      dao: 'bg-primary-100 text-primary-800 border-primary-200',
      forum: 'bg-purple-100 text-purple-800 border-purple-200',
      identity: 'bg-indigo-100 text-indigo-800 border-indigo-200'
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
    <CollapsibleCard
      title="Recent Contributions"
      icon={<SparklesIcon className="h-6 w-6 text-karma-600" />}
      defaultExpanded={defaultExpanded}
    >
      {/* Subtitle and controls */}
      <div className="mb-6">
        {showRealTimeData && githubUsername && (
          <p className="text-sm text-karma-600 mb-3">
            {githubActivities.length > 0 
              ? `Showing live data from @${githubUsername}` 
              : 'GitHub data will appear here when available'
            }
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-karma-600 bg-karma-100/70 backdrop-blur-sm px-3 py-1 rounded-full border border-karma-200/50">
            {displayContributions.length} activities
          </span>
          
          {showRealTimeData && githubUsername && (
            <button
              onClick={fetchGitHubActivities}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-all duration-300"
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
            {paginatedContributions.map((activity, index) => {
              // Find corresponding GitHub activity for additional data
              const githubActivity = githubActivities.find(ga => 
                ga.title === activity.title && ga.date === activity.date
              );
              
              return (
                <div key={index} className="contribution-item">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 bg-karma-50 rounded-xl border border-karma-200 flex-shrink-0">
                        {getTypeIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-semibold text-karma-900 text-lg">{truncateText(activity.title, 80)}</h4>
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
                        
                        <p className="text-karma-700 mb-3 leading-relaxed">{truncateText(activity.description)}</p>
                        
                        {/* Languages for GitHub activities */}
                        {githubActivity?.languages && githubActivity.languages.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {githubActivity.languages.slice(0, 3).map((lang, i) => (
                              <span key={i} className="text-xs bg-karma-100 text-karma-700 px-2 py-1 rounded-full">
                                {lang}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-karma-600">
                          <span>{formatDate(activity.date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex-shrink-0">
                      <div className={`inline-flex items-center px-4 py-2 rounded-lg border font-semibold ${getImpactColor(activity.impact)}`}>
                        <span className="text-xl mr-2">{activity.impact}</span>
                        <span className="text-sm">Impact</span>
                      </div>
                    </div>
                  </div>
                  
                  {activity.aiSummary && (
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mt-4">
                      <div className="flex items-start space-x-3">
                        <SparklesIcon className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-primary-900 mb-2">AI Analysis</h5>
                          <p className="text-primary-800 text-sm leading-relaxed">{truncateText(activity.aiSummary, 150)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

      {displayContributions.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <UserIcon className="h-16 w-16 mx-auto text-karma-400 mb-4" />
          <h3 className="text-lg font-medium text-karma-900 mb-2">No contributions yet</h3>
          <p className="text-karma-600">
            {showRealTimeData && githubUsername
              ? 'No GitHub activities found for this user.'
              : 'Start contributing to see your activities here.'}
          </p>
        </div>
      )}
    </CollapsibleCard>
  );
};

export default ContributionList; 