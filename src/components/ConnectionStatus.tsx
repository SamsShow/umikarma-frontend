import React, { useState, useEffect, useRef } from 'react';
import { UserCircleIcon, CheckCircleIcon, XCircleIcon, ClockIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { githubApiService } from '../services/githubApiService';

interface ConnectionStatusProps {
  className?: string;
  onDisconnect?: () => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '', onDisconnect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check backend health every 30 seconds
  useEffect(() => {
    const checkBackendHealth = async () => {
      setBackendStatus('checking');
      try {
        const isHealthy = await githubApiService.isBackendHealthy();
        setBackendStatus(isHealthy ? 'online' : 'offline');
        setLastCheck(new Date());
      } catch (error) {
        console.error('Health check failed:', error);
        setBackendStatus('offline');
        setLastCheck(new Date());
      }
    };

    // Initial check
    checkBackendHealth();

    // Set up interval for periodic checks
    const interval = setInterval(checkBackendHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusIcon = () => {
    switch (backendStatus) {
      case 'online':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'offline':
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      case 'checking':
        return <ClockIcon className="h-4 w-4 text-yellow-600 animate-pulse" />;
    }
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'online':
        return 'border-green-500';
      case 'offline':
        return 'border-red-500';
      case 'checking':
        return 'border-yellow-500';
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case 'online':
        return 'All systems operational';
      case 'offline':
        return 'Some features may be unavailable';
      case 'checking':
        return 'Verifying system status...';
    }
  };

  const getStatusDotColor = () => {
    switch (backendStatus) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'checking':
        return 'bg-yellow-500';
    }
  };

  const formatLastCheck = () => {
    if (!lastCheck) return 'Never';
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastCheck.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastCheck.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleDisconnectClick = () => {
    setIsOpen(false);
    if (onDisconnect) {
      onDisconnect();
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Profile Icon with Status Indicator */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full border-2 ${getStatusColor()} hover:bg-karma-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-karma-500 focus:ring-offset-2`}
      >
        <UserCircleIcon className="h-8 w-8 text-karma-600" />
        
        {/* Status indicator dot */}
        <div className="absolute -top-1 -right-1">
          <div className={`h-3 w-3 rounded-full border-2 border-white status-indicator ${getStatusDotColor()}`} />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 profile-dropdown z-50">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-karma-900">System Status</h3>
              {getStatusIcon()}
            </div>
            
            <div className="space-y-3">
              {/* Main Status */}
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${getStatusDotColor()}`} />
                <span className={`text-sm font-medium ${
                  backendStatus === 'online' ? 'text-green-800' :
                  backendStatus === 'offline' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {getStatusText()}
                </span>
              </div>

              {/* Services Status */}
              <div className="space-y-2 pt-2 border-t border-karma-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-karma-600">Backend API</span>
                  <div className="flex items-center space-x-1">
                    {backendStatus === 'online' ? (
                      <>
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                        <span className="text-green-700">Online</span>
                      </>
                    ) : backendStatus === 'offline' ? (
                      <>
                        <div className="h-2 w-2 bg-red-500 rounded-full" />
                        <span className="text-red-700">Offline</span>
                      </>
                    ) : (
                      <>
                        <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
                        <span className="text-yellow-700">Checking</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-karma-600">GitHub Integration</span>
                  <div className="flex items-center space-x-1">
                    {backendStatus === 'online' ? (
                      <>
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                        <span className="text-green-700">Available</span>
                      </>
                    ) : (
                      <>
                        <div className="h-2 w-2 bg-gray-400 rounded-full" />
                        <span className="text-gray-600">Unavailable</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-karma-600">AI Analysis</span>
                  <div className="flex items-center space-x-1">
                    {backendStatus === 'online' ? (
                      <>
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                        <span className="text-green-700">Available</span>
                      </>
                    ) : (
                      <>
                        <div className="h-2 w-2 bg-gray-400 rounded-full" />
                        <span className="text-gray-600">Unavailable</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Last Check */}
              <div className="pt-2 border-t border-karma-200">
                <div className="flex items-center justify-between text-xs text-karma-500">
                  <span>Last checked</span>
                  <span>{formatLastCheck()}</span>
                </div>
              </div>

              {/* Disconnect Button */}
              {onDisconnect && (
                <div className="pt-2 border-t border-karma-200">
                  <button
                    onClick={handleDisconnectClick}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                    <span>Disconnect</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus; 