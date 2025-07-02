import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface CollapsibleCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  icon,
  children,
  defaultExpanded = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`${className.includes('demo-card') ? 'demo-card' : 'clean-card'} ${className}`}>
      {/* Header - Clickable */}
      <div 
        className="collapsible-header flex items-center justify-between cursor-pointer mb-6 p-3 -m-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="icon-glow">
            {icon}
          </div>
          <h3 className={`text-2xl font-bold ${className.includes('demo-card') ? 'text-purple-900' : 'text-karma-900'}`}>{title}</h3>
        </div>
        
        <button className={`${className.includes('demo-card') ? 'text-purple-400 hover:text-purple-600' : 'text-karma-400 hover:text-karma-600'} transition-all duration-300 hover:scale-110`}>
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Content - Only show when expanded */}
      {isExpanded && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleCard; 