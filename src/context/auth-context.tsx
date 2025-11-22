'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => void;
  register: (name: string, email: string, password?: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('aushadhalaya-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('aushadhalaya-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, password?: string) => {
    // In a real app, you'd call an API. Here we simulate it.
    const mockUser: User = {
      id: 'user-123',
      name: email.split('@')[0],
      email: email,
    };
    setUser(mockUser);
    localStorage.setItem('aushadhalaya-user', JSON.stringify(mockUser));
  };

  const register = (name: string, email: string, password?: string) => {
    const mockUser: User = {
        id: `user-${Date.now()}`,
        name: name,
        email: email,
    };
    setUser(mockUser);
    localStorage.setItem('aushadhalaya-user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aushadhalaya-user');
    router.push('/');
  };

  const isAuthenticated = useMemo(() => !!user, [user]);

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
