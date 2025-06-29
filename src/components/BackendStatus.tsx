import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface BackendStatus {
  status: 'checking' | 'online' | 'offline' | 'error';
  message: string;
  lastChecked?: Date;
}

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<BackendStatus>({
    status: 'checking',
    message: 'Checking backend connection...'
  });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

  const checkBackendHealth = async () => {
    try {
      setStatus({
        status: 'checking',
        message: 'Checking backend connection...'
      });

      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatus({
          status: 'online',
          message: `Backend online (v${data.version || '1.0.0'})`,
          lastChecked: new Date()
        });
      } else {
        setStatus({
          status: 'error',
          message: `Backend responded with ${response.status}`,
          lastChecked: new Date()
        });
      }
    } catch (error: any) {
      let message = 'Backend offline';
      
      if (error.message?.includes('Failed to fetch')) {
        message = `Cannot connect to ${API_BASE_URL}`;
      } else if (error.message?.includes('CORS')) {
        message = 'CORS error - check backend configuration';
      } else {
        message = `Connection error: ${error.message}`;
      }

      setStatus({
        status: 'offline',
        message,
        lastChecked: new Date()
      });
    }
  };

  useEffect(() => {
    checkBackendHealth();
    
    // Check every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status.status) {
      case 'online':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'offline':
      case 'error':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case 'checking':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 animate-pulse" />;
      default:
        return <ExclamationTriangleIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'online':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'offline':
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'checking':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-3 ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">Backend Status</span>
        </div>
        <button 
          onClick={checkBackendHealth}
          className="text-xs px-2 py-1 rounded hover:bg-white/50 transition-colors"
          disabled={status.status === 'checking'}
        >
          Refresh
        </button>
      </div>
      
      <div className="mt-1">
        <p className="text-xs">{status.message}</p>
        {status.lastChecked && (
          <p className="text-xs opacity-75 mt-1">
            Last checked: {status.lastChecked.toLocaleTimeString()}
          </p>
        )}
      </div>

      {(status.status === 'offline' || status.status === 'error') && (
        <div className="mt-2 text-xs space-y-1">
          <p className="font-medium">Troubleshooting:</p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Make sure backend is running: <code className="bg-white/50 px-1 rounded">cd umikarma-backend && npm run dev</code></li>
            <li>Check if port 3001 is available</li>
            <li>Backend URL: <code className="bg-white/50 px-1 rounded">{API_BASE_URL}</code></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BackendStatus; 