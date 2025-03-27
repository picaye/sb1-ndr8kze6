import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

interface UserRecord {
  password: string;
  user: User;
}

interface UserVersions {
  [versionName: string]: UserRecord;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userVersions: { [versionName: string]: UserRecord };
  currentVersionName: string | null;
  login: (email: string, password: string, isSignUp?: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  setUser: (user: User | null) => void;
  setIsAdmin: (value: boolean) => void;
  saveVersion: (versionName: string) => void;
  loadVersion: (versionName: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      userVersions: {},
      currentVersionName: null,
      login: async (email: string, password: string, isSignUp = false) => {
        const storedUsers = localStorage.getItem('users');
        const users: Record<string, UserRecord> = storedUsers ? JSON.parse(storedUsers) : {};

        if (isSignUp) {
          if (users[email]) {
            throw new Error('User already exists');
          }
          const user: User = {
            id: Date.now().toString(),
            email,
            name: email.split('@')[0]
          };
          const hashedPassword = await bcrypt.hash(password, 10);
          users[email] = { password: hashedPassword, user };
          localStorage.setItem('users', JSON.stringify(users));
          set({ user, isAuthenticated: true, userVersions: { ['default']: { password: hashedPassword, user } }, currentVersionName: 'default' });
        } else {
          const userRecord = users[email];
          if (!userRecord || !(await bcrypt.compare(password, userRecord.password))) {
            throw new Error('Invalid credentials');
          }
          set({ user: userRecord.user, isAuthenticated: true, userVersions: { ['default']: { password, user: userRecord.user } }, currentVersionName: 'default' });
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
        set({ user: googleUser, isAuthenticated: true, userVersions: { ['default']: { password: '', user: googleUser } }, currentVersionName: 'default' });
      },
      resetPassword: async (email: string) => {
        const storedUsers = localStorage.getItem('users');
        const users: Record<string, UserRecord> = storedUsers ? JSON.parse(storedUsers) : {};
        const userRecord = users[email];
        if (!userRecord) {
          throw new Error('User not found');
        }
        // In a real application, this would send a password reset email
        // For this demo, we'll just simulate the process
        await new Promise(resolve => setTimeout(resolve, 1000));
      },
      logout: () => set({ user: null, isAuthenticated: false, isAdmin: false, userVersions: {}, currentVersionName: null }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setIsAdmin: (value) => set({ isAdmin: value }),
      saveVersion: (versionName: string) => {
        const user = get().user;
        if (!user) return;
        const userVersions = get().userVersions;
        const password = userVersions[get().currentVersionName || 'default']?.password || '';
        set({ userVersions: { ...userVersions, [versionName]: { password, user } } });
      },
      loadVersion: (versionName: string) => {
        const userVersions = get().userVersions;
        const userRecord = userVersions[versionName];
        if (!userRecord) {
          throw new Error('Version not found');
        }
        set({ user: userRecord.user, isAuthenticated: true, currentVersionName: versionName });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);