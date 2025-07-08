import React from 'react';
import { 
  ArrowTrendingUpIcon as TrendingUpIcon, 
  ArrowTrendingDownIcon as TrendingDownIcon,
  ChartBarIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import MockDataService, { MockKarmaHistory } from '../services/mockData';

const KarmaHistory: React.FC = () => {
  const karmaHistory = MockDataService.getUserKarmaHistory();
  const currentUser = MockDataService.getCurrentUser();

  // Calculate trend data
  const calculateTrend = () => {
    if (karmaHistory.length < 2) return { direction: 'stable', percentage: 0 };
    
    const recent = karmaHistory.slice(0, 3);
    const older = karmaHistory.slice(-3);
    
    const recentAvg = recent.reduce((sum, h) => sum + h.score, 0) / recent.length;
    const olderAvg = older.reduce((sum, h) => sum + h.score, 0) / older.length;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    return {
      direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
      percentage: Math.abs(change)
    };
  };

  const trend = calculateTrend();

  const getTrendIcon = () => {
    switch (trend.direction) {
      case 'up':
        return <TrendingUpIcon className="h-5 w-5 text-accent-500" />;
      case 'down':
        return <TrendingDownIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ChartBarIcon className="h-5 w-5 text-karma-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend.direction) {
      case 'up': return 'text-accent-600';
      case 'down': return 'text-red-600';
      default: return 'text-karma-600';
    }
  };

  const getTrendText = () => {
    switch (trend.direction) {
      case 'up': return `+${trend.percentage.toFixed(1)}% this week`;
      case 'down': return `-${trend.percentage.toFixed(1)}% this week`;
      default: return 'Stable this week';
    }
  };

  // Calculate score range for chart scaling
  const maxScore = Math.max(...karmaHistory.map(h => h.score));
  const minScore = Math.min(...karmaHistory.map(h => h.score));
  const scoreRange = maxScore - minScore;

  const getBarHeight = (score: number) => {
    if (scoreRange === 0) return 50;
    return 20 + ((score - minScore) / scoreRange) * 80; // 20-100% height
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-accent-600';
    if (change < 0) return 'text-red-600';
    return 'text-karma-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '+';
    if (change < 0) return '';
    return '±';
  };

  return (
    <div className="clean-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-karma-900">Karma History</h3>
        <div className="flex items-center space-x-2">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {getTrendText()}
          </span>
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-accent-50 rounded-lg border border-accent-200">
          <div className="text-2xl font-bold text-accent-600">{currentUser.karmaScore}</div>
          <div className="text-sm text-accent-700">Current Score</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{maxScore}</div>
          <div className="text-sm text-blue-700">All-Time High</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            {karmaHistory.reduce((sum, h) => sum + h.change, 0)}
          </div>
          <div className="text-sm text-purple-700">Total Gained</div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-karma-700 mb-3">Score Progression</h4>
        <div className="relative h-32 flex items-end justify-between space-x-1 bg-karma-50 rounded-lg p-4">
          {karmaHistory.slice().reverse().map((history, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-accent-500 rounded-t transition-all duration-300 hover:bg-accent-600 relative group"
                style={{ height: `${getBarHeight(history.score)}%` }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-karma-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                  <div className="font-medium">{history.score} karma</div>
                  <div className="text-karma-300">{formatDate(history.date)}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-karma-900"></div>
                </div>
              </div>
              <div className="text-xs text-karma-500 mt-1 transform -rotate-45 origin-left">
                {formatDate(history.date)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Changes */}
      <div>
        <h4 className="text-sm font-medium text-karma-700 mb-3">Recent Changes</h4>
        <div className="space-y-2">
          {karmaHistory.slice(0, 5).map((history, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-karma-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-4 w-4 text-karma-400" />
                <div>
                  <div className="text-sm font-medium text-karma-900">
                    {formatDate(history.date)}
                  </div>
                  <div className="text-xs text-karma-600">{history.reason}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-karma-700">
                  {history.score}
                </div>
                <div className={`text-sm font-medium ${getChangeColor(history.change)}`}>
                  {getChangeIcon(history.change)}{Math.abs(history.change)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <StarIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 mb-1">Karma Insights</p>
            <p className="text-blue-700 text-xs">
              Your karma has grown by {karmaHistory.reduce((sum, h) => sum + h.change, 0)} points 
              over the last {karmaHistory.length} recorded activities. 
              {trend.direction === 'up' && " You're on an upward trend!"} 
              {trend.direction === 'down' && " Focus on high-impact contributions to recover."} 
              {trend.direction === 'stable' && " Consistent performance - consider diversifying contribution types."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KarmaHistory; 