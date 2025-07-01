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
    <div className={`clean-card ${className}`}>
      {/* Header - Clickable */}
      <div 
        className="flex items-center justify-between cursor-pointer mb-6"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          {icon}
          <h3 className="text-2xl font-bold text-karma-900">{title}</h3>
        </div>
        
        <button className="text-karma-400 hover:text-karma-600 transition-colors">
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