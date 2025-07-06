import React, { useState } from 'react';
import { XMarkIcon, PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { moveContractService } from '../services/moveContractService';

interface AddContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAddress: string;
  onContributionAdded: () => void;
}

const AddContributionModal: React.FC<AddContributionModalProps> = ({
  isOpen,
  onClose,
  userAddress,
  onContributionAdded
}) => {
  const [contributionType, setContributionType] = useState('github');
  const [description, setDescription] = useState('');
  const [impactScore, setImpactScore] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contributionTypes = [
    { value: 'github', label: 'GitHub', description: 'Code contributions, PRs, issues' },
    { value: 'dao', label: 'DAO', description: 'Governance participation, proposals' },
    { value: 'forum', label: 'Forum', description: 'Community discussions, help' },
    { value: 'content', label: 'Content', description: 'Documentation, tutorials' },
    { value: 'event', label: 'Event', description: 'Conference talks, workshops' },
    { value: 'other', label: 'Other', description: 'Miscellaneous contributions' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('Please provide a description');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Note: This would require a wallet client to be passed in
      // For now, we'll just simulate the call
      console.log('Would record contribution:', {
        userAddress,
        contributionType,
        description,
        impactScore
      });
      
      // TODO: Implement actual contract call when wallet is connected
      // const hash = await moveContractService.recordContribution(
      //   userAddress,
      //   contributionType,
      //   description,
      //   impactScore,
      //   walletClient
      // );
      
      // Simulate success
      setTimeout(() => {
        setIsSubmitting(false);
        onContributionAdded();
        onClose();
        // Reset form
        setDescription('');
        setImpactScore(50);
      }, 1000);
      
    } catch (err) {
      setError('Failed to record contribution. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-karma-200">
          <h2 className="text-xl font-semibold text-karma-900">
            Add Contribution
          </h2>
          <button
            onClick={onClose}
            className="text-karma-400 hover:text-karma-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Contribution Type */}
          <div>
            <label className="block text-sm font-medium text-karma-700 mb-3">
              Contribution Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {contributionTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setContributionType(type.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    contributionType === type.value
                      ? 'border-accent-500 bg-accent-50 text-accent-700'
                      : 'border-karma-200 hover:border-karma-300 text-karma-700'
                  }`}
                >
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs opacity-75">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-karma-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your contribution..."
              className="w-full p-3 border border-karma-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={200}
            />
            <div className="text-xs text-karma-500 mt-1">
              {description.length}/200 characters
            </div>
          </div>

          {/* Impact Score */}
          <div>
            <label className="block text-sm font-medium text-karma-700 mb-2">
              Impact Score: {impactScore}/100
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={impactScore}
              onChange={(e) => setImpactScore(Number(e.target.value))}
              className="w-full h-2 bg-karma-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-karma-500 mt-1">
              <span>Low Impact</span>
              <span>High Impact</span>
            </div>
          </div>

          {/* Impact Score Description */}
          <div className="bg-karma-50 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-karma-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-karma-700">
                <div className="font-medium mb-1">Impact Score Guidelines:</div>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>1-20:</strong> Minor contributions, comments</li>
                  <li>• <strong>21-40:</strong> Small fixes, documentation</li>
                  <li>• <strong>41-60:</strong> Features, significant PRs</li>
                  <li>• <strong>61-80:</strong> Major features, architecture</li>
                  <li>• <strong>81-100:</strong> Critical contributions, leadership</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-karma-300 text-karma-700 rounded-lg hover:bg-karma-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !description.trim()}
              className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Recording...
                </>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Record Contribution
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContributionModal; 