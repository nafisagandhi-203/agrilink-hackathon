import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';
import { apiClient } from '../services/apiClient';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => boolean;
  register: (newUser: Partial<User>) => void;
  demoLogin: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('agripulse_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return mockUsers[0];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('agripulse_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agripulse_user');
    }
  }, [user]);

  const login = (email: string, selectedRole: UserRole): boolean => {
    // Attempt asynchronous backend login in background
    apiClient.post<{ token: string; user?: any }>('/auth/login', {
      email,
      password: 'Password@123'
    }).then((res) => {
      if (res && res.token) {
        apiClient.setToken(res.token);
      }
    }).catch((err) => {
      console.info('Backend auth unreachable, continuing with local session:', err);
    });

    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === selectedRole
    );
    if (found) {
      setUser(found);
      return true;
    }
    const fallbackUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      phone: '+91 98000 00000',
      role: selectedRole,
      verified: true,
      location: 'Rajkot, Gujarat',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setUser(fallbackUser);
    return true;
  };

  const demoLogin = (selectedRole: UserRole) => {
    const demoUser = mockUsers.find((u) => u.role === selectedRole) || mockUsers[0];
    setUser(demoUser);
  };

  const register = (newUser: Partial<User>) => {
    const roleCapitalized = (newUser.role || 'farmer').charAt(0).toUpperCase() + (newUser.role || 'farmer').slice(1);
    
    // Register against backend Web API
    apiClient.post('/auth/register', {
      fullName: newUser.name || 'New User',
      email: newUser.email || `user${Date.now()}@agripulse.in`,
      phoneNumber: newUser.phone || `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      password: 'Password@123',
      role: roleCapitalized
    }).catch((err) => {
      console.info('Backend registration sync pending:', err);
    });

    const created: User = {
      id: `usr-${Date.now()}`,
      name: newUser.name || 'New User',
      email: newUser.email || 'user@agripulse.in',
      phone: newUser.phone || '+91 99999 88888',
      role: newUser.role || 'farmer',
      verified: false,
      location: newUser.location || 'Rajkot, Gujarat',
      joinedDate: new Date().toISOString().split('T')[0],
      farmDetails: newUser.farmDetails,
      businessDetails: newUser.businessDetails,
      vehicleDetails: newUser.vehicleDetails
    };
    setUser(created);
  };

  const logout = () => {
    apiClient.setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        login,
        register,
        demoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
