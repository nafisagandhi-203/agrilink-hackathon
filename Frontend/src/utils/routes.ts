export const tabToPath = (tab: string): string => {
  switch (tab) {
    case 'home':
      return '/';
    case 'role-selection':
      return '/role-selection';
    case 'login':
      return '/login';
    case 'register':
      return '/register';
    case 'how-it-works':
      return '/how-it-works';
    case 'market-prices':
      return '/market-prices';
    case 'marketplace':
      return '/marketplace';
    case 'demand-forecast':
    case 'farmer-demand':
      return '/demand-forecast';

    // Farmer Routes
    case 'farmer-dashboard':
      return '/farmer/dashboard';
    case 'farmer-add-crop':
      return '/farmer/add-crop';
    case 'farmer-listings':
      return '/farmer/listings';
    case 'farmer-ai-price':
      return '/market-prices';
    case 'farmer-buyers':
      return '/farmer/buyers';
    case 'farmer-weather':
      return '/farmer/weather';
    case 'farmer-offers':
    case 'farmer-messages':
      return '/farmer/offers';
    case 'farmer-transport':
      return '/farmer/transport';
    case 'farmer-transactions':
      return '/farmer/transactions';

    // Buyer Routes
    case 'buyer-dashboard':
    case 'buyer-notifications':
      return '/buyer/dashboard';
    case 'buyer-requirements':
      return '/buyer/requirements';
    case 'buyer-farmers':
      return '/farmer/buyers';
    case 'buyer-offers':
    case 'buyer-messages':
      return '/farmer/offers';
    case 'buyer-transactions':
      return '/buyer/transactions';
    case 'buyer-transport':
      return '/farmer/transport';

    // Admin Routes
    case 'admin-dashboard':
    case 'admin-reports':
    case 'admin-analytics':
      return '/admin/dashboard';
    case 'admin-users':
    case 'admin-buyers':
      return '/admin/users';
    case 'admin-farmers':
      return '/farmer/buyers';
    case 'admin-crops':
    case 'admin-markets':
      return '/farmer/listings';
    case 'admin-alerts':
      return '/admin/alerts';
    case 'admin-transactions':
      return '/farmer/transactions';

    case 'profile':
      return '/profile';
    case 'transaction-detail':
      return '/transaction-detail';

    default:
      return tab.startsWith('/') ? tab : `/${tab}`;
  }
};

export const pathToTab = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'home';
    case '/role-selection':
      return 'role-selection';
    case '/login':
      return 'login';
    case '/register':
      return 'register';
    case '/how-it-works':
      return 'how-it-works';
    case '/market-prices':
      return 'market-prices';
    case '/marketplace':
      return 'marketplace';
    case '/demand-forecast':
      return 'demand-forecast';

    case '/farmer/dashboard':
      return 'farmer-dashboard';
    case '/farmer/add-crop':
      return 'farmer-add-crop';
    case '/farmer/listings':
      return 'farmer-listings';
    case '/farmer/buyers':
      return 'farmer-buyers';
    case '/farmer/weather':
      return 'farmer-weather';
    case '/farmer/offers':
      return 'farmer-offers';
    case '/farmer/transport':
      return 'farmer-transport';
    case '/farmer/transactions':
      return 'farmer-transactions';

    case '/buyer/dashboard':
      return 'buyer-dashboard';
    case '/buyer/requirements':
      return 'buyer-requirements';
    case '/buyer/transactions':
      return 'buyer-transactions';

    case '/admin/dashboard':
      return 'admin-dashboard';
    case '/admin/users':
      return 'admin-users';
    case '/admin/alerts':
      return 'admin-alerts';

    case '/profile':
      return 'profile';
    case '/transaction-detail':
      return 'transaction-detail';

    default:
      return 'home';
  }
};
