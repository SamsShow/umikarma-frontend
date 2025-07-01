// GitHub API Service - Connects to UmiKarma Backend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export interface GitHubUserSummary {
  username: string;
  name: string | null;
  avatar_url: string;
  karmaScore: number;
  trustFactor: number;
  totalContributions: {
    commits: number;
    pullRequests: number;
    issues: number;
    repositories: number;
  };
  topLanguages: string[];
  lastActivity: string;
  profileUrl: string;
}

export interface GitHubAnalysisStatus {
  username: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface GitHubProfile {
  user: {
    id: number;
    login: string;
    name: string | null;
    email: string | null;
    avatar_url: string;
    html_url: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
  };
  repositories: any[];
  totalContributions: {
    commits: number;
    pullRequests: number;
    issues: number;
    codeReviews: number;
    linesAdded: number;
    linesDeleted: number;
    repositoriesContributed: number;
    totalImpactScore: number;
  };
  repositoryAnalyses: any[];
  karmaScore: number;
  trustFactor: number;
  profileCompleteness: number;
  lastAnalyzed: string;
}

export interface ContributionActivity {
  type: 'commit' | 'pull_request' | 'issue' | 'review';
  repository: string;
  title: string;
  description: string;
  url: string;
  date: string;
  impact: number;
  languages: string[];
  aiSummary?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class GitHubApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/github`;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // User Analysis Methods
  async getUserSummary(username: string): Promise<ApiResponse<GitHubUserSummary>> {
    return this.makeRequest<GitHubUserSummary>(`/user/${username}/summary`);
  }

  async startUserAnalysis(username: string): Promise<ApiResponse<GitHubAnalysisStatus>> {
    return this.makeRequest<GitHubAnalysisStatus>(
      `/user/${username}/analyze`, 
      { method: 'POST' }
    );
  }

  async getAnalysisStatus(username: string): Promise<ApiResponse<GitHubAnalysisStatus>> {
    return this.makeRequest<GitHubAnalysisStatus>(`/user/${username}/analysis/status`);
  }

  async getUserProfile(username: string): Promise<ApiResponse<GitHubProfile>> {
    return this.makeRequest<GitHubProfile>(`/user/${username}/profile`);
  }

  async getUserActivities(
    username: string, 
    limit: number = 20
  ): Promise<ApiResponse<ContributionActivity[]>> {
    return this.makeRequest<ContributionActivity[]>(
      `/user/${username}/activities?limit=${limit}`
    );
  }

  async validateUsername(username: string): Promise<ApiResponse<{ username: string; exists: boolean }>> {
    return this.makeRequest<{ username: string; exists: boolean }>(`/user/${username}/validate`);
  }

  // Repository Analysis
  async analyzeRepository(
    owner: string, 
    repo: string, 
    username?: string
  ): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/repository/analyze', {
      method: 'POST',
      body: JSON.stringify({ owner, repo, username }),
    });
  }

  // Search Methods
  async searchUsers(query: string, limit: number = 10): Promise<ApiResponse<GitHubUserSummary[]>> {
    return this.makeRequest<GitHubUserSummary[]>(`/search/users?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  // System Methods
  async getHealthStatus(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/health');
  }

  async getEligibilityCriteria(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/eligibility-criteria');
  }

  async getRateLimitStatus(): Promise<ApiResponse<{ remaining: number; reset: number }>> {
    return this.makeRequest<{ remaining: number; reset: number }>('/rate-limit');
  }

  async getScoringConfig(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/scoring/config');
  }

  async updateScoringConfig(config: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/scoring/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  // Cache Management
  async clearCache(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/cache', { method: 'DELETE' });
  }

  async clearUserCache(username: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/cache/${username}`, { method: 'DELETE' });
  }

  // Utility Methods
  async isBackendHealthy(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Enhanced User Analysis with polling
  async analyzeUserWithProgress(
    username: string,
    onProgress?: (status: GitHubAnalysisStatus) => void
  ): Promise<GitHubProfile | null> {
    // Start analysis
    const startResult = await this.startUserAnalysis(username);
    
    if (!startResult.success) {
      throw new Error(startResult.error || 'Failed to start analysis');
    }

    // Poll for progress
    return new Promise((resolve, reject) => {
      const checkProgress = async () => {
        const statusResult = await this.getAnalysisStatus(username);
        
        if (!statusResult.success || !statusResult.data) {
          reject(new Error('Failed to get analysis status'));
          return;
        }

        const status = statusResult.data;
        onProgress?.(status);

        if (status.status === 'completed') {
          // Get the complete profile
          const profileResult = await this.getUserProfile(username);
          
          if (profileResult.success && profileResult.data) {
            resolve(profileResult.data);
          } else {
            reject(new Error('Failed to get completed profile'));
          }
        } else if (status.status === 'failed') {
          reject(new Error(status.error || 'Analysis failed'));
        } else {
          // Continue polling
          setTimeout(checkProgress, 2000); // Check every 2 seconds
        }
      };

      checkProgress();
    });
  }

  // Get user data for components
  async getEnhancedUserData(username: string): Promise<{
    summary: GitHubUserSummary | null;
    activities: ContributionActivity[];
    profile: GitHubProfile | null;
  }> {
    try {
      // Get summary immediately (fast)
      const summaryPromise = this.getUserSummary(username);
      const activitiesPromise = this.getUserActivities(username, 10);
      const profilePromise = this.getUserProfile(username);

      const [summaryResult, activitiesResult, profileResult] = await Promise.allSettled([
        summaryPromise,
        activitiesPromise, 
        profilePromise
      ]);

      return {
        summary: summaryResult.status === 'fulfilled' && summaryResult.value.success 
          ? summaryResult.value.data! 
          : null,
        activities: activitiesResult.status === 'fulfilled' && activitiesResult.value.success 
          ? activitiesResult.value.data! 
          : [],
        profile: profileResult.status === 'fulfilled' && profileResult.value.success 
          ? profileResult.value.data! 
          : null,
      };
    } catch (error) {
      console.error('Error getting enhanced user data:', error);
      return {
        summary: null,
        activities: [],
        profile: null,
      };
    }
  }
}

export const githubApiService = new GitHubApiService();
export default githubApiService; 