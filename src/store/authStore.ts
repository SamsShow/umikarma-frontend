import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  type: 'wallet' | 'github' | 'combined';
  walletAddress?: string;
  githubData?: {
    username: string;
    name: string;
    avatar_url: string;
    email?: string;
    public_repos: number;
    followers: number;
    following: number;
  };
  karmaScore?: number;
  trustFactor?: number;
  totalContributions?: number;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  connectWallet: (walletAddress: string, chainId?: number) => void;
  connectGitHub: (githubData: AuthUser['githubData'], karmaData?: Partial<AuthUser>) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
      connectWallet: (walletAddress: string, chainId?: number) => {
        const existingUser = get().user;
        
        if (existingUser && existingUser.type === 'github') {
          const combinedUser: AuthUser = {
            ...existingUser,
            id: `combined_${existingUser.githubData?.username}_${walletAddress.slice(-6)}`,
            type: 'combined',
            walletAddress,
            karmaScore: existingUser.karmaScore ? existingUser.karmaScore + 5 : 70,
            trustFactor: existingUser.trustFactor ? Math.min(existingUser.trustFactor + 0.1, 1.0) : 0.8,
          };
          
          set({
            user: combinedUser,
            isAuthenticated: true,
          });
        } else {
          const walletUser: AuthUser = {
            id: `wallet_${walletAddress}`,
            type: 'wallet',
            walletAddress,
            karmaScore: 65,
            trustFactor: 0.75,
            totalContributions: 25,
          };
          
          set({
            user: walletUser,
            isAuthenticated: true,
          });
        }
      },
      connectGitHub: (githubData, karmaData) => {
        const existingUser = get().user;
        
        if (existingUser && existingUser.type === 'wallet') {
          const combinedUser: AuthUser = {
            ...existingUser,
            id: `combined_${githubData?.username}_${existingUser.walletAddress?.slice(-6)}`,
            type: 'combined',
            githubData,
            karmaScore: karmaData?.karmaScore ? 
              Math.min((karmaData.karmaScore + (existingUser.karmaScore || 0)) / 2 + 10, 100) : 
              Math.min((existingUser.karmaScore || 0) + 15, 100),
            trustFactor: karmaData?.trustFactor ? 
              Math.min((karmaData.trustFactor + (existingUser.trustFactor || 0.5)) / 2 + 0.1, 1.0) : 
              Math.min((existingUser.trustFactor || 0.5) + 0.15, 1.0),
            totalContributions: karmaData?.totalContributions || existingUser.totalContributions || 50,
          };
          
          set({
            user: combinedUser,
            isAuthenticated: true,
          });
        } else {
          const githubUser: AuthUser = {
            id: `github_${githubData?.username}`,
            type: 'github',
            githubData,
            karmaScore: karmaData?.karmaScore || 75,
            trustFactor: karmaData?.trustFactor || 0.8,
            totalContributions: karmaData?.totalContributions || 50,
          };
          
          set({
            user: githubUser,
            isAuthenticated: true,
          });
        }
      },
      setLoading: (loading) => set({ loading }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'umikarma-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 