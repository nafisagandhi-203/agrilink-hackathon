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

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
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

  const publicPaths = ['/', '/role-selection', '/login', '/register', '/how-it-works'];
  const isPublicPage = !isAuthenticated || publicPaths.includes(location.pathname);

  if (showSplash) {
    return <SplashPage onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfa] text-[#143601] font-sans selection:bg-[#aad576] relative">
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
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#e2ebd9]/60">
              <div className="flex items-center gap-2.5">
                {!isDashboardPage ? (
                  <button
                    onClick={() => setActiveTab(currentDashboardTab)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#f4f8f0] text-[#143601] text-xs font-black border border-[#e2ebd9] shadow-2xs transition-all duration-200 hover:-translate-x-0.5 active:translate-x-0 cursor-pointer group"
                    title="Return to Dashboard"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#538d22] group-hover:-translate-x-1 transition-transform duration-200" />
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#538d22]" />
                    <span>Back to Dashboard</span>
                  </button>
                ) : (
                  <span className="text-xs font-black text-[#538d22] uppercase tracking-wider hidden sm:inline">
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
                <Route path="/buyer/transactions" element={<TransactionDetail setActiveTab={setActiveTab} />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard setActiveTab={setActiveTab} />} />
                <Route path="/admin/users" element={<UserManagement setActiveTab={setActiveTab} />} />
                <Route path="/admin/alerts" element={<AbnormalPriceMonitoring setActiveTab={setActiveTab} />} />

                {/* Shared Routes */}
                <Route path="/market-prices" element={<AIPriceIntelligence setActiveTab={setActiveTab} />} />
                <Route path="/marketplace" element={<Marketplace setActiveTab={setActiveTab} />} />
                <Route path="/demand-forecast" element={<DemandForecastPage />} />
                <Route path="/profile" element={<Profile setActiveTab={setActiveTab} />} />
                <Route path="/transaction-detail" element={<TransactionDetail setActiveTab={setActiveTab} />} />

                <Route path="*" element={<FarmerDashboard setActiveTab={setActiveTab} />} />
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
