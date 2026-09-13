import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { SplashPage } from './components/SplashPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { UserProfileDropdown } from './components/UserProfileDropdown';
import { LanguageSelector } from './components/LanguageSelector';
import { VoiceAssistant } from './components/VoiceAssistant';
import { BackgroundAnimation } from './components/BackgroundAnimation';

import { Home } from './pages/Home';
import { RoleSelection } from './pages/RoleSelection';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { HowItWorks } from './pages/HowItWorks';
import { DemandForecastPage } from './pages/DemandForecastPage';
import { TransactionDetail } from './pages/TransactionDetail';
import { Profile } from './pages/Profile';
import { NotificationsPage } from './pages/NotificationsPage';

// Farmer Pages
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { AddCropWizard } from './pages/farmer/AddCropWizard';
import { CropListings } from './pages/farmer/CropListings';
import { AIPriceIntelligence } from './pages/farmer/AIPriceIntelligence';
import { RecommendedBuyers } from './pages/farmer/RecommendedBuyers';
import { OffersAndNegotiation } from './pages/farmer/OffersAndNegotiation';
import { Transportation } from './pages/farmer/Transportation';

// Buyer Pages
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { PurchaseRequirements } from './pages/buyer/PurchaseRequirements';
import { Marketplace } from './pages/buyer/Marketplace';
import { BuyerFarmersPage } from './pages/buyer/BuyerFarmersPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { AdminFarmersPage } from './pages/admin/AdminFarmersPage';
import { AdminBuyersPage } from './pages/admin/AdminBuyersPage';
import { AdminMarketsPage } from './pages/admin/AdminMarketsPage';
import { AdminCropsPage } from './pages/admin/AdminCropsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AbnormalPriceMonitoring } from './pages/admin/AbnormalPriceMonitoring';

