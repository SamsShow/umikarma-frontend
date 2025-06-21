import React from 'react';
import { UserIcon, TrophyIcon, ShieldCheckIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface KarmaCardProps {
  karmaScore: number;
  totalContributions: number;
  trustFactor: number;
  recentActivities: number;
  githubHandle: string;
  wallet: string;
}

const KarmaCard: React.FC<KarmaCardProps> = ({
  karmaScore,
  totalContributions,
  trustFactor,
  recentActivities,
  githubHandle,
  wallet
}) => {
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

  return (
    <div className="clean-card mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="flex items-center space-x-6 mb-6 lg:mb-0">
          <div className="h-20 w-20 bg-karma-900 rounded-2xl flex items-center justify-center flex-shrink-0">
            <UserIcon className="h-10 w-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-karma-900 mb-1">@{githubHandle}</h2>
            <p className="text-karma-600 font-mono text-sm">{wallet.slice(0, 6)}...{wallet.slice(-4)}</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="h-2 w-2 bg-accent-500 rounded-full"></div>
              <span className="text-sm text-karma-600">Connected & Verified</span>
            </div>
          </div>
        </div>
        
        <div className="text-center lg:text-right">
          <div className={`inline-flex items-center justify-center h-20 w-20 rounded-2xl ${getScoreBg(karmaScore)} mb-2`}>
            <div className={`text-3xl font-bold ${getScoreColor(karmaScore)}`}>
              {karmaScore}
            </div>
          </div>
          <p className="text-karma-600 font-medium">Karma Score</p>
          <p className="text-sm text-karma-500">out of 100</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-karma-50 rounded-xl border border-karma-100">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-white rounded-xl shadow-soft">
              <TrophyIcon className="h-6 w-6 text-karma-700" />
            </div>
          </div>
          <div className="text-2xl font-bold text-karma-900 mb-1">{totalContributions}</div>
          <div className="text-karma-600 text-sm font-medium">Total Contributions</div>
        </div>
        
        <div className="text-center p-6 bg-karma-50 rounded-xl border border-karma-100">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-white rounded-xl shadow-soft">
              <ShieldCheckIcon className="h-6 w-6 text-accent-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-karma-900 mb-1">{(trustFactor * 100).toFixed(0)}%</div>
          <div className="text-karma-600 text-sm font-medium">Trust Factor</div>
        </div>
        
        <div className="text-center p-6 bg-karma-50 rounded-xl border border-karma-100">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-white rounded-xl shadow-soft">
              <CalendarIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-karma-900 mb-1">{recentActivities}</div>
          <div className="text-karma-600 text-sm font-medium">Recent Activities</div>
        </div>
      </div>
    </div>
  );
};

export default KarmaCard; 