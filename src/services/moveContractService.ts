import { createPublicClient, http, parseAbi } from 'viem';
import { umiDevnet } from '../config/web3Config';

// Contract addresses for the deployed Move contracts
export const CONTRACT_ADDRESSES = {
  REPUTATION_REGISTRY: '0x93974d6642126b1315C8854B9FeF66DbB2A4cc2C',
  KARMA_SCORER: '0x93974d6642126b1315C8854B9FeF66DbB2A4cc2C',
  ACCESS_CONTROLLER: '0x93974d6642126b1315C8854B9FeF66DbB2A4cc2C',
} as const;

// Simplified ABI for Move contract interactions
// Note: Move contracts use a different calling convention than EVM contracts
const MOVE_CONTRACT_ABI = parseAbi([
  // ReputationRegistry functions
  'function record_contribution(address user, string contribution_type, string description, uint64 impact_score)',
  'function get_contributions(address user) view returns (tuple(string, string, uint64, uint64)[])',
  'function verify_user(address user)',
  
  // KarmaScorer functions
  'function calculate_score(address user) view returns (uint64)',
  'function get_score(address user) view returns (uint64)',
  'function update_weights(string contribution_type, uint64 weight)',
  
  // AccessController functions
  'function set_threshold(string resource, uint64 threshold)',
  'function has_access(address user, string resource) view returns (bool)',
  'function grant_admin(address user)',
]);

// Create a public client for reading from contracts
const publicClient = createPublicClient({
  chain: umiDevnet,
  transport: http('https://devnet.uminetwork.com/'),
});

export interface Contribution {
  type: string;
  description: string;
  impactScore: number;
  timestamp: number;
}

export interface UserProfile {
  address: string;
  karmaScore: number;
  totalContributions: number;
  isVerified: boolean;
  contributions: Contribution[];
}

export class MoveContractService {
  private static instance: MoveContractService;

  private constructor() {}

  public static getInstance(): MoveContractService {
    if (!MoveContractService.instance) {
      MoveContractService.instance = new MoveContractService();
    }
    return MoveContractService.instance;
  }

  /**
   * Get karma score for a user
   */
  async getKarmaScore(userAddress: string): Promise<number> {
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.KARMA_SCORER,
        abi: MOVE_CONTRACT_ABI,
        functionName: 'get_score',
        args: [userAddress as `0x${string}`],
      });
      
      return Number(result);
    } catch (error) {
      console.error('Error getting karma score:', error);
      return 0;
    }
  }

  /**
   * Get all contributions for a user
   */
  async getContributions(userAddress: string): Promise<Contribution[]> {
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.REPUTATION_REGISTRY,
        abi: MOVE_CONTRACT_ABI,
        functionName: 'get_contributions',
        args: [userAddress as `0x${string}`],
      });
      
      // Parse the result (this would need to be adjusted based on actual Move return format)
      return (result as any[]).map((contribution: any) => ({
        type: contribution[0],
        description: contribution[1],
        impactScore: Number(contribution[2]),
        timestamp: Number(contribution[3]),
      }));
    } catch (error) {
      console.error('Error getting contributions:', error);
      return [];
    }
  }

  /**
   * Check if user has access to a resource
   */
  async hasAccess(userAddress: string, resource: string): Promise<boolean> {
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.ACCESS_CONTROLLER,
        abi: MOVE_CONTRACT_ABI,
        functionName: 'has_access',
        args: [userAddress as `0x${string}`, resource],
      });
      
      return Boolean(result);
    } catch (error) {
      console.error('Error checking access:', error);
      return false;
    }
  }

  /**
   * Get complete user profile
   */
  async getUserProfile(userAddress: string): Promise<UserProfile> {
    try {
      const [karmaScore, contributions, isVerified] = await Promise.all([
        this.getKarmaScore(userAddress),
        this.getContributions(userAddress),
        this.hasAccess(userAddress, 'verified_user'),
      ]);

      return {
        address: userAddress,
        karmaScore,
        totalContributions: contributions.length,
        isVerified,
        contributions,
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return {
        address: userAddress,
        karmaScore: 0,
        totalContributions: 0,
        isVerified: false,
        contributions: [],
      };
    }
  }

  /**
   * Record a new contribution (requires wallet connection)
   */
  async recordContribution(
    userAddress: string,
    contributionType: string,
    description: string,
    impactScore: number,
    walletClient: any
  ): Promise<string> {
    try {
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESSES.REPUTATION_REGISTRY,
        abi: MOVE_CONTRACT_ABI,
        functionName: 'record_contribution',
        args: [userAddress as `0x${string}`, contributionType, description, BigInt(impactScore)],
        account: userAddress as `0x${string}`,
      });

      const hash = await walletClient.writeContract(request);
      return hash;
    } catch (error) {
      console.error('Error recording contribution:', error);
      throw error;
    }
  }

  /**
   * Verify a user (admin function)
   */
  async verifyUser(
    userAddress: string,
    adminAddress: string,
    walletClient: any
  ): Promise<string> {
    try {
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESSES.REPUTATION_REGISTRY,
        abi: MOVE_CONTRACT_ABI,
        functionName: 'verify_user',
        args: [userAddress as `0x${string}`],
        account: adminAddress as `0x${string}`,
      });

      const hash = await walletClient.writeContract(request);
      return hash;
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
  }

  /**
   * Set karma threshold for a resource (admin function)
   */
  async setThreshold(
    resource: string,
    threshold: number,
    adminAddress: string,
    walletClient: any
  ): Promise<string> {
    try {
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESSES.ACCESS_CONTROLLER,
        abi: MOVE_CONTRACT_ABI,
        functionName: 'set_threshold',
        args: [resource, BigInt(threshold)],
        account: adminAddress as `0x${string}`,
      });

      const hash = await walletClient.writeContract(request);
      return hash;
    } catch (error) {
      console.error('Error setting threshold:', error);
      throw error;
    }
  }

  /**
   * Update contribution weights (admin function)
   */
  async updateWeights(
    contributionType: string,
    weight: number,
    adminAddress: string,
    walletClient: any
  ): Promise<string> {
    try {
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESSES.KARMA_SCORER,
        abi: MOVE_CONTRACT_ABI,
        functionName: 'update_weights',
        args: [contributionType, BigInt(weight)],
        account: adminAddress as `0x${string}`,
      });

      const hash = await walletClient.writeContract(request);
      return hash;
    } catch (error) {
      console.error('Error updating weights:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const moveContractService = MoveContractService.getInstance(); 