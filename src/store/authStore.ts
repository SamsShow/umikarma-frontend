import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  type: 'wallet' | 'github';
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
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
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