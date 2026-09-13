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

    // Buyer Routes (Scoped to /buyer)
    case 'buyer-dashboard':
      return '/buyer/dashboard';
    case 'buyer-notifications':
      return '/buyer/notifications';
    case 'buyer-requirements':
      return '/buyer/requirements';
    case 'buyer-farmers':
      return '/buyer/farmers';
    case 'buyer-offers':
    case 'buyer-messages':
      return '/buyer/offers';
    case 'buyer-transactions':
      return '/buyer/transactions';
    case 'buyer-transport':
      return '/buyer/transport';

    // Admin Routes (Scoped to /admin)
    case 'admin-dashboard':
      return '/admin/dashboard';
    case 'admin-analytics':
    case 'admin-reports':
      return '/admin/analytics';
    case 'admin-users':
      return '/admin/users';
    case 'admin-buyers':
      return '/admin/buyers';
    case 'admin-farmers':
      return '/admin/farmers';
    case 'admin-crops':
      return '/admin/crops';
    case 'admin-markets':
      return '/admin/markets';
    case 'admin-alerts':
      return '/admin/alerts';
    case 'admin-transactions':
      return '/admin/transactions';
    case 'admin-transport':
      return '/admin/transport';
    case 'admin-settings':
      return '/admin/settings';

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

    // Farmer
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

    // Buyer
    case '/buyer/dashboard':
      return 'buyer-dashboard';
    case '/buyer/notifications':
      return 'buyer-notifications';
    case '/buyer/requirements':
      return 'buyer-requirements';
    case '/buyer/farmers':
      return 'buyer-farmers';
    case '/buyer/offers':
      return 'buyer-offers';
    case '/buyer/transport':
      return 'buyer-transport';
    case '/buyer/transactions':
      return 'buyer-transactions';

    // Admin
    case '/admin/dashboard':
      return 'admin-dashboard';
    case '/admin/users':
      return 'admin-users';
    case '/admin/farmers':
      return 'admin-farmers';
    case '/admin/buyers':
      return 'admin-buyers';
    case '/admin/crops':
      return 'admin-crops';
    case '/admin/markets':
      return 'admin-markets';
    case '/admin/alerts':
      return 'admin-alerts';
    case '/admin/transactions':
      return 'admin-transactions';
    case '/admin/transport':
      return 'admin-transport';
    case '/admin/analytics':
      return 'admin-analytics';
    case '/admin/settings':
      return 'admin-settings';

    case '/profile':
      return 'profile';
    case '/transaction-detail':
      return 'transaction-detail';

    default:
      return 'home';
  }
};
