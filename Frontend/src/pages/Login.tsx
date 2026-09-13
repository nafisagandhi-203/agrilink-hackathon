import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BackButton } from '../components/BackButton';
import type { UserRole } from '../types';

interface LoginProps {
  setActiveTab: (tab: string) => void;
}

export const Login: React.FC<LoginProps> = ({ setActiveTab }) => {
  const { login, demoLogin } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const searchRole = new URLSearchParams(location.search).get('role') as UserRole;
  const initialRole: UserRole = ['farmer', 'buyer', 'admin'].includes(searchRole) ? searchRole : 'farmer';

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState(() => {
    if (initialRole === 'buyer') return 'buyer@demo.com';
    if (initialRole === 'admin') return 'admin@demo.com';
    return 'farmer@demo.com';
  });
  const [password, setPassword] = useState('demo123');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (searchRole && ['farmer', 'buyer', 'admin'].includes(searchRole)) {
      setSelectedRole(searchRole);
      if (searchRole === 'farmer') setEmail('farmer@demo.com');
      if (searchRole === 'buyer') setEmail('buyer@demo.com');
      if (searchRole === 'admin') setEmail('admin@demo.com');
    }
  }, [searchRole]);

  // 3 Roles ONLY (No transporter)
  const roles: { role: UserRole; title: string; icon: string; bg: string; subtitle: string }[] = [
    {
      role: 'farmer',
      title: t('farmerRoleTitle'),
      icon: '👨‍🌾',
      bg: 'bg-[#f4f8f0] border-[#e2ebd9] text-[#143601]',
      subtitle: 'Manage crops, discover fair prices, receive weather alerts and connect with verified buyers.'
    },
    {
      role: 'buyer',
      title: t('buyerRoleTitle'),
      icon: '🛒',
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      subtitle: 'Discover farm produce, post purchase requirements, receive emergency alerts and connect with farmers.'
    },
    {
      role: 'admin',
      title: t('adminRoleTitle'),
      icon: '🛡️',
      bg: 'bg-purple-50 border-purple-200 text-purple-900',
      subtitle: 'Admin Control Center: Monitor the complete AgriPulse ecosystem, verify users and review alerts.'
    }
  ];

  const activeRoleData = roles.find((r) => r.role === selectedRole) || roles[0];

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'farmer') setEmail('farmer@demo.com');
    if (role === 'buyer') setEmail('buyer@demo.com');
    if (role === 'admin') setEmail('admin@demo.com');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !email.trim()) {
      setErrorMsg('Please enter your email or phone number.');
      return;
    }
    const success = await login(email, selectedRole, password);
    if (success) {
      redirectToRoleDashboard(selectedRole);
    } else {
      setErrorMsg('Invalid email or credentials. Please try again.');
    }
  };

  const handleDemoQuickLogin = async (role: UserRole) => {
    await demoLogin(role);
    redirectToRoleDashboard(role);
  };

  const redirectToRoleDashboard = (role: UserRole) => {
    switch (role) {
      case 'farmer':
        setActiveTab('farmer-dashboard');
        break;
      case 'buyer':
        setActiveTab('buyer-dashboard');
        break;
      case 'admin':
        setActiveTab('admin-dashboard');
        break;
      default:
        setActiveTab('farmer-dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="home" setActiveTab={setActiveTab} />
        <span className="text-xs font-bold text-[#538d22] bg-[#f4f8f0] px-3 py-1 rounded-full border border-[#e2ebd9]">
          Secure Sign In
        </span>
        
      </div>

      {/* SIH DEMO QUICK LOGIN BANNER */}
      {/* <div className="p-6 rounded-3xl bg-gradient-to-r from-[#143601] via-[#1a4301] to-[#245501] text-white shadow-xl border border-[#538d22]/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#aad576]" />
            <h3 className="font-extrabold text-base">SIH Jury Quick Demo Mode</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#538d22]/40 text-[#aad576] border border-[#73a942]/40">
            Instant 1-Click Access
          </span>
        </div>
        <p className="text-xs text-[#aad576] font-medium">
          Experience AgriPulse immediately as any stakeholder role without typing credentials:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleDemoQuickLogin('farmer')}
            className="p-3 rounded-2xl bg-[#538d22] hover:bg-[#73a942] text-white text-xs font-bold shadow transition-transform hover:scale-105 flex items-center justify-center gap-1.5"
          >
            <span>👨‍🌾 Demo Farmer</span>
          </button>

          <button
            onClick={() => handleDemoQuickLogin('buyer')}
            className="p-3 rounded-2xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold shadow transition-transform hover:scale-105 flex items-center justify-center gap-1.5"
          >
            <span>🛒 Demo Buyer</span>
          </button>

          <button
            onClick={() => handleDemoQuickLogin('admin')}
            className="p-3 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold shadow transition-transform hover:scale-105 flex items-center justify-center gap-1.5"
          >
            <span>🛡️ Demo Admin</span>
          </button>
        </div>
      </div> */}

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-[#e2ebd9] overflow-hidden">
        
        {/* Role Selector Tabs (3 Roles ONLY) */}
        <div className="p-4 bg-[#f4f8f0] border-b border-[#e2ebd9] grid grid-cols-3 gap-2">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => handleRoleChange(r.role)}
              className={`p-3 rounded-2xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 border ${
                selectedRole === r.role
                  ? 'bg-white text-[#143601] border-[#538d22] shadow-md scale-105 font-extrabold'
                  : 'text-[#4b633d] hover:bg-white/60 border-transparent'
              }`}
            >
              <span className="text-xl">{r.icon}</span>
              <span>{r.title}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Welcome Experience Banner */}
        <div className={`p-6 border-b ${activeRoleData.bg} transition-colors`}>
          <h2 className="text-xl font-black mb-1">
            Welcome Back, {selectedRole.toUpperCase()}!
          </h2>
          <p className="text-xs leading-relaxed font-medium">
            {activeRoleData.subtitle}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#143601] uppercase tracking-wider">
              Email Address / Phone Number
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-[#538d22] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email or phone"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e2ebd9] bg-white text-[#143601] text-sm focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#143601] uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-[#538d22] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e2ebd9] bg-white text-[#143601] text-sm focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-sm shadow-xl shadow-[#143601]/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Login as {selectedRole.toUpperCase()}</span>
            <ArrowRight className="w-4 h-4 text-[#aad576]" />
          </button>

          <button
            type="button"
            onClick={() => handleDemoQuickLogin(selectedRole)}
            className="w-full py-3 px-6 rounded-2xl bg-[#f4f8f0] hover:bg-[#e2ebd9] text-[#143601] font-extrabold text-xs border border-[#e2ebd9] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#538d22]" />
            <span>Instant Demo Login ({selectedRole.toUpperCase()})</span>
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-[#4b633d]">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate(`/register?role=${selectedRole}`)}
                className="font-bold text-[#143601] hover:underline cursor-pointer"
              >
                Register here
              </button>
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
