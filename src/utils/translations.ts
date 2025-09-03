export const translations = {
  // Common UI elements
  common: {
    // Buttons
    login: 'Login',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    download: 'Download',
    upload: 'Upload',
    send: 'Send',
    close: 'Close',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    reset: 'Reset',
    refresh: 'Refresh',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    
    // Form fields
    email: 'Email',
    password: 'Password',
    username: 'Username',
    name: 'Name',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    country: 'Country',
    postalCode: 'Postal Code',
    company: 'Company',
    customer: 'Customer',
    order: 'Order',
    invoice: 'Invoice',
    payment: 'Payment',
    amount: 'Amount',
    date: 'Date',
    status: 'Status',
    description: 'Description',
    quantity: 'Quantity',
    price: 'Price',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    discount: 'Discount',
    currency: 'Currency',
    
    // Placeholders
    enterEmail: 'Enter email',
    enterPassword: 'Enter password',
    enterName: 'Enter name',
    enterPhone: 'Enter phone number',
    enterAddress: 'Enter address',
    enterCity: 'Enter city',
    enterCountry: 'Enter country',
    enterPostalCode: 'Enter postal code',
    enterCompany: 'Enter company name',
    enterCustomerCode: 'Enter customer code',
    enterOrderNumber: 'Enter order number',
    enterInvoiceNumber: 'Enter invoice number',
    enterPaymentNumber: 'Enter payment number',
    enterProductCode: 'Enter product code',
    enterMaterialCode: 'Enter material code',
    enterMaterialType: 'Enter material type',
    enterPlanNo: 'Enter Plan No',
    enterInvoiceNo: 'Enter Invoice No',
    enterTransactionType: 'Enter transaction type',
    enterAccountCode: 'Enter account code',
    enterShipmentNumber: 'Enter shipment number',
    enterStatus: 'Enter status',
    searchVideos: 'Search videos...',
    searchProducts: 'Search products...',
    typeOrSelectCustomer: 'Type or select a customer',
    emailAddressesSeparated: 'Email addresses (separate with comma or semicolon)',
    exampleEmails: 'example@company.com, example2@company.com',
    
    // Date formats
    dateFormat: 'DD/MM/YYYY',
    
    // Messages
    temporaryLoginWithoutValidation: 'Temporary login without validation',
    pleaseEnterValidEmails: 'Please enter valid email addresses',
    pleaseEnterAtLeastOneEmail: 'Please enter at least one email address',
    emailSendingError: 'An error occurred while sending email',
    excelReportSentTo: 'Excel report sent to:',
    
    // Cart specific
    emailAddresses: 'Email Address(es)',
    emailAddressesPlaceholder: 'You can write multiple addresses separated by comma, semicolon, or space',
    sendMail: 'Send Mail',
    excelFileCreatedSuccessfully: 'Excel file created successfully',
    excelFileCreationError: 'An error occurred while creating Excel file',
    excelDownload: 'Download Excel',
    excelDownloadDialog: 'Download Excel File',
    reportSentViaEmail: 'Send Report via Email',
    

    
    // Navigation
    dashboard: 'Dashboard',
    reports: 'Reports',
    orders: 'Orders',
    products: 'Products',
    customers: 'Customers',
    payments: 'Payments',
    shipments: 'Shipments',
    materials: 'Materials',
    videos: 'Videos',
    wishlist: 'Wishlist',
    compare: 'Compare',
    team: 'Team',
    
    // Report types
    financialReports: 'Financial Reports',
    salesReport: 'Sales Report',
    orderMonitoring: 'Order Monitoring',
    tyresOnTheWay: 'Tyres On The Way',
    posMaterialTracking: 'POS Material Tracking',
    shipmentsDocuments: 'Shipments Documents',
    
    // Report descriptions
    viewAndManageBrisaPaymentReports: 'View and manage Brisa payment reports',
    viewOverduePaymentReports: 'View overdue payment reports',
    viewAccountTransactionHistory: 'View account transaction history',
    viewShipmentDocuments: 'View shipment documents and reports',
    viewSalesReports: 'View sales reports and analytics',
    monitorOrderStatus: 'Monitor order status and progress',
    trackTyresInTransit: 'Track tyres in transit',
    trackPOSMaterials: 'Track POS materials and inventory',
    
    // Icons
    brisaPaymentsIcon: '💳',
    overdueReportIcon: '⏰',
    accountTransactionsIcon: '📊',
  },
  
  // Screen specific translations
  screens: {
    login: {
      title: 'Lassa B2B',
      loginButton: 'Login',
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Password',
    },
    
    overdueReport: {
      title: 'Overdue Report',
      startDate: 'Start Date',
      endDate: 'End Date',
      customerCode: 'Customer Code',
      invoiceNumber: 'Invoice Number',
      list: 'List',
      excelExport: 'Export to Excel',
      emailSend: 'Send via Email',
    },
    
    brisaPayments: {
      title: 'Brisa Payments',
      startDate: 'Start Date',
      endDate: 'End Date',
      paymentNumber: 'Payment Number',
      paymentStatus: 'Payment Status',
      customerCode: 'Customer Code',
      list: 'List',
      excelExport: 'Export to Excel',
      emailSend: 'Send via Email',
    },
    
    plannedOrders: {
      title: 'Planned Orders',
      startDate: 'Start Date',
      endDate: 'End Date',
      orderNumber: 'Order Number',
      status: 'Status',
      customerCode: 'Customer Code',
      list: 'List',
      excelExport: 'Export to Excel',
      emailSend: 'Send via Email',
    },
    
    unplannedOrders: {
      title: 'Unplanned Orders',
      startDate: 'Start Date',
      endDate: 'End Date',
      orderNumber: 'Order Number',
      status: 'Status',
      customerCode: 'Customer Code',
      list: 'List',
      excelExport: 'Export to Excel',
      emailSend: 'Send via Email',
    },
    
    orderMonitoring: {
      title: 'Order Monitoring',
      startDate: 'Start Date',
      endDate: 'End Date',
      orderNumber: 'Order Number',
      status: 'Status',
      customerCode: 'Customer Code',
      list: 'List',
      excelExport: 'Export to Excel',
      emailSend: 'Send via Email',
    },
    
    posMaterialTracking: {
      title: 'POS Material Tracking',
      startDate: 'Start Date',
      endDate: 'End Date',
      materialCode: 'Material Code',
      materialType: 'Material Type',
      customerCode: 'Customer Code',
      list: 'List',
      excelExport: 'Export to Excel',
      emailSend: 'Send via Email',
    },
    
    tyresOnTheWay: {
      title: 'Tyres On The Way',
      startDate: 'Start Date',
      endDate: 'End Date',
      shipmentNumber: 'Shipment Number',
      productCode: 'Product Code',
      customerCode: 'Customer Code',
      list: 'List',
      excelExport: 'Export to Excel',
      emailSend: 'Send via Email',
    },
    
    salesReport: {
      title: 'Sales Report',
      startDate: 'Start Date',
      endDate: 'End Date',
      productCode: 'Product Code',
      customerCode: 'Customer Code',
      list: 'List',
      excelExport: 'Export to Excel',
      emailSend: 'Send via Email',
    },
    
    shipmentsDocuments: {
      title: 'Shipments Documents',
      startDate: 'Start Date',
      endDate: 'End Date',
      planNo: 'Plan No',
      invoiceNo: 'Invoice No',
      customerCode: 'Customer Code',
      list: 'List',
      excelExport: 'Export to Excel',
      emailSend: 'Send via Email',
    },
    
    accountTransactions: {
      title: 'Account Transactions',
      startDate: 'Start Date',
      endDate: 'End Date',
      accountCode: 'Account Code',
      transactionType: 'Transaction Type',
      customerCode: 'Customer Code',
      list: 'List',
      excelExport: 'Export to Excel',
      emailSend: 'Send via Email',
    },
    
    productDetail: {
      addToCart: 'Add to Cart',
      addToWishlist: 'Add to Wishlist',
      compare: 'Compare',
      specifications: 'Specifications',
      reviews: 'Reviews',
      relatedProducts: 'Related Products',
      sizeGuide: 'Size Guide',
      energyLabel: 'Energy Label',
      nameOptional: 'Name (Optional)',
      commentHeadline: 'Comment Headline',
      reviewDescription: 'Review Description',
      rateStar: 'Rate {star} star{plural}',
    },
    
    videoLibrary: {
      title: 'Video Library',
      searchVideos: 'Search videos...',
    },
    
    wishlist: {
      title: 'My Wishlist',
      emptyMessage: 'Your wishlist is empty',
    },
    
    compare: {
      title: 'Compare Products',
      emptyMessage: 'No products to compare',
    },
    
    team: {
      title: 'Lassa Team',
    },
  },
  
  // Component specific translations
  components: {
    header: {
      menu: 'Menu',
      notifications: 'Notifications',
      profile: 'Profile',
      settings: 'Settings',
    },
    
    footer: {
      copyright: '© 2024 Lassa. All rights reserved.',
    },
    
    bottomNavigation: {
      home: 'Home',
      products: 'Products',
      orders: 'Orders',
      reports: 'Reports',
      profile: 'Profile',
    },
    
    searchBox: {
      placeholder: 'Search products...',
      search: 'Search',
      clear: 'Clear',
    },
    
    filterPanel: {
      title: 'Filters',
      apply: 'Apply',
      reset: 'Reset',
      clear: 'Clear',
    },
    
    pagination: {
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of',
      itemsPerPage: 'Items per page',
      showing: 'Showing',
      to: 'to',
      ofTotal: 'of',
      total: 'total',
    },
    
    columnVisibility: {
      title: 'Column Visibility',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      apply: 'Apply',
      cancel: 'Cancel',
    },
    
    rowDetail: {
      title: 'Row Details',
      close: 'Close',
      edit: 'Edit',
      delete: 'Delete',
    },
    
    customerSelect: {
      title: 'Select Customer',
      search: 'Search customers...',
      select: 'Select',
      cancel: 'Cancel',
    },
    
    datePicker: {
      selectDate: 'Select Date',
      today: 'Today',
      clear: 'Clear',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
    
    excelExport: {
      buttonText: 'Download Excel',
      successMessage: 'Excel file created successfully',
      errorMessage: 'An error occurred while creating Excel file',
      downloadDialog: 'Download Excel File',
    },
    
    emailSender: {
      title: 'Send Report via Email',
      emailAddresses: 'Email Addresses (separate with comma or semicolon)',
      placeholder: 'example@company.com, example2@company.com',
      send: 'Send',
      cancel: 'Cancel',
      successMessage: 'Excel report sent to: {emails}',
      errorMessage: 'An error occurred while sending email',
      validationError: 'Please enter valid email addresses',
      emptyEmailError: 'Please enter at least one email address',
    },
    
    overdueNotice: {
      title: 'Overdue Notice',
      overdueCount: 'Overdue Count',
      maxOverdueDays: 'Max Overdue Days',
      overdueCurrency: 'Overdue Currency',
      viewDetails: 'View Details',
    },
    
    orderOperations: {
      title: 'Order Operations',
      newOrder: 'New Order',
      editOrder: 'Edit Order',
      deleteOrder: 'Delete Order',
      duplicateOrder: 'Duplicate Order',
    },
    
    marketing: {
      title: 'Marketing',
      campaigns: 'Campaigns',
      promotions: 'Promotions',
      offers: 'Offers',
      deals: 'Deals',
    },
    
    reports: {
      title: 'Reports',
      financial: 'Financial',
      sales: 'Sales',
      orders: 'Orders',
      inventory: 'Inventory',
      customers: 'Customers',
    },
    
    banner: {
      title: 'Welcome to Lassa B2B',
      subtitle: 'Your trusted partner for tyre solutions',
      cta: 'Get Started',
    },
    
    energyLabel: {
      title: 'Energy Label',
      efficiency: 'Efficiency',
      wetGrip: 'Wet Grip',
      noiseLevel: 'Noise Level',
    },
    
    lassaLogo: {
      alt: 'Lassa Logo',
    },
    
    lassaLogoSimple: {
      alt: 'Lassa',
    },
    
    showDropdown: {
      show: 'Show',
      entries: 'entries',
    },
    
    snap: {
      title: 'Snap',
      description: 'Quick actions and shortcuts',
    },
    
    viewTypeIcons: {
      grid: 'Grid View',
      list: 'List View',
      card: 'Card View',
    },
  },
  
  // Error messages
  errors: {
    general: 'An error occurred',
    network: 'Network error',
    server: 'Server error',
    validation: 'Validation error',
    authentication: 'Authentication error',
    authorization: 'Authorization error',
    notFound: 'Not found',
    forbidden: 'Access forbidden',
    timeout: 'Request timeout',
    unknown: 'Unknown error',
  },
  
  // Success messages
  success: {
    general: 'Operation completed successfully',
    saved: 'Saved successfully',
    deleted: 'Deleted successfully',
    updated: 'Updated successfully',
    created: 'Created successfully',
    sent: 'Sent successfully',
    uploaded: 'Uploaded successfully',
    downloaded: 'Downloaded successfully',
    exported: 'Exported successfully',
    imported: 'Imported successfully',
  },
  
  // Validation messages
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    minLength: 'Minimum length is {min} characters',
    maxLength: 'Maximum length is {max} characters',
    minValue: 'Minimum value is {min}',
    maxValue: 'Maximum value is {max}',
    pattern: 'Please enter a valid value',
    match: 'Values do not match',
    unique: 'This value must be unique',
  },
};

// Helper function to get translation
export const t = (key: string, params?: Record<string, any>): string => {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }
  
  if (typeof value === 'string') {
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] !== undefined ? String(params[param]) : match;
      });
    }
    return value;
  }
  
  console.warn(`Translation value is not a string: ${key}`);
  return key;
};

// Helper function to get nested translation
export const getTranslation = (path: string): any => {
  const keys = path.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }
  
  return value;
};

export default translations;
