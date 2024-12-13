import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, isSignUp?: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  setUser: (user: User | null) => void;
  setIsAdmin: (value: boolean) => void;
}

// Simulated user storage
const users: Record<string, { password: string; user: User }> = {};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      login: async (email: string, password: string, isSignUp = false) => {
        if (isSignUp) {
          if (users[email]) {
            throw new Error('User already exists');
          }
          const user: User = {
            id: Date.now().toString(),
            email,
            name: email.split('@')[0]
          };
          users[email] = { password, user };
          set({ user, isAuthenticated: true });
        } else {
          const userRecord = users[email];
          if (!userRecord || userRecord.password !== password) {
            throw new Error('Invalid credentials');
          }
          set({ user: userRecord.user, isAuthenticated: true });
        }
      },
      loginWithGoogle: async () => {
        // Simulate Google login
        const googleUser: User = {
          id: `google_${Date.now()}`,
          email: 'user@gmail.com',
          name: 'Google User',
          picture: 'https://example.com/avatar.jpg'
        };
        set({ user: googleUser, isAuthenticated: true });
      },
      resetPassword: async (email: string) => {
        const userRecord = users[email];
        if (!userRecord) {
          throw new Error('User not found');
        }
        // In a real application, this would send a password reset email
        // For this demo, we'll just simulate the process
        await new Promise(resolve => setTimeout(resolve, 1000));
      },
      logout: () => set({ user: null, isAuthenticated: false, isAdmin: false }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setIsAdmin: (value) => set({ isAdmin: value })
    }),
    {
      name: 'auth-storage'
    }
  )
);