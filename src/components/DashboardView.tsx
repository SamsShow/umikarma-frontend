import React, { useState } from 'react';
import { 
  Squares2X2Icon, 
  ChartBarIcon, 
  ShieldCheckIcon,
  ClockIcon,
  GlobeAltIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import KarmaCard from './KarmaCard';
import ContributionList from './ContributionList';
import DAOAccessDashboard from './DAOAccessDashboard';
import KarmaHistory from './KarmaHistory';
import PlatformStats from './PlatformStats';
import AddContributionModal from './AddContributionModal';
import MockDataService from '../services/mockData';
import { AuthUser } from '../store/authStore';

interface DashboardViewProps {
  user: AuthUser;
  showMockData?: boolean;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  user, 
  showMockData = true 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'contributions' | 'dao-access' | 'history' | 'platform'>('overview');
  const [showAddContribution, setShowAddContribution] = useState(false);

  const tabs = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: Squares2X2Icon,
      description: 'Your karma profile and recent activity'
    },
    { 
      id: 'contributions', 
      name: 'Contributions', 
      icon: ChartBarIcon,
      description: 'All your contributions across platforms'
    },
    { 
      id: 'dao-access', 
      name: 'DAO Access', 
      icon: ShieldCheckIcon,
      description: 'Your access levels to various DAOs'
    },
    { 
      id: 'history', 
      name: 'History', 
      icon: ClockIcon,
      description: 'Karma progression and trends'
    },
    { 
      id: 'platform', 
      name: 'Platform', 
      icon: GlobeAltIcon,
      description: 'Community statistics and activity'
    }
  ];

  const handleContributionAdded = () => {
    console.log('Contribution added successfully');
    setShowAddContribution(false);
  };

  const getDemoNotice = () => {
    if (!showMockData) return null;
    
    return (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Squares2X2Icon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 mb-1">Demo Mode Active</p>
            <p className="text-blue-700 text-xs">
              You're viewing UmiKarma with demonstration data to showcase the full platform experience. 
              Connect your wallet and GitHub account to see your real reputation data.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <KarmaCard user={user} showRealTimeData={false} />
            <ContributionList 
              contributions={[]}
              githubUsername={user.githubData?.username}
              showRealTimeData={false}
              useMockData={showMockData}
              defaultExpanded={true}
            />
          </div>
        );
      
      case 'contributions':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-karma-900">All Contributions</h2>
                <p className="text-karma-600 mt-1">
                  Complete history of your cross-platform contributions
                </p>
              </div>
              <button
                onClick={() => setShowAddContribution(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Contribution</span>
              </button>
            </div>
            
            <ContributionList 
              contributions={[]}
              githubUsername={user.githubData?.username}
              showRealTimeData={false}
              useMockData={showMockData}
              defaultExpanded={true}
              isCollapsible={false}
            />
          </div>
        );
      
      case 'dao-access':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-karma-900">DAO Access Control</h2>
              <p className="text-karma-600 mt-1">
                Your access levels and privileges across decentralized organizations
              </p>
            </div>
            <DAOAccessDashboard />
          </div>
        );
      
      case 'history':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-karma-900">Karma History</h2>
              <p className="text-karma-600 mt-1">
                Track your karma progression and identify growth trends
              </p>
            </div>
            <KarmaHistory />
          </div>
        );
      
      case 'platform':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-karma-900">Platform Statistics</h2>
              <p className="text-karma-600 mt-1">
                Community insights and network health metrics
              </p>
            </div>
            <PlatformStats />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-karma-50 to-primary-50">
      <div className="container-custom">
        {getDemoNotice()}
        
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-karma-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group inline-flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-accent-500 text-accent-600'
                      : 'border-transparent text-karma-500 hover:text-karma-700 hover:border-karma-300'
                  }`}
                >
                  <tab.icon className={`h-5 w-5 ${
                    activeTab === tab.id ? 'text-accent-500' : 'text-karma-400 group-hover:text-karma-500'
                  }`} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Tab Description */}
          <div className="mt-4">
            <p className="text-sm text-karma-600">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {renderTabContent()}
        </div>
      </div>

      {/* Add Contribution Modal */}
      {showAddContribution && (
        <AddContributionModal
          isOpen={showAddContribution}
          onClose={() => setShowAddContribution(false)}
          userAddress={user.walletAddress || ''}
          onContributionAdded={handleContributionAdded}
        />
      )}
    </div>
  );
};

export default DashboardView; 