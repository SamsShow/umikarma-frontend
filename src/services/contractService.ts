import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { Address, formatUnits, parseUnits } from 'viem';
import { 
  CONTRACT_ADDRESSES, 
  REPUTATION_REGISTRY_ABI, 
  KARMA_SCORER_ABI, 
  ACCESS_CONTROLLER_ABI,
  CONTRIBUTION_TYPES,
  ACCESS_LEVELS 
} from '../config/contracts';

// Re-export constants for convenience
export { CONTRIBUTION_TYPES, ACCESS_LEVELS } from '../config/contracts';

// TypeScript interfaces for contract data structures
export interface UserProfile {
  userAddress: Address;
  githubHandle: string;
  karmaScore: number;
  trustFactor: number;
  totalContributions: number;
  isVerified: boolean;
  registrationDate: Date;
  lastActivity: Date;
}

export interface UserStats {
  githubScore: number;
  daoScore: number;
  forumScore: number;
  identityScore: number;
  totalContributions: number;
  lastActivityDate: Date;
}

export interface Contribution {
  contributionType: number;
  impactScore: number;
  description: string;
  timestamp: Date;
}

export interface AccessRule {
  name: string;
  minKarma: number;
  minTrustFactor: number;
  requiresVerification: boolean;
  minContributions: number;
  accessLevel: number;
  isActive: boolean;
}

// Helper function to convert contract BigInt values to JavaScript numbers/dates
const convertContractData = {
  userProfile: (data: any): UserProfile => ({
    userAddress: data.userAddress,
    githubHandle: data.githubHandle,
    karmaScore: Number(data.karmaScore),
    trustFactor: Number(data.trustFactor) / 100, // Contract stores as basis points
    totalContributions: Number(data.totalContributions),
    isVerified: data.isVerified,
    registrationDate: new Date(Number(data.registrationDate) * 1000),
    lastActivity: new Date(Number(data.lastActivity) * 1000),
  }),
  
  userStats: (data: any): UserStats => ({
    githubScore: Number(data.githubScore),
    daoScore: Number(data.daoScore),
    forumScore: Number(data.forumScore),
    identityScore: Number(data.identityScore),
    totalContributions: Number(data.totalContributions),
    lastActivityDate: new Date(Number(data.lastActivityDate) * 1000),
  }),
  
  contributions: (data: readonly any[]): Contribution[] => 
    [...data].map(item => ({
      contributionType: Number(item.contributionType),
      impactScore: Number(item.impactScore),
      description: item.description,
      timestamp: new Date(Number(item.timestamp) * 1000),
    })),
    
  accessRule: (data: any): AccessRule => ({
    name: data.name,
    minKarma: Number(data.minKarma),
    minTrustFactor: Number(data.minTrustFactor) / 100,
    requiresVerification: data.requiresVerification,
    minContributions: Number(data.minContributions),
    accessLevel: Number(data.accessLevel),
    isActive: data.isActive,
  }),
};

// ============================================================================
// REPUTATION REGISTRY HOOKS
// ============================================================================

export function useUserProfile(userAddress?: Address) {
  const { data, error, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.REPUTATION_REGISTRY,
    abi: REPUTATION_REGISTRY_ABI,
    functionName: 'getUserProfile',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!CONTRACT_ADDRESSES.REPUTATION_REGISTRY,
    },
  });

  return {
    profile: data ? convertContractData.userProfile(data) : null,
    error,
    isLoading,
    refetch,
  };
}

export function useIsUserRegistered(userAddress?: Address) {
  const { data, error, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.REPUTATION_REGISTRY,
    abi: REPUTATION_REGISTRY_ABI,
    functionName: 'isUserRegistered',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!CONTRACT_ADDRESSES.REPUTATION_REGISTRY,
    },
  });

  return { isRegistered: !!data, error, isLoading };
}

export function useRegisterUser() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const registerUser = (githubHandle: string) => {
    if (!CONTRACT_ADDRESSES.REPUTATION_REGISTRY) {
      throw new Error('Contract not deployed yet');
    }
    
    writeContract({
      address: CONTRACT_ADDRESSES.REPUTATION_REGISTRY,
      abi: REPUTATION_REGISTRY_ABI,
      functionName: 'registerUser',
      args: [githubHandle],
    });
  };

  return {
    registerUser,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

// ============================================================================
// KARMA SCORER HOOKS
// ============================================================================

export function useUserStats(userAddress?: Address) {
  const { data, error, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.KARMA_SCORER,
    abi: KARMA_SCORER_ABI,
    functionName: 'getUserStats',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!CONTRACT_ADDRESSES.KARMA_SCORER,
    },
  });

  return {
    stats: data ? convertContractData.userStats(data) : null,
    error,
    isLoading,
    refetch,
  };
}

export function useUserContributions(userAddress?: Address) {
  const { data, error, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.KARMA_SCORER,
    abi: KARMA_SCORER_ABI,
    functionName: 'getUserContributions',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!CONTRACT_ADDRESSES.KARMA_SCORER,
    },
  });

  return {
    contributions: data ? convertContractData.contributions(data) : [],
    error,
    isLoading,
    refetch,
  };
}

export function useCalculateKarmaScore(userAddress?: Address) {
  const { data, error, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.KARMA_SCORER,
    abi: KARMA_SCORER_ABI,
    functionName: 'calculateKarmaScore',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!CONTRACT_ADDRESSES.KARMA_SCORER,
    },
  });

  return {
    karmaScore: data ? Number(data) : 0,
    error,
    isLoading,
  };
}

export function useAddContribution() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const addContribution = (
    userAddress: Address,
    contributionType: keyof typeof CONTRIBUTION_TYPES,
    impactScore: number,
    description: string
  ) => {
    if (!CONTRACT_ADDRESSES.KARMA_SCORER) {
      throw new Error('Contract not deployed yet');
    }
    
    writeContract({
      address: CONTRACT_ADDRESSES.KARMA_SCORER,
      abi: KARMA_SCORER_ABI,
      functionName: 'addContribution',
      args: [
        userAddress,
        BigInt(CONTRIBUTION_TYPES[contributionType]),
        BigInt(impactScore),
        description,
      ],
    });
  };

  return {
    addContribution,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

// ============================================================================
// ACCESS CONTROLLER HOOKS
// ============================================================================

export function useUserAccessLevel(userAddress?: Address) {
  const { data, error, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.ACCESS_CONTROLLER,
    abi: ACCESS_CONTROLLER_ABI,
    functionName: 'getUserAccessLevel',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!CONTRACT_ADDRESSES.ACCESS_CONTROLLER,
    },
  });

  return {
    accessLevel: data ? Number(data) : ACCESS_LEVELS.BASIC,
    accessLevelName: data ? getAccessLevelName(Number(data)) : 'Basic',
    error,
    isLoading,
  };
}

export function useCheckAccess(userAddress?: Address, ruleId?: number) {
  const { data, error, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.ACCESS_CONTROLLER,
    abi: ACCESS_CONTROLLER_ABI,
    functionName: 'checkAccess',
    args: userAddress && ruleId !== undefined ? [userAddress, BigInt(ruleId)] : undefined,
    query: {
      enabled: !!userAddress && ruleId !== undefined && !!CONTRACT_ADDRESSES.ACCESS_CONTROLLER,
    },
  });

  return {
    hasAccess: !!data,
    error,
    isLoading,
  };
}

export function useAccessRule(ruleId?: number) {
  const { data, error, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.ACCESS_CONTROLLER,
    abi: ACCESS_CONTROLLER_ABI,
    functionName: 'getAccessRule',
    args: ruleId !== undefined ? [BigInt(ruleId)] : undefined,
    query: {
      enabled: ruleId !== undefined && !!CONTRACT_ADDRESSES.ACCESS_CONTROLLER,
    },
  });

  return {
    accessRule: data ? convertContractData.accessRule(data) : null,
    error,
    isLoading,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getAccessLevelName(level: number): string {
  switch (level) {
    case ACCESS_LEVELS.BASIC:
      return 'Basic';
    case ACCESS_LEVELS.CONTRIBUTOR:
      return 'Contributor';
    case ACCESS_LEVELS.TRUSTED:
      return 'Trusted';
    case ACCESS_LEVELS.ELITE:
      return 'Elite';
    default:
      return 'Unknown';
  }
}

export function getContributionTypeName(type: number): string {
  switch (type) {
    case CONTRIBUTION_TYPES.GITHUB:
      return 'GitHub';
    case CONTRIBUTION_TYPES.DAO:
      return 'DAO';
    case CONTRIBUTION_TYPES.FORUM:
      return 'Forum';
    default:
      return 'Unknown';
  }
}

export function formatKarmaScore(score: number): string {
  return Math.max(0, Math.min(100, score)).toFixed(1);
}

export function formatTrustFactor(factor: number): string {
  return Math.max(0, Math.min(1, factor)).toFixed(2);
}

// ============================================================================
// COMBINED HOOKS FOR DASHBOARD
// ============================================================================

export function useUserDashboardData(userAddress?: Address) {
  const { profile, isLoading: profileLoading, error: profileError } = useUserProfile(userAddress);
  const { stats, isLoading: statsLoading, error: statsError } = useUserStats(userAddress);
  const { contributions, isLoading: contributionsLoading, error: contributionsError } = useUserContributions(userAddress);
  const { accessLevel, accessLevelName, isLoading: accessLoading, error: accessError } = useUserAccessLevel(userAddress);

  return {
    profile,
    stats,
    contributions,
    accessLevel,
    accessLevelName,
    isLoading: profileLoading || statsLoading || contributionsLoading || accessLoading,
    error: profileError || statsError || contributionsError || accessError,
  };
}

// Hook for current connected user
export function useCurrentUserData() {
  const { address } = useAccount();
  return useUserDashboardData(address);
} 