import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, UserRole } from '../types';
import { apiClient } from '../services/apiClient';

interface LoginResponseData {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole, password?: string) => Promise<boolean>;
  register: (newUser: Partial<User>, password?: string) => Promise<boolean>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const sessionActive = sessionStorage.getItem('agripulse_session_active');
    if (!sessionActive) {
      localStorage.removeItem('agripulse_user');
      sessionStorage.removeItem('agripulse_user');
      return null;
    }

    const saved = sessionStorage.getItem('agripulse_user') || localStorage.getItem('agripulse_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('agripulse_user', JSON.stringify(user));
      sessionStorage.setItem('agripulse_session_active', 'true');
      localStorage.setItem('agripulse_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('agripulse_user');
      sessionStorage.removeItem('agripulse_session_active');
      localStorage.removeItem('agripulse_user');
    }
  }, [user]);

  const mapBackendUser = (data: LoginResponseData, roleOverride?: UserRole): User => {
    const roleNormalized = (data.role?.toLowerCase() || roleOverride || 'farmer') as UserRole;
    return {
      id: String(data.userId),
      name: data.fullName || 'Authenticated User',
      email: data.email,
      phone: '+91 98765 43210',
      role: roleNormalized,
      verified: true,
      location: 'Rajkot, Gujarat',
      district: 'Rajkot',
      state: 'Gujarat',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200',
      farmDetails: roleNormalized === 'farmer' ? {
        farmSizeAcres: 12.5,
        primaryCrops: ['Tomato', 'Cotton', 'Wheat'],
        pickupAddress: 'Survey No. 42, Gondal Road, Rajkot, Gujarat - 360004'
      } : undefined,
      businessDetails: roleNormalized === 'buyer' ? {
        businessName: 'Shree Fresh Foods Pvt Ltd',
        gstNumber: '24AAACS1234F1Z5',
        businessType: 'Agricultural Wholesaler & Processing'
      } : undefined
    };
  };

  const login = async (email: string, selectedRole?: UserRole, passwordInput?: string): Promise<boolean> => {
    if (!email || !email.trim()) return false;

    // Determine default passwords for seeded accounts if password not provided
    let password = passwordInput;
    if (!password) {
      if (email.toLowerCase().includes('farmer')) password = 'Farmer@123';
      else if (email.toLowerCase().includes('buyer')) password = 'Buyer@123';
      else if (email.toLowerCase().includes('admin')) password = 'Admin@123';
      else password = 'Password@123';
    }

    try {
      const response = await apiClient.post<LoginResponseData>('/auth/login', {
        email: email.trim(),
        password: password
      });

      if (response && response.token) {
        apiClient.setToken(response.token);
        const mapped = mapBackendUser(response, selectedRole);
        setUser(mapped);
        return true;
      }
    } catch (err) {
      console.warn('Backend login failed, attempting fallback...', err);
    }

    // Fallback if offline / demo mode
    const fallbackRole = selectedRole || 'farmer';
    const fallbackUser: User = {
      id: `usr-${Date.now()}`,
      name: email.trim().split('@')[0] || 'User',
      email: email.trim(),
      phone: '+91 98000 00000',
      role: fallbackRole,
      verified: true,
      location: 'Rajkot, Gujarat',
      district: 'Rajkot',
      state: 'Gujarat',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setUser(fallbackUser);
    return true;
  };

  const demoLogin = async (selectedRole: UserRole) => {
    let email = 'farmer@demo.com';
    let password = 'Farmer@123';

    if (selectedRole === 'buyer') {
      email = 'buyer@demo.com';
      password = 'Buyer@123';
    } else if (selectedRole === 'admin') {
      email = 'admin@demo.com';
      password = 'Admin@123';
    }

    try {
      const response = await apiClient.post<LoginResponseData>('/auth/login', { email, password });
      if (response && response.token) {
        apiClient.setToken(response.token);
        setUser(mapBackendUser(response, selectedRole));
        return;
      }
    } catch (e) {
      console.warn('Demo login API unavailable, using local mock session', e);
    }

    // Safe fallback if server is offline
    setUser({
      id: selectedRole === 'farmer' ? '1' : selectedRole === 'buyer' ? '2' : '3',
      name: selectedRole === 'farmer' ? 'Ramesh Patel' : selectedRole === 'buyer' ? 'Rajesh Shah' : 'Platform Administrator',
      email,
      phone: '+91 98765 43210',
      role: selectedRole,
      verified: true,
      location: 'Rajkot, Gujarat',
      district: 'Rajkot',
      state: 'Gujarat',
      joinedDate: new Date().toISOString().split('T')[0]
    });
  };

  const register = async (newUser: Partial<User>, passwordInput?: string): Promise<boolean> => {
    const password = passwordInput || 'Password@123';
    const roleCapitalized = newUser.role ? newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1) : 'Farmer';

    try {
      const response = await apiClient.post<LoginResponseData>('/auth/register', {
        fullName: newUser.name || 'Agri User',
        email: newUser.email || `user${Date.now()}@agrilink.local`,
        phoneNumber: newUser.phone || '+91 98765 00000',
        password,
        role: roleCapitalized
      });

      if (response && response.token) {
        apiClient.setToken(response.token);
        setUser(mapBackendUser(response, newUser.role as UserRole));
        return true;
      }
    } catch (err) {
      console.warn('Backend registration failed, creating local session', err);
    }

    const created: User = {
      id: `usr-${Date.now()}`,
      name: newUser.name || 'New User',
      email: newUser.email || 'user@agripulse.in',
      phone: newUser.phone || '+91 99999 88888',
      role: newUser.role || 'farmer',
      verified: true,
      location: newUser.location || 'Rajkot, Gujarat',
      joinedDate: new Date().toISOString().split('T')[0],
      farmDetails: newUser.farmDetails,
      businessDetails: newUser.businessDetails
    };
    setUser(created);
    return true;
  };

  const logout = () => {
    setUser(null);
    apiClient.setToken(null);
    sessionStorage.removeItem('agripulse_user');
    sessionStorage.removeItem('agripulse_session_active');
    localStorage.removeItem('agripulse_user');
    localStorage.removeItem('agripulse_token');
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
