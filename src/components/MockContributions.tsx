import React, { useState } from 'react';
import {
  EyeIcon,
  CodeBracketIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface MockContributionData {
  type: 'github' | 'dao' | 'forum';
  title: string;
  description: string;
  impact: number;
  date: string;
  aiSummary: string;
  repository?: string;
  languages?: string[];
}

interface MockContributionsProps {
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
}

const PaginationControls: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-purple-200">
      <div className="text-sm text-purple-600">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-purple-300 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <span className="px-3 py-1 text-sm font-medium text-purple-700">
          {currentPage}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-purple-300 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const MockContributions: React.FC<MockContributionsProps> = ({
  isCollapsible = true,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const mockContributions: MockContributionData[] = [
    {
      type: 'github',
      title: 'Implement Byzantine Fault Tolerant Consensus',
      description: 'Designed and implemented a new consensus mechanism for Umi Network that improves transaction throughput by 40% while maintaining security guarantees.',
      impact: 95,
      date: '2024-01-20',
      repository: 'umi-network/consensus',
      languages: ['Move', 'Rust'],
      aiSummary: 'This contribution represents a significant advancement in blockchain consensus mechanisms. The implementation demonstrates deep understanding of distributed systems and Byzantine fault tolerance, with measurable performance improvements that directly benefit the network.'
    },
    {
      type: 'github',
      title: 'Fix Memory Leak in Smart Contract Runtime',
      description: 'Identified and resolved a critical memory leak in the Move virtual machine that was causing node instability under high load conditions.',
      impact: 88,
      date: '2024-01-15',
      repository: 'umi-network/move-vm',
      languages: ['TypeScript', 'Move'],
      aiSummary: 'Critical bug fix that demonstrates strong debugging skills and understanding of virtual machine internals. The resolution of this memory leak significantly improves network stability and node performance.'
    },
    {
      type: 'dao',
      title: 'Gas Optimization Proposal for DeFi Protocols',
      description: 'Authored UIP-42 proposing gas optimization strategies for DeFi protocols on Umi Network, resulting in 25% reduction in transaction costs.',
      impact: 72,
      date: '2024-01-10',
      languages: ['Solidity'],
      aiSummary: 'Well-researched proposal that balances technical implementation with economic impact. The gas optimization strategies show deep understanding of both smart contract efficiency and DeFi protocol design.'
    }
  ];

  // Pagination logic
  const totalPages = Math.ceil(mockContributions.length / itemsPerPage);
  const paginatedContributions = mockContributions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      default:
        return <CodeBracketIcon className="h-5 w-5" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      github: 'bg-purple-100 text-purple-800 border-purple-200',
      dao: 'bg-purple-100 text-purple-800 border-purple-200',
      forum: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return badges[type as keyof typeof badges] || 'bg-purple-100 text-purple-800 border-purple-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="clean-card border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
      {/* Header - Collapsible */}
      <div 
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 ${
          isCollapsible ? 'cursor-pointer' : ''
        }`}
        onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
      >
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center space-x-3">
            <EyeIcon className="h-6 w-6 text-purple-600" />
            <h3 className="text-2xl font-bold text-purple-900">🎭 Demo Contributions</h3>
            {isCollapsible && (
              <button className="text-purple-400 hover:text-purple-600">
                {isExpanded ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
          <p className="text-sm text-purple-700 mt-1">
            Example blockchain contributions showing UmiKarma analysis
          </p>
        </div>
        
        {isExpanded && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-purple-700 bg-purple-200 px-3 py-1 rounded-full">
              {mockContributions.length} demo activities
            </span>
          </div>
        )}
      </div>

      {/* Demo Banner */}
      {isExpanded && (
        <div className="mb-6 p-4 bg-purple-100 border border-purple-300 rounded-lg">
          <div className="flex items-center space-x-2">
            <EyeIcon className="h-5 w-5 text-purple-600" />
            <span className="text-purple-800 text-sm font-medium">
              These are example contributions demonstrating how UmiKarma analyzes blockchain-focused activities.
            </span>
          </div>
        </div>
      )}

      {/* Content - Only show when expanded */}
      {isExpanded && (
        <>
          <div className="space-y-6">
            {paginatedContributions.map((activity, index) => (
              <div key={index} className="border border-purple-200 rounded-xl p-6 hover:shadow-soft transition-all duration-300 hover:border-purple-300 bg-white">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex-shrink-0">
                      {getTypeIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-semibold text-karma-900 text-lg">{activity.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeBadge(activity.type)}`}>
                          {activity.type.toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Repository info */}
                      {activity.repository && (
                        <div className="flex items-center gap-2 mb-2 text-sm text-karma-600">
                          <CodeBracketIcon className="h-4 w-4" />
                          <span>{activity.repository}</span>
                        </div>
                      )}
                      
                      <p className="text-karma-700 mb-3 leading-relaxed">{activity.description}</p>
                      
                      {/* Languages */}
                      {activity.languages && activity.languages.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {activity.languages.map((lang, i) => (
                            <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
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
                        <p className="text-primary-800 text-sm leading-relaxed">{activity.aiSummary}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default MockContributions; 