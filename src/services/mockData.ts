// Mock data service for UmiKarma frontend development
export interface MockUserProfile {
  wallet: string;
  githubHandle: string;
  karmaScore: number;
  trustFactor: number;
  totalContributions: number;
  verificationStatus: boolean;
  accessLevel: number;
  joinDate: string;
}

export interface MockContribution {
  id: string;
  type: 'github' | 'dao' | 'forum' | 'identity';
  title: string;
  description: string;
  impact: number;
  date: string;
  aiSummary: string;
  transactionHash?: string;
  verified: boolean;
}

export interface MockDAOAccess {
  daoName: string;
  daoAddress: string;
  accessLevel: number;
  accessGranted: boolean;
  requiredKarma: number;
  description: string;
}

export interface MockKarmaHistory {
  date: string;
  score: number;
  change: number;
  reason: string;
}

// Mock user profiles for different scenarios
export const mockUserProfiles: MockUserProfile[] = [
  {
    wallet: "0x742d35C6e6B02E9C0D6F3e21B71B4b5F36C8F123",
    githubHandle: "alice-dev",
    karmaScore: 87,
    trustFactor: 0.92,
    totalContributions: 143,
    verificationStatus: true,
    accessLevel: 4, // Elite
    joinDate: "2023-06-15"
  },
  {
    wallet: "0x8B3a9e7f2c1d4e5f6a9b8c7d6e5f4a3b2c1d0987",
    githubHandle: "bob-contributor",
    karmaScore: 65,
    trustFactor: 0.78,
    totalContributions: 89,
    verificationStatus: true,
    accessLevel: 3, // Trusted
    joinDate: "2023-08-22"
  },
  {
    wallet: "0x1A2B3C4D5E6F7890ABCDEF1234567890ABCDEF12",
    githubHandle: "charlie-newcomer",
    karmaScore: 34,
    trustFactor: 0.65,
    totalContributions: 28,
    verificationStatus: false,
    accessLevel: 2, // Contributor
    joinDate: "2024-01-10"
  }
];

// Mock contributions with realistic data
export const mockContributions: MockContribution[] = [
  {
    id: "contrib-001",
    type: "github",
    title: "Fixed critical authentication vulnerability in user login",
    description: "Discovered and patched a security vulnerability that could allow unauthorized access. Implemented proper input validation and added comprehensive tests.",
    impact: 95,
    date: "2024-01-07T14:30:00Z",
    aiSummary: "High-impact security fix addressing authentication bypass vulnerability. Excellent code quality with comprehensive test coverage. Demonstrates strong security awareness and technical expertise.",
    transactionHash: "0xabc123...",
    verified: true
  },
  {
    id: "contrib-002", 
    type: "dao",
    title: "Led governance proposal for community fund allocation",
    description: "Authored and championed proposal DAO-15 to allocate 50,000 USDC for developer grants. Facilitated community discussions and achieved 78% approval rate.",
    impact: 82,
    date: "2024-01-05T09:15:00Z",
    aiSummary: "Excellent leadership in DAO governance. Successfully guided a significant funding proposal through the community process with strong stakeholder engagement and clear communication.",
    verified: true
  },
  {
    id: "contrib-003",
    type: "forum",
    title: "Created comprehensive NFT development tutorial series",
    description: "Published 5-part tutorial series on advanced NFT contract development, helping 200+ developers learn best practices for security and gas optimization.",
    impact: 76,
    date: "2024-01-03T16:45:00Z", 
    aiSummary: "Outstanding educational contribution. High-quality technical content with excellent community reception. Demonstrates deep expertise and commitment to knowledge sharing.",
    verified: true
  },
  {
    id: "contrib-004",
    type: "github",
    title: "Optimized smart contract gas usage by 40%",
    description: "Refactored core contract functions to reduce gas costs through assembly optimizations and storage layout improvements. Maintained full backward compatibility.",
    impact: 88,
    date: "2024-01-01T11:20:00Z",
    aiSummary: "Impressive technical optimization demonstrating advanced Solidity knowledge. Significant gas savings achieved while maintaining code quality and security standards.",
    verified: true
  },
  {
    id: "contrib-005",
    type: "identity",
    title: "Completed Web3 Security Certification",
    description: "Successfully obtained certified Web3 Security Professional (CWSP) certification from ConsenSys Academy, demonstrating expertise in smart contract security auditing.",
    impact: 45,
    date: "2023-12-28T08:00:00Z",
    aiSummary: "Professional development achievement showing commitment to security best practices. Certification adds credibility to security-related contributions.",
    verified: true
  },
  {
    id: "contrib-006",
    type: "dao",
    title: "Organized community hackathon with 150+ participants",
    description: "Led planning and execution of 'DeFi Summer 2023' hackathon, resulting in 15 new projects and $25K in prizes distributed to winners.",
    impact: 71,
    date: "2023-12-15T18:30:00Z",
    aiSummary: "Exceptional community building and event organization. Successfully mobilized large developer community and facilitated innovation through collaborative competition.",
    verified: true
  },
  {
    id: "contrib-007",
    type: "forum",
    title: "Provided technical support to 50+ newcomers",
    description: "Actively helped newcomers in Discord and forum channels, answering technical questions about DeFi protocols, smart contract development, and wallet security.",
    impact: 52,
    date: "2023-12-10T12:45:00Z",
    aiSummary: "Consistent community support demonstrating patience and technical knowledge. Valuable mentorship role helping onboard new developers to the ecosystem.",
    verified: true
  },
  {
    id: "contrib-008",
    type: "github",
    title: "Built open-source DEX analytics dashboard",
    description: "Created comprehensive analytics dashboard for tracking DEX trading volumes, liquidity flows, and arbitrage opportunities across 12 major protocols.",
    impact: 79,
    date: "2023-11-28T15:10:00Z",
    aiSummary: "Impressive full-stack development project providing valuable tools to the DeFi community. Clean architecture, good documentation, and active maintenance.",
    verified: true
  }
];

// Mock DAO access scenarios
export const mockDAOAccess: MockDAOAccess[] = [
  {
    daoName: "DeFi Collective",
    daoAddress: "0x1234567890123456789012345678901234567890",
    accessLevel: 4,
    accessGranted: true,
    requiredKarma: 80,
    description: "Elite governance participation in leading DeFi protocol decisions"
  },
  {
    daoName: "OpenSource Guild",
    daoAddress: "0x2345678901234567890123456789012345678901",
    accessLevel: 3,
    accessGranted: true,
    requiredKarma: 60,
    description: "Trusted contributor access to open source project governance"
  },
  {
    daoName: "NFT Creators DAO",
    daoAddress: "0x3456789012345678901234567890123456789012",
    accessLevel: 2,
    accessGranted: false,
    requiredKarma: 50,
    description: "Contributors can participate in NFT project decisions"
  },
  {
    daoName: "Web3 Education",
    daoAddress: "0x4567890123456789012345678901234567890123",
    accessLevel: 1,
    accessGranted: true,
    requiredKarma: 20,
    description: "Basic access to educational content creation proposals"
  }
];

// Mock karma history for trending data
export const mockKarmaHistory: MockKarmaHistory[] = [
  { date: "2024-01-07", score: 87, change: +3, reason: "Security vulnerability fix" },
  { date: "2024-01-05", score: 84, change: +5, reason: "DAO governance leadership" },
  { date: "2024-01-03", score: 79, change: +4, reason: "Educational content creation" },
  { date: "2024-01-01", score: 75, change: +8, reason: "Gas optimization achievement" },
  { date: "2023-12-28", score: 67, change: +2, reason: "Professional certification" },
  { date: "2023-12-15", score: 65, change: +6, reason: "Community hackathon" },
  { date: "2023-12-10", score: 59, change: +3, reason: "Community support" },
  { date: "2023-11-28", score: 56, change: +7, reason: "Open source tool development" }
];

// Mock platform statistics
export const mockPlatformStats = {
  totalUsers: 12847,
  totalContributions: 89231,
  averageKarma: 52.3,
  verifiedUsers: 8934,
  activeDAOs: 156,
  monthlyGrowth: 23.5
};

// Mock recent platform activity
export const mockRecentActivity = [
  {
    user: "alice-dev",
    action: "earned 15 karma points",
    description: "Fixed critical smart contract bug",
    timestamp: "2 minutes ago"
  },
  {
    user: "bob-contributor", 
    action: "joined Elite tier",
    description: "Reached 85 karma points",
    timestamp: "12 minutes ago"
  },
  {
    user: "charlie-newcomer",
    action: "completed verification",
    description: "Linked GitHub and Discord accounts",
    timestamp: "1 hour ago"
  },
  {
    user: "david-builder",
    action: "published tutorial",
    description: "Web3 security best practices guide",
    timestamp: "3 hours ago"
  }
];

// Helper functions to get mock data
export class MockDataService {
  static getCurrentUser(): MockUserProfile {
    return mockUserProfiles[0]; // Alice as primary user
  }

  static getUserContributions(wallet?: string): MockContribution[] {
    return mockContributions.slice(0, 6); // Return recent contributions
  }

  static getUserKarmaHistory(wallet?: string): MockKarmaHistory[] {
    return mockKarmaHistory;
  }

  static getDAOAccess(wallet?: string): MockDAOAccess[] {
    return mockDAOAccess;
  }

  static getPlatformStats() {
    return mockPlatformStats;
  }

  static getRecentActivity() {
    return mockRecentActivity;
  }

  static getContributionById(id: string): MockContribution | undefined {
    return mockContributions.find(contrib => contrib.id === id);
  }

  static async addContribution(contribution: Omit<MockContribution, 'id' | 'verified'>): Promise<MockContribution> {
    const newContribution: MockContribution = {
      ...contribution,
      id: `contrib-${Date.now()}`,
      verified: false
    };
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add to beginning of array to show as most recent
    mockContributions.unshift(newContribution);
    
    return newContribution;
  }

  static async calculateKarmaImpact(contributionType: string, description: string): Promise<number> {
    // Simple mock karma calculation based on type and description length
    const baseScores = {
      github: 50,
      dao: 40,
      forum: 30,
      identity: 20
    };
    
    const typeScore = baseScores[contributionType as keyof typeof baseScores] || 30;
    const lengthBonus = Math.min(description.length / 20, 30); // Up to 30 bonus points
    const randomVariation = Math.random() * 20 - 10; // ±10 points
    
    return Math.max(10, Math.min(100, Math.round(typeScore + lengthBonus + randomVariation)));
  }
}

export default MockDataService; 