import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { api, setAuthToken, removeAuthToken, getAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<void>;
  changePassword: (passwordData: any) => Promise<void>;
  switchDemoUser: (email: string) => Promise<void>;
  unreadNotifsCount: number;
  refreshNotificationsCount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(0);

  const refreshNotificationsCount = async () => {
    if (!token) {
      setUnreadNotifsCount(0);
      return;
    }
    try {
      const data = await api.getNotifications();
      setUnreadNotifsCount(data.unreadCount || 0);
    } catch {
      // Ignore background notification check error
    }
  };

  useEffect(() => {
    async function loadUser() {
      const storedToken = getAuthToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await api.getMe();
        setUser(data.user);
        refreshNotificationsCount();
      } catch (err) {
        console.error('Failed to load user profile with token:', err);
        removeAuthToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const data = await api.login(credentials);
    setAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);
    refreshNotificationsCount();
  };

  const register = async (userData: any) => {
    const data = await api.register(userData);
    setAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);
    refreshNotificationsCount();
  };

  const logout = () => {
    removeAuthToken();
    setToken(null);
    setUser(null);
    setUnreadNotifsCount(0);
  };

  const updateProfile = async (profileData: any) => {
    const data = await api.updateProfile(profileData);
    setUser(data.user);
  };

  const changePassword = async (passwordData: any) => {
    await api.changePassword(passwordData);
  };

  // Helper for demo reviews to test any persona seamlessly
  const switchDemoUser = async (email: string) => {
    await login({ email, password: 'Password123!' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        switchDemoUser,
        unreadNotifsCount,
        refreshNotificationsCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