import { tabToPath, pathToTab } from './utils/routes';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = pathToTab(location.pathname);
  const setActiveTab = (tab: string) => {
    navigate(tabToPath(tab));
  };

  const getDashboardTab = (userRole?: string | null) => {
    if (userRole === 'buyer') return 'buyer-dashboard';
    if (userRole === 'admin') return 'admin-dashboard';
    return 'farmer-dashboard';
  };

  const currentDashboardTab = getDashboardTab(role);
  const isDashboardPage = activeTab === currentDashboardTab ||
    location.pathname === '/farmer/dashboard' ||
    location.pathname === '/buyer/dashboard' ||
    location.pathname === '/admin/dashboard';

  // Route Protection & Role Redirection
  React.useEffect(() => {
    if (showSplash) return;

    const pathname = location.pathname;
    const isFarmerRoute = pathname.startsWith('/farmer');
    const isBuyerRoute = pathname.startsWith('/buyer');
    const isAdminRoute = pathname.startsWith('/admin');
    const isProtectedRoute = isFarmerRoute || isBuyerRoute || isAdminRoute || pathname === '/profile' || pathname === '/transaction-detail';
    const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/role-selection';

    // 1. Unauthenticated trying to access protected route -> redirect to /login
    if (!isAuthenticated && isProtectedRoute) {
      navigate('/login', { replace: true });
      return;
    }

    // 2. Authenticated visiting login/register/role-selection -> redirect to matching dashboard
    if (isAuthenticated && isAuthPage) {
      if (role === 'buyer') navigate('/buyer/dashboard', { replace: true });
      else if (role === 'admin') navigate('/admin/dashboard', { replace: true });
      else navigate('/farmer/dashboard', { replace: true });
      return;
    }

    // 3. Role mismatch for protected routes -> redirect to own dashboard
    if (isAuthenticated) {
      if (role === 'farmer' && (isBuyerRoute || isAdminRoute)) {
        navigate('/farmer/dashboard', { replace: true });
      } else if (role === 'buyer' && (isFarmerRoute || isAdminRoute)) {
        navigate('/buyer/dashboard', { replace: true });
      } else if (role === 'admin' && (isFarmerRoute || isBuyerRoute)) {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, role, location.pathname, navigate, showSplash]);

  const publicPaths = ['/', '/role-selection', '/login', '/register', '/how-it-works'];
  const isPublicPage = !isAuthenticated || publicPaths.includes(location.pathname);

  if (showSplash) {
    return <SplashPage onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF5] text-[#263322] font-sans selection:bg-[#DDECC8] relative">
      <BackgroundAnimation />

      {isPublicPage ? (
        <div className="flex-1 flex flex-col min-h-screen">
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col">
            <div key={location.pathname} className="animate-page-transition w-full flex-1">
              <Routes>
                <Route path="/" element={<Home setActiveTab={setActiveTab} onOpenVoiceModal={() => setIsVoiceOpen(true)} />} />
                <Route path="/role-selection" element={<RoleSelection setActiveTab={setActiveTab} />} />
                <Route path="/login" element={<Login setActiveTab={setActiveTab} />} />
                <Route path="/register" element={<Register setActiveTab={setActiveTab} />} />
                <Route path="/how-it-works" element={<HowItWorks setActiveTab={setActiveTab} />} />
                <Route path="/market-prices" element={<AIPriceIntelligence setActiveTab={setActiveTab} />} />
                <Route path="/marketplace" element={<Marketplace setActiveTab={setActiveTab} />} />
                <Route path="/demand-forecast" element={<DemandForecastPage />} />
                <Route path="*" element={<Home setActiveTab={setActiveTab} onOpenVoiceModal={() => setIsVoiceOpen(true)} />} />
              </Routes>
            </div>
          </main>

          <Footer setActiveTab={setActiveTab} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onOpenVoiceModal={() => setIsVoiceOpen(true)} />
          
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col space-y-4">
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#DCE4D3]">
              <div className="flex items-center gap-2.5">
                {!isDashboardPage ? (
                  <button
                    onClick={() => setActiveTab(currentDashboardTab)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#E6F1D8] text-[#263322] text-xs font-black border border-[#DCE4D3] shadow-2xs transition-all duration-200 hover:-translate-x-0.5 active:translate-x-0 cursor-pointer group"
                    title="Return to Dashboard"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#5F8D4E] group-hover:-translate-x-1 transition-transform duration-200" />
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#5F8D4E]" />
                    <span>Back to Dashboard</span>
                  </button>
                ) : (
                  <span className="text-xs font-black text-[#5F8D4E] uppercase tracking-wider hidden sm:inline">
                    AgriPulse Workspace
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5 ml-auto">
                <LanguageSelector />
                <UserProfileDropdown setActiveTab={setActiveTab} />
              </div>
            </div>

            <div key={location.pathname} className="animate-page-transition w-full flex-1">
              <Routes>
                {/* Farmer Routes */}
                <Route path="/farmer/dashboard" element={<FarmerDashboard setActiveTab={setActiveTab} />} />
                <Route path="/farmer/add-crop" element={<AddCropWizard setActiveTab={setActiveTab} />} />
                <Route path="/farmer/listings" element={<CropListings setActiveTab={setActiveTab} />} />
                <Route path="/farmer/buyers" element={<RecommendedBuyers setActiveTab={setActiveTab} />} />
                <Route path="/farmer/weather" element={<FarmerDashboard setActiveTab={setActiveTab} />} />
                <Route path="/farmer/offers" element={<OffersAndNegotiation setActiveTab={setActiveTab} />} />
                <Route path="/farmer/transport" element={<Transportation setActiveTab={setActiveTab} />} />
                <Route path="/farmer/transactions" element={<TransactionDetail setActiveTab={setActiveTab} />} />

                {/* Buyer Routes */}
                <Route path="/buyer/dashboard" element={<BuyerDashboard setActiveTab={setActiveTab} />} />
                <Route path="/buyer/requirements" element={<PurchaseRequirements setActiveTab={setActiveTab} />} />
                <Route path="/buyer/farmers" element={<BuyerFarmersPage setActiveTab={setActiveTab} />} />
                <Route path="/buyer/offers" element={<OffersAndNegotiation setActiveTab={setActiveTab} />} />
                <Route path="/buyer/transport" element={<Transportation setActiveTab={setActiveTab} />} />
                <Route path="/buyer/transactions" element={<TransactionDetail setActiveTab={setActiveTab} />} />
                <Route path="/buyer/notifications" element={<NotificationsPage setActiveTab={setActiveTab} />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard setActiveTab={setActiveTab} />} />
                <Route path="/admin/users" element={<UserManagement setActiveTab={setActiveTab} />} />
                <Route path="/admin/farmers" element={<AdminFarmersPage setActiveTab={setActiveTab} />} />
                <Route path="/admin/buyers" element={<AdminBuyersPage setActiveTab={setActiveTab} />} />
                <Route path="/admin/crops" element={<AdminCropsPage setActiveTab={setActiveTab} />} />
                <Route path="/admin/markets" element={<AdminMarketsPage setActiveTab={setActiveTab} />} />
                <Route path="/admin/alerts" element={<AbnormalPriceMonitoring setActiveTab={setActiveTab} />} />
                <Route path="/admin/transactions" element={<TransactionDetail setActiveTab={setActiveTab} />} />
                <Route path="/admin/transport" element={<Transportation setActiveTab={setActiveTab} />} />
                <Route path="/admin/analytics" element={<AdminAnalyticsPage setActiveTab={setActiveTab} />} />
                <Route path="/admin/settings" element={<AdminSettingsPage setActiveTab={setActiveTab} />} />

                {/* Shared Routes */}
                <Route path="/market-prices" element={<AIPriceIntelligence setActiveTab={setActiveTab} />} />
                <Route path="/marketplace" element={<Marketplace setActiveTab={setActiveTab} />} />
                <Route path="/demand-forecast" element={<DemandForecastPage />} />
                <Route path="/profile" element={<Profile setActiveTab={setActiveTab} />} />
                <Route path="/transaction-detail" element={<TransactionDetail setActiveTab={setActiveTab} />} />

                <Route path="*" element={
                  role === 'buyer' ? <BuyerDashboard setActiveTab={setActiveTab} /> :
                  role === 'admin' ? <AdminDashboard setActiveTab={setActiveTab} /> :
                  <FarmerDashboard setActiveTab={setActiveTab} />
                } />
              </Routes>
            </div>
          </main>
        </div>
      )}

      <VoiceAssistant isOpen={isVoiceOpen} setIsOpen={setIsVoiceOpen} setActiveTab={setActiveTab} />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <BrowserRouter>
              <MainAppContent />
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
