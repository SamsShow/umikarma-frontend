import React from 'react';
import { 
  CodeBracketIcon, 
  ChartBarIcon, 
  ChatBubbleLeftRightIcon,
  UserIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

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
}

const ContributionList: React.FC<ContributionListProps> = ({ contributions }) => {
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
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-karma-900">Recent Contributions</h3>
        <span className="text-sm text-karma-600 bg-karma-100 px-3 py-1 rounded-full">
          {contributions.length} activities
        </span>
      </div>

      <div className="space-y-6">
        {contributions.map((activity, index) => (
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
                  </div>
                  <p className="text-karma-600 mb-3 leading-relaxed">{activity.description}</p>
                </div>
              </div>
              
              <div className="flex flex-col lg:items-end space-y-2 lg:ml-4 mt-4 lg:mt-0">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getImpactColor(activity.impact)}`}>
                  Impact Score: {activity.impact}
                </span>
                <span className="text-karma-500 text-sm whitespace-nowrap">{formatDate(activity.date)}</span>
              </div>
            </div>
            
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
          </div>
        ))}
      </div>
      
      {contributions.length === 0 && (
        <div className="text-center py-12 text-karma-500">
          <div className="p-4 bg-karma-100 rounded-2xl inline-flex mb-4">
            <CodeBracketIcon className="h-12 w-12 text-karma-400" />
          </div>
          <h4 className="text-lg font-medium text-karma-700 mb-2">No contributions found</h4>
          <p className="text-karma-600">Connect your accounts to start building your karma score!</p>
        </div>
      )}
    </div>
  );
};

export default ContributionList; 