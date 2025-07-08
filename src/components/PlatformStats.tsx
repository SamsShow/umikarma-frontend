import React from 'react';
import { 
  UsersIcon, 
  DocumentTextIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
  ClockIcon,
  StarIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import MockDataService from '../services/mockData';

const PlatformStats: React.FC = () => {
  const stats = MockDataService.getPlatformStats();
  const recentActivity = MockDataService.getRecentActivity();

  const statItems = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Contributions',
      value: stats.totalContributions.toLocaleString(),
      icon: DocumentTextIcon,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      borderColor: 'border-accent-200'
    },
    {
      title: 'Average Karma',
      value: stats.averageKarma.toFixed(1),
      icon: StarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Verified Users',
      value: stats.verifiedUsers.toLocaleString(),
      icon: ShieldCheckIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Active DAOs',
      value: stats.activeDAOs.toString(),
      icon: BuildingLibraryIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      title: 'Monthly Growth',
      value: `+${stats.monthlyGrowth}%`,
      icon: TrendingUpIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  ];

  const getActivityIcon = (action: string) => {
    if (action.includes('karma')) return <StarIcon className="h-4 w-4 text-accent-500" />;
    if (action.includes('joined')) return <TrendingUpIcon className="h-4 w-4 text-green-500" />;
    if (action.includes('verification')) return <ShieldCheckIcon className="h-4 w-4 text-blue-500" />;
    if (action.includes('published')) return <DocumentTextIcon className="h-4 w-4 text-purple-500" />;
    return <FireIcon className="h-4 w-4 text-orange-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Platform Statistics */}
      <div className="clean-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-karma-900">Platform Statistics</h3>
          <div className="flex items-center space-x-2">
            <TrendingUpIcon className="h-5 w-5 text-accent-500" />
            <span className="text-sm text-karma-600">Live Data</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statItems.map((stat, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${stat.borderColor} ${stat.bgColor} hover:scale-105 transition-transform duration-200`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-white border ${stat.borderColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <div className={`text-xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-karma-600">
                    {stat.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-r from-accent-50 to-blue-50 rounded-lg border border-accent-200">
            <div className="flex items-center space-x-2 mb-2">
              <ShieldCheckIcon className="h-5 w-5 text-accent-600" />
              <span className="font-medium text-accent-800">Verification Rate</span>
            </div>
            <div className="text-2xl font-bold text-accent-600">
              {((stats.verifiedUsers / stats.totalUsers) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-accent-700">
              {stats.verifiedUsers.toLocaleString()} of {stats.totalUsers.toLocaleString()} users verified
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <DocumentTextIcon className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-800">Contributions/User</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {(stats.totalContributions / stats.totalUsers).toFixed(1)}
            </div>
            <div className="text-sm text-purple-700">
              Average contributions per user
            </div>
          </div>
        </div>
      </div>

      {/* Recent Platform Activity */}
      <div className="clean-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-karma-900">Recent Activity</h3>
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5 text-karma-500" />
            <span className="text-sm text-karma-600">Live Feed</span>
          </div>
        </div>

        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div 
              key={index}
              className="flex items-start space-x-3 p-3 bg-karma-50 rounded-lg hover:bg-karma-100 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.action)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-karma-900">
                    {activity.user}
                  </span>
                  <span className="text-sm text-karma-600">
                    {activity.action}
                  </span>
                </div>
                <div className="text-sm text-karma-600 mt-1">
                  {activity.description}
                </div>
              </div>
              
              <div className="flex-shrink-0 text-xs text-karma-500">
                {activity.timestamp}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="text-sm text-accent-600 hover:text-accent-700 font-medium">
            View All Activity →
          </button>
        </div>
      </div>

      {/* Network Health */}
      <div className="clean-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-karma-900">Network Health</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600">Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">Smart Contracts</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-lg font-bold text-green-600 mt-1">Active</div>
            <div className="text-xs text-green-700">All systems operational</div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">API Services</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div className="text-lg font-bold text-blue-600 mt-1">99.9%</div>
            <div className="text-xs text-blue-700">Uptime this month</div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-800">Data Sync</span>
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            </div>
            <div className="text-lg font-bold text-purple-600 mt-1">&lt; 1s</div>
            <div className="text-xs text-purple-700">Average response time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats; 