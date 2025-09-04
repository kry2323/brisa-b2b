// Navigation data constants for BottomNavigation component

export const financialReports = [
  { id: 'account-transactions', title: 'Account Transactions', icon: '🧾', url: '/b2b/account-transactions' },
  { id: 'brisa-payments', title: 'Brisa Payments', icon: '💳', url: '/b2b/brisa-payments' },
  { id: 'overdue-report', title: 'Overdue Report', icon: '⏰', url: '/b2b/overdue-report' },
];

export const orderSalesReports = [
  { id: 'shipments-documents', title: 'Shipments, Documents and Status', icon: '📦', url: '/b2b/proforma/proforma-list' },
  { id: 'sales-report', title: 'Sales Report', icon: '📈', url: '/b2b/cis/dispatch-report' },
  { id: 'order-monitoring', title: 'Order Monitoring', icon: '👁️', url: '/b2b/cis/order-monitoring' },
  { id: 'tyres-on-the-way', title: 'Tyres On The Way', icon: '🚚', url: '/b2b/cis/tyres-on-the-way' },
  { id: 'pos-material-tracking', title: 'POS Material Tracking', icon: '🏪', url: '/b2b/proforma/branded-product-report' },
];

export const marketingItems = [
  { id: 'PRODUCT_PHOTO', title: 'Product Photos, Presentations', icon: '📸', url: '/b2b/cis-marketing-library/PRODUCT_PHOTO' },
  { id: 'CAMPAIGN_MATERIAL', title: 'Campaign Materials', icon: '🎯', url: '/b2b/cis-marketing-library/CAMPAIGN_MATERIAL' },
  { id: 'POS_MATERIAL', title: 'POS Materials', icon: '🏪', url: '/b2b/cis-marketing-library/POS_MATERIAL' },
  { id: 'SHOP_BRANDING', title: 'Shop Branding', icon: '🏬', url: '/b2b/cis-marketing-library/SHOP_BRANDING' },
  { id: 'LOGO_GUIDE', title: 'Logo Guidelines', icon: '🅻', url: '/b2b/cis-marketing-library/LOGO_GUIDE' },
  { id: 'PRODUCT_CATALOG', title: 'Catalogues, Leaflets, Posters', icon: '📚', url: '/b2b/cis-marketing-library/PRODUCT_CATALOG' },
  { id: 'VIDEO', title: 'Videos', icon: '🎬', url: '/b2b/cis-marketing-library/VIDEO' },
  { id: 'CAR_BRANDING', title: 'Car Branding', icon: '🚗', url: '/b2b/cis-marketing-library/CAR_BRANDING' },
  { id: 'SOCIAL_MEDIA_DATABASE', title: 'Social Media Database', icon: '📱', url: '/b2b/cis-marketing-library/SOCIAL_MEDIA_DATABASE' },
];

export const orderCategories = [
  {
    id: 'passenger-car',
    title: 'PASSENGER CAR',
    icon: '🚗',
    subCategories: [
      { id: 'psr-13-14', title: 'PSR 13-14', url: '/b2b/All-Categories/PASSENGER-CAR/PSR-13-14/c/CIS_PC_PSR13' },
      { id: 'psr-15', title: 'PSR 15', url: '/b2b/All-Categories/PASSENGER-CAR/PSR-15/c/CIS_PC_PSR15' },
      { id: 'psr-16', title: 'PSR 16', url: '/b2b/All-Categories/PASSENGER-CAR/PSR-16/c/CIS_PC_PSR16' },
      { id: 'uhp', title: 'UHP', url: '/b2b/All-Categories/PASSENGER-CAR/UHP/c/CIS_PC_UHP' },
      { id: '4x4', title: '4X4', url: '/b2b/All-Categories/PASSENGER-CAR/4X4/c/CIS_PC_4X4' },
    ],
  },
  {
    id: 'light-truck',
    title: 'LIGHT TRUCK',
    icon: '🚚',
    subCategories: [
      { id: 'lt-12', title: 'LT 12', url: '/b2b/All-Categories/LIGHT-TRUCK/LT-12/c/CIS_LT_LT12' },
      { id: 'lt-13', title: 'LT 13', url: '/b2b/All-Categories/LIGHT-TRUCK/LT-13/c/CIS_LT_LT13' },
      { id: 'lt-14', title: 'LT 14', url: '/b2b/All-Categories/LIGHT-TRUCK/LT-14/c/CIS_LT_LT14' },
      { id: 'lt-15', title: 'LT 15', url: '/b2b/All-Categories/LIGHT-TRUCK/LT-15/c/CIS_LT_LT15' },
      { id: 'lt-16', title: 'LT 16', url: '/b2b/All-Categories/LIGHT-TRUCK/LT-16/c/CIS_LT_LT16' },
    ],
  },
  {
    id: 'agriculture',
    title: 'AGRICULTURE',
    icon: '🚜',
    subCategories: [
      { id: 'ags-s', title: 'AGS-S', url: '/b2b/All-Categories/AGRICULTURE/AGS-S/c/CIS_AG_AGSS' },
      { id: 'ags-l', title: 'AGS-L', url: '/b2b/All-Categories/AGRICULTURE/AGS-L/c/CIS_AG_AGSL' },
      { id: 'agri', title: 'AGRI', url: '/b2b/All-Categories/AGRICULTURE/AGRI/c/CIS_AG_AGRI' },
    ],
  },
  {
    id: 'off-the-road',
    title: 'OFF THE ROAD',
    icon: '🏔️',
    subCategories: [
      { id: 'ors', title: 'ORS', url: '/b2b/All-Categories/OFF-THE-ROAD/ORS/c/CIS_OTR_ORS' },
    ],
  },
  {
    id: 'tbr',
    title: 'TBR',
    icon: '🚛',
    subCategories: [
      { id: 'tbr-17-5', title: 'TBR 17.5', url: '/b2b/All-Categories/TBR/TBR-17-5/c/CIS_TBR_TBR17' },
      { id: 'tbr-22-5', title: 'TBR 22.5', url: '/b2b/All-Categories/TBR/TBR-22-5/c/CIS_TBR_TBR22' },
    ],
  },
  {
    id: 'promotional-materials',
    title: 'PROMOTIONAL MATERIALS',
    icon: '🎁',
    subCategories: [
      { id: 'branded-consumer-products', title: 'Branded Consumer Products', url: '/b2b/All-Categories/Promotional-Materials-Order/c/CIS_PMO?q=%3Acis-name-asc%3ApatternDescription%3ABranded%2BConsumer%2BProducts&text=#' },
      { id: 'textile-products', title: 'Textile Products', url: '/b2b/All-Categories/Promotional-Materials-Order/c/CIS_PMO?q=%3Acis-name-asc%3ApatternDescription%3ATextile%2BProducts&text=#' },
      { id: 'stands-shop-branding-products', title: 'Stands & Shop Branding Products', url: '/b2b/All-Categories/Promotional-Materials-Order/c/CIS_PMO?q=%3Acis-name-asc%3ApatternDescription%3AStands%2B%2526%2BShop%2BBranding%2BProducts&text=#' },
    ],
  },
];

export const navigationItems = [
  {
    id: 'home',
    title: 'Homepage',
    icon: '🏠',
    shortTitle: 'Homepage',
  },
  {
    id: 'create-order',
    title: 'Create Order',
    icon: '📋',
    shortTitle: 'Create Order',
  },
  {
    id: 'order-sales',
    title: 'Order & Sales Reports',
    icon: '📊',
    shortTitle: 'Order & Sales Reports',
  },
  {
    id: 'financial',
    title: 'Financial Reports',
    icon: '💰',
    shortTitle: 'Financial Reports',
  },
  {
    id: 'marketing-library',
    title: 'Marketing Library',
    icon: '📚',
    shortTitle: 'Marketing Library',
  },
  {
    id: 'other',
    title: 'Other',
    icon: '☰',
    shortTitle: 'Other',
  },
];

export const routeToTabMapping: Record<string, string> = {
  Dashboard: 'home',
  Home: 'home',
  ShipmentsDocuments: 'order-sales',
  SalesReport: 'order-sales',
  OrderMonitoring: 'order-sales',
  PlannedOrders: 'order-sales',
  UnplannedOrders: 'order-sales',
  TyresOnTheWay: 'order-sales',
  POSMaterialTracking: 'order-sales',
  BrisaPayments: 'financial',
  OverdueReport: 'financial',
  AccountTransactions: 'financial',
  FinancialReports: 'financial',
  VideoLibrary: 'marketing-library',
  VideoDetail: 'marketing-library',
  VideoPlayer: 'marketing-library',
  LassaTeam: 'other',
  PasswordUpdate: 'other', // Password update should be in other section
  Cart: 'home', // Cart should not highlight any specific tab
  ProductListing: 'home', // Default to home unless it's from create-order
  ProductDetail: 'home', // Product detail should not highlight any specific tab
  MyWishList: 'home', // Wishlist should not highlight any specific tab
  CompareList: 'home', // Compare should not highlight any specific tab
};

// Modal types for consistent handling
export const MODAL_TYPES = {
  REPORTS: 'reports',
  MENU: 'menu',
  MARKETING: 'marketing',
  FINANCIAL: 'financial',
  UPLOAD_ORDER: 'upload-order',
  HELP: 'help',
  CREATE_ORDER: 'create-order',
} as const;

export type ModalType = typeof MODAL_TYPES[keyof typeof MODAL_TYPES];
