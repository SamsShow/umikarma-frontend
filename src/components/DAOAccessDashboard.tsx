import React from 'react';
import { 
  ShieldCheckIcon, 
  ShieldExclamationIcon,
  StarIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import MockDataService, { MockDAOAccess } from '../services/mockData';

const DAOAccessDashboard: React.FC = () => {
  const daoAccess = MockDataService.getDAOAccess();
  const currentUser = MockDataService.getCurrentUser();

  const getAccessLevelName = (level: number): string => {
    switch (level) {
      case 1: return 'Basic';
      case 2: return 'Contributor';
      case 3: return 'Trusted';
      case 4: return 'Elite';
      default: return 'Unknown';
    }
  };

  const getAccessLevelColor = (level: number): string => {
    switch (level) {
      case 1: return 'text-blue-600';
      case 2: return 'text-green-600';
      case 3: return 'text-purple-600';
      case 4: return 'text-amber-600';
      default: return 'text-karma-600';
    }
  };

  const getStatusIcon = (access: MockDAOAccess) => {
    if (access.accessGranted) {
      return <CheckCircleIcon className="h-5 w-5 text-accent-500" />;
    } else if (currentUser.karmaScore >= access.requiredKarma) {
      return <StarIcon className="h-5 w-5 text-amber-500" />;
    } else {
      return <LockClosedIcon className="h-5 w-5 text-karma-400" />;
    }
  };

  const getStatusText = (access: MockDAOAccess) => {
    if (access.accessGranted) {
      return 'Access Granted';
    } else if (currentUser.karmaScore >= access.requiredKarma) {
      return 'Eligible (Pending)';
    } else {
      const needed = access.requiredKarma - currentUser.karmaScore;
      return `Need +${needed} karma`;
    }
  };

  const getStatusColor = (access: MockDAOAccess) => {
    if (access.accessGranted) {
      return 'text-accent-600';
    } else if (currentUser.karmaScore >= access.requiredKarma) {
      return 'text-amber-600';
    } else {
      return 'text-karma-500';
    }
  };

  return (
    <div className="clean-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-karma-900">DAO Access Control</h3>
        <div className="flex items-center space-x-2">
          <ShieldCheckIcon className="h-5 w-5 text-accent-500" />
          <span className="text-sm text-karma-600">
            Current Karma: {currentUser.karmaScore}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {daoAccess.map((dao, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              dao.accessGranted 
                ? 'border-accent-200 bg-accent-50 hover:border-accent-300' 
                : currentUser.karmaScore >= dao.requiredKarma
                ? 'border-amber-200 bg-amber-50 hover:border-amber-300'
                : 'border-karma-200 bg-karma-50 hover:border-karma-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getStatusIcon(dao)}
                  <h4 className="font-semibold text-karma-900">{dao.daoName}</h4>
                  <span className={`text-sm font-medium ${getAccessLevelColor(dao.accessLevel)}`}>
                    {getAccessLevelName(dao.accessLevel)}
                  </span>
                </div>
                
                <p className="text-sm text-karma-600 mb-3">
                  {dao.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-xs text-karma-500">
                      Required: {dao.requiredKarma} karma
                    </div>
                    <div className="text-xs text-karma-400">
                      {dao.daoAddress.slice(0, 8)}...{dao.daoAddress.slice(-6)}
                    </div>
                  </div>
                  
                  <div className={`text-sm font-medium ${getStatusColor(dao)}`}>
                    {getStatusText(dao)}
                  </div>
                </div>
                
                {dao.accessGranted && (
                  <div className="mt-3 pt-3 border-t border-accent-200">
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-accent-500" />
                      <span className="text-xs text-accent-700 font-medium">
                        You can participate in governance and voting
                      </span>
                    </div>
                  </div>
                )}
                
                {!dao.accessGranted && currentUser.karmaScore >= dao.requiredKarma && (
                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <StarIcon className="h-4 w-4 text-amber-500" />
                        <span className="text-xs text-amber-700 font-medium">
                          Ready to apply for access
                        </span>
                      </div>
                      <button className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <ShieldExclamationIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 mb-1">Access Control System</p>
            <p className="text-blue-700 text-xs">
              DAO access is determined by your karma score and verification status. 
              Higher karma unlocks more prestigious DAOs and governance privileges. 
              All access changes are recorded on-chain for transparency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DAOAccessDashboard; 