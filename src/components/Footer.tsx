import React from 'react';
import { 
  CodeBracketIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">UK</span>
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900">UmiKarma</h3>
            </div>
            <p className="text-slate-600 mb-4 max-w-md">
              AI-enhanced reputation system that aggregates on-chain and off-chain activity 
              into a unified karma score for contributors in decentralized communities.
            </p>
            <div className="flex items-center space-x-1 text-sm text-slate-500">
              <span>Built with</span>
              <HeartIcon className="w-4 h-4 text-red-500" />
              <span>for the decentralized future</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <a href="#features" className="hover:text-blue-600 transition-colors duration-200">
                  Features
                </a>
              </li>
              <li>
                <a href="#integrations" className="hover:text-blue-600 transition-colors duration-200">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#dashboard" className="hover:text-blue-600 transition-colors duration-200">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#api" className="hover:text-blue-600 transition-colors duration-200">
                  API Access
                </a>
              </li>
            </ul>
          </div>

          {/* Developer Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Developers</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <a 
                  href="https://github.com/SamsShow/umikarma-frontend" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <CodeBracketIcon className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a 
                  href="#docs" 
                  className="hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>Documentation</span>
                </a>
              </li>
              <li>
                <a 
                  href="#sdk" 
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  SDK
                </a>
              </li>
              <li>
                <a 
                  href="https://uminetwork.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <GlobeAltIcon className="w-4 h-4" />
                  <span>Umi Network</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-slate-500">
            <span>&copy; 2025 UmiKarma. All rights reserved.</span>
            <div className="flex space-x-6">
              <a href="#privacy" className="hover:text-slate-700 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-slate-700 transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <span>Powered by</span>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded"></div>
              <span className="font-medium">Move & AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 