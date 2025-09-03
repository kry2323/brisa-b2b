// Mock Data Generator for Report Screens
// This file serves as a static backend for the application
import { CUSTOMERS } from './customers';

export interface TableDataItem {
  customer: string;
  customerName: string;
  shipToParty: string;
  shipToPartyName: string;
  customerOrder: string;
  orderDate: string;
  plannedOrder: string;
  invoice: string;
  invoiceDate: string;
  productCode: string;
  definition: string;
  group: string;
  size: string;
  season: string;
  totalQuantity: string;
  netValue: string;
  currency: string;
  incoterm: string;
  color: string;
  [key: string]: string; // Index signature for dynamic access
}

// Helper function to generate random data
const generateRandomData = (count: number): TableDataItem[] => {
  const customers = CUSTOMERS;

  const shipToParties = [
    { code: '93000030', name: 'SC RADBURG SOFT SRL' },
    { code: '93000031', name: 'TECH SOLUTIONS LTD' },
    { code: '93000032', name: 'INDUSTRIAL PARTS CO' },
    { code: '93000033', name: 'AUTO PARTS SUPPLY' },
    { code: '93000034', name: 'LOGISTICS PRO LTD' },
    { code: '93000035', name: 'RACING TEAM SUPPLY' },
    { code: '93000036', name: 'FLEET MANAGEMENT CO' },
    { code: '93000037', name: 'CONSTRUCTION SUPPLY' },
    { code: '93000038', name: 'AVIATION EQUIPMENT' },
    { code: '93000039', name: 'MARINE SUPPLY CO' },
    { code: '93000040', name: 'ELECTRONICS DISTRIBUTOR' },
    { code: '93000041', name: 'PHARMA SOLUTIONS' },
    { code: '93000042', name: 'AUTOMOTIVE PARTS' },
    { code: '93000043', name: 'AEROSPACE COMPONENTS' },
    { code: '93000044', name: 'ENERGY SOLUTIONS' },
  ];

  const productCodes = [
    { code: 'P001', definition: 'Summer Tire Model A', group: 'A', size: '205/55R16', season: 'Summer' },
    { code: 'P002', definition: 'Winter Tire Model B', group: 'B', size: '225/45R17', season: 'Winter' },
    { code: 'P003', definition: 'All Season Tire Model C', group: 'C', size: '215/60R16', season: 'All Season' },
    { code: 'P004', definition: 'Performance Tire Model D', group: 'D', size: '245/40R18', season: 'Summer' },
    { code: 'P005', definition: 'Off-Road Tire Model E', group: 'E', size: '265/70R16', season: 'All Terrain' },
    { code: 'P006', definition: 'Commercial Tire Model F', group: 'F', size: '195/75R16C', season: 'Commercial' },
    { code: 'P007', definition: 'Racing Tire Model G', group: 'G', size: '245/35R19', season: 'Racing' },
    { code: 'P008', definition: 'Fleet Tire Model H', group: 'H', size: '225/65R17', season: 'All Season' },
    { code: 'P009', definition: 'Heavy Duty Tire Model I', group: 'I', size: '315/80R22.5', season: 'Heavy Duty' },
    { code: 'P010', definition: 'Aircraft Tire Model J', group: 'J', size: '6.50-10', season: 'Aircraft' },
    { code: 'P011', definition: 'Marine Tire Model K', group: 'K', size: '8.25-15', season: 'Marine' },
    { code: 'P012', definition: 'Electric Vehicle Tire L', group: 'L', size: '235/45R18', season: 'All Season' },
    { code: 'P013', definition: 'Hybrid Tire Model M', group: 'M', size: '225/50R17', season: 'All Season' },
    { code: 'P014', definition: 'SUV Tire Model N', group: 'N', size: '255/65R17', season: 'All Terrain' },
    { code: 'P015', definition: 'Luxury Tire Model O', group: 'O', size: '275/35R20', season: 'Summer' },
  ];

  const colors = ['Black', 'White', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Brown'];
  const currencies = ['EUR', 'USD', 'GBP', 'JPY', 'CHF'];
  const incoterms = ['FOB', 'CIF', 'EXW', 'DDP', 'FCA', 'CPT', 'DAP', 'FAS'];

  const data: TableDataItem[] = [];

  for (let i = 1; i <= count; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const shipToParty = shipToParties[Math.floor(Math.random() * shipToParties.length)];
    const product = productCodes[Math.floor(Math.random() * productCodes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const incoterm = incoterms[Math.floor(Math.random() * incoterms.length)];

    // Generate random dates in 2023
    const startDate = new Date(2023, 0, 1);
    const endDate = new Date(2023, 11, 31);
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const orderDate = randomDate.toLocaleDateString('en-GB');
    
    // Invoice date is 3-7 days after order date
    const invoiceDate = new Date(randomDate.getTime() + (3 + Math.random() * 4) * 24 * 60 * 60 * 1000);
    const invoiceDateStr = invoiceDate.toLocaleDateString('en-GB');

    // Generate random quantities and values
    const totalQuantity = Math.floor(50 + Math.random() * 1000).toString();
    const netValue = (Math.random() * 50000 + 5000).toFixed(2);

    data.push({
      customer: customer.code,
      customerName: customer.name,
      shipToParty: shipToParty.code,
      shipToPartyName: shipToParty.name,
      customerOrder: `ORD-2023-${i.toString().padStart(3, '0')}`,
      orderDate: orderDate,
      plannedOrder: `PO-2023-${i.toString().padStart(3, '0')}`,
      invoice: `INV${i.toString().padStart(3, '0')}`,
      invoiceDate: invoiceDateStr,
      productCode: product.code,
      definition: product.definition,
      group: product.group,
      size: product.size,
      season: product.season,
      totalQuantity: totalQuantity,
      netValue: `€${netValue}`,
      currency: currency,
      incoterm: incoterm,
      color: color,
    });
  }

  return data;
};

// Generate Overdue Report specific data
const generateOverdueReportData = (count: number): TableDataItem[] => {
  const tyres = [
    '205/55R16 91V',
    '225/45R17 91W',
    '215/60R16 95H',
    '245/40R18 97Y',
    '265/70R16 112T',
    '195/75R16C 107/105R',
    '245/35R19 93Y',
    '225/65R17 102H',
    '315/80R22.5 154/150L',
    '6.50-10 6PR'
  ];
  const amounts = [1250.50, 890.25, 2100.00, 450.75, 1750.30, 3200.45, 980.60, 1500.20, 2750.80, 650.90];
  const currencies = ['EUR', 'USD', 'GBP', 'TRY'];
  const paymentTerms = ['30 Days', '45 Days', '60 Days', '90 Days', 'Net 30', 'Net 45'];
  const partialPayments = [0, 500.00, 750.25, 1000.50, 1250.00, 1500.75];

  const data: TableDataItem[] = [];

  for (let i = 1; i <= count; i++) {
    const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    const tyre = tyres[Math.floor(Math.random() * tyres.length)];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const paymentTerm = paymentTerms[Math.floor(Math.random() * paymentTerms.length)];
    const partialPayment = partialPayments[Math.floor(Math.random() * partialPayments.length)];
    const remainAmount = amount - partialPayment;

    // Generate random dates in 2023
    const startDate = new Date(2023, 0, 1);
    const endDate = new Date(2023, 11, 31);
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const invoiceDate = randomDate.toLocaleDateString('en-GB');
    
    // Due date is based on payment term
    const daysToAdd = parseInt(paymentTerm.match(/\d+/)?.[0] || '30');
    const dueDate = new Date(randomDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    const dueDateStr = dueDate.toLocaleDateString('en-GB');
    
    // Calculate overdue days
    const today = new Date();
    const overdueDays = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (24 * 60 * 60 * 1000)));

    data.push({
      customer: customer.code,
      customerName: customer.name,
      invoice: `INV${String(i).padStart(6, '0')}`,
      overdueDays: overdueDays.toString(),
      invoiceAmount: amount.toFixed(2),
      curr: currency,
      invoiceDate: invoiceDate,
      dueDate: dueDateStr,
      plannedOrders: `PL${String(i).padStart(8, '0')}`,
      partialPayment: partialPayment.toFixed(2),
      remainAmount: remainAmount.toFixed(2),
      incoterm: ['FOB', 'CIF', 'EXW', 'DDP'][i % 4],
      tyres: tyre,
      paymentTerm: paymentTerm,
      // Keep other fields for compatibility
      shipToParty: `93000${String(i).padStart(3, '0')}`,
      shipToPartyName: `Ship-to Party ${i}`,
      customerOrder: `ORD${String(i).padStart(6, '0')}`,
      orderDate: invoiceDate,
      plannedOrder: `PL${String(i).padStart(8, '0')}`,
      productCode: `P${String(i).padStart(3, '0')}`,
      definition: `Product Definition ${i}`,
      group: `Group ${String.fromCharCode(65 + (i % 26))}`,
      size: `${200 + (i % 50)}/${55 + (i % 20)}R${16 + (i % 4)}`,
      season: ['Summer', 'Winter', 'All Season'][i % 3],
      totalQuantity: String(Math.floor(Math.random() * 1000) + 1),
      netValue: (amount * (Math.random() * 0.5 + 0.8)).toFixed(2),
      currency: currency,
      color: ['Black', 'White', 'Gray', 'Red', 'Blue'][i % 5],
    });
  }

  return data;
};

export const overdueReportData: TableDataItem[] = generateOverdueReportData(100);
export const salesReportData: TableDataItem[] = generateRandomData(100);
// Generate Brisa Payments specific data
const generateBrisaPaymentsData = (count: number): TableDataItem[] => {
  const paymentTypes = ['Invoice Payment', 'Credit Note', 'Debit Note', 'Advance Payment', 'Refund'];
  const descriptions = [
    'Tire Supply Payment',
    'Freight Charges',
    'Customs Duties',
    'Insurance Premium',
    'Storage Fees',
    'Handling Charges',
    'Documentation Fees',
    'Quality Inspection',
    'Testing Services',
    'Warranty Claims'
  ];
  const amounts = [1250.50, 890.25, 2100.00, 450.75, 1750.30, 3200.45, 980.60, 1500.20, 2750.80, 650.90];
  const currencies = ['EUR', 'USD', 'GBP', 'TRY'];

  const data: TableDataItem[] = [];

  for (let i = 1; i <= count; i++) {
    const paymentType = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];

    // Generate random dates in 2023
    const startDate = new Date(2023, 0, 1);
    const endDate = new Date(2023, 11, 31);
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const invoiceDate = randomDate.toLocaleDateString('en-GB');

    data.push({
      type: paymentType,
      invoiceDate: invoiceDate,
      description: description,
      amount: amount.toFixed(2),
      curr: currency,
      customer: `CUST${String(i).padStart(3, '0')}`,
      customerName: `Customer ${i}`,
      shipToParty: `93000${String(i).padStart(3, '0')}`,
      shipToPartyName: `Ship-to Party ${i}`,
      customerOrder: `ORD${String(i).padStart(6, '0')}`,
      orderDate: invoiceDate,
      plannedOrder: `PL${String(i).padStart(8, '0')}`,
      invoice: `INV${String(i).padStart(8, '0')}`,
      productCode: `P${String(i).padStart(3, '0')}`,
      definition: `Product Definition ${i}`,
      group: `Group ${String.fromCharCode(65 + (i % 26))}`,
      size: `${200 + (i % 50)}/${55 + (i % 20)}R${16 + (i % 4)}`,
      season: ['Summer', 'Winter', 'All Season'][i % 3],
      totalQuantity: String(Math.floor(Math.random() * 1000) + 1),
      netValue: (amount * (Math.random() * 0.5 + 0.8)).toFixed(2),
      currency: currency,
      incoterm: ['FOB', 'CIF', 'EXW', 'DDP'][i % 4],
      color: ['Black', 'White', 'Gray', 'Red', 'Blue'][i % 5],
    });
  }

  return data;
};

export const brisaPaymentsData: TableDataItem[] = generateBrisaPaymentsData(100);
export const accountTransactionsData: TableDataItem[] = generateRandomData(100);

// API-like functions to simulate backend calls
export const getOverdueReportData = (filters?: {
  startDate?: string;
  endDate?: string;
  customerCode?: string;
  invoiceNumber?: string;
}): TableDataItem[] => {
  let filteredData = [...overdueReportData];

  if (filters) {
    const parseDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };

    filteredData = filteredData.filter(item => {
      // Date range filter
      if (filters.startDate && filters.endDate) {
        const orderDate = parseDate(item.orderDate);
        const startDateParsed = parseDate(filters.startDate);
        const endDateParsed = parseDate(filters.endDate);
        
        if (orderDate < startDateParsed || orderDate > endDateParsed) {
          return false;
        }
      }

      // Customer code filter
      if (filters.customerCode) {
        const searchTerm = filters.customerCode.toLowerCase();
        if (!item.customer.toLowerCase().includes(searchTerm) && 
            !item.customerName.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      // Invoice number filter
      if (filters.invoiceNumber) {
        const searchTerm = filters.invoiceNumber.toLowerCase();
        if (!item.invoice.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }

  return filteredData;
};

export const getSalesReportData = (filters?: {
  startDate?: string;
  endDate?: string;
  productCode?: string;
  customerCode?: string;
}): TableDataItem[] => {
  let filteredData = [...salesReportData];

  if (filters) {
    const parseDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };

    filteredData = filteredData.filter(item => {
      // Date range filter
      if (filters.startDate && filters.endDate) {
        const orderDate = parseDate(item.orderDate);
        const startDateParsed = parseDate(filters.startDate);
        const endDateParsed = parseDate(filters.endDate);
        
        if (orderDate < startDateParsed || orderDate > endDateParsed) {
          return false;
        }
      }

      // Customer code filter
      if (filters.customerCode) {
        const searchTerm = filters.customerCode.toLowerCase();
        if (!item.customer.toLowerCase().includes(searchTerm) && 
            !item.customerName.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      // Product code filter
      if (filters.productCode) {
        const searchTerm = filters.productCode.toLowerCase();
        if (!item.productCode.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }

  return filteredData;
};

export const getBrisaPaymentsData = (filters?: {
  startDate?: string;
  endDate?: string;
  paymentNumber?: string;
  paymentStatus?: string;
}): TableDataItem[] => {
  let filteredData = [...brisaPaymentsData];

  if (filters) {
    const parseDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };

    filteredData = filteredData.filter(item => {
      // Date range filter
      if (filters.startDate && filters.endDate) {
        const orderDate = parseDate(item.orderDate);
        const startDateParsed = parseDate(filters.startDate);
        const endDateParsed = parseDate(filters.endDate);
        
        if (orderDate < startDateParsed || orderDate > endDateParsed) {
          return false;
        }
      }

      // Payment number filter
      if (filters.paymentNumber) {
        const searchTerm = filters.paymentNumber.toLowerCase();
        if (!item.invoice.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      // Payment status filter
      if (filters.paymentStatus) {
        const searchTerm = filters.paymentStatus.toLowerCase();
        if (!item.invoice.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }

  return filteredData;
};

export const getAccountTransactionsData = (filters?: {
  startDate?: string;
  endDate?: string;
  accountCode?: string;
  transactionType?: string;
}): TableDataItem[] => {
  let filteredData = [...accountTransactionsData];

  if (filters) {
    const parseDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };

    filteredData = filteredData.filter(item => {
      // Date range filter
      if (filters.startDate && filters.endDate) {
        const orderDate = parseDate(item.orderDate);
        const startDateParsed = parseDate(filters.startDate);
        const endDateParsed = parseDate(filters.endDate);
        
        if (orderDate < startDateParsed || orderDate > endDateParsed) {
          return false;
        }
      }

      // Account code filter
      if (filters.accountCode) {
        const searchTerm = filters.accountCode.toLowerCase();
        if (!item.customer.toLowerCase().includes(searchTerm) && 
            !item.customerName.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      // Transaction type filter
      if (filters.transactionType) {
        const searchTerm = filters.transactionType.toLowerCase();
        if (!item.invoice.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }

  return filteredData;
};

// Export all data for direct access if needed
export const getAllMockData = {
  overdueReport: overdueReportData,
  salesReport: salesReportData,
  brisaPayments: brisaPaymentsData,
  accountTransactions: accountTransactionsData,
}; 

// Video Library Data
export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  tags: string[];
  type: 'VIDEO' | 'IMAGE';
  date: string;
  description?: string;
}

export const videoLibraryData: VideoItem[] = [
  {
    id: '1',
    title: 'Lassa Tyres Corporate Movie',
    thumbnail: '/b2b/cis-marketing-library/iconImage/VIDEO/lassa-tyres-corporate-movie',
    videoUrl: 'https://player.vimeo.com/video/371086907',
    tags: ['lassa', 'movie 2019'],
    type: 'VIDEO',
    date: 'Jan 06, 2020',
  },
  {
    id: '2',
    title: 'Multiways - New All Season Tyre',
    thumbnail: '/b2b/cis-marketing-library/iconImage/VIDEO/multiways-new-all-season-tyre',
    videoUrl: 'https://player.vimeo.com/video/1116872846',
    tags: ['movie', 'multiways', '2018'],
    type: 'VIDEO',
    date: 'Sep 19, 2018',
  },
  {
    id: '3',
    title: 'Competus AT2 Product Movie',
    thumbnail: '/b2b/cis-marketing-library/iconImage/VIDEO/competus-at2-product-movie',
    videoUrl: 'https://player.vimeo.com/video/228339213',
    tags: ['lassa', 'competus', 'movie'],
    type: 'VIDEO',
    date: 'Aug 04, 2017',
  },
  {
    id: '4',
    title: 'Driveways Sport - Challenge the Road',
    thumbnail: '/b2b/cis-marketing-library/iconImage/VIDEO/driveways-sport---challenge-the-road-',
    videoUrl: 'https://player.vimeo.com/video/371088421',
    tags: ['lassa', 'drivewayssport'],
    type: 'VIDEO',
    date: 'Jan 06, 2020',
  },
  {
    id: '5',
    title: 'Driveways Sport - Curving',
    thumbnail: '/b2b/cis-marketing-library/iconImage/VIDEO/driveways-sport---curving-',
    videoUrl: 'https://player.vimeo.com/video/371088449',
    tags: ['lassa', 'drivewayssport'],
    type: 'VIDEO',
    date: 'Jan 06, 2020',
  },
  {
    id: '6',
    title: 'Driveways Sport - Slalom',
    thumbnail: '/b2b/cis-marketing-library/iconImage/VIDEO/driveways-sport---slalom-',
    videoUrl: 'https://player.vimeo.com/video/371088435',
    tags: ['lassa', 'drivewayssport'],
    type: 'VIDEO',
    date: 'Jan 06, 2020',
  },
  {
    id: '7',
    title: 'Driveways Sport - Dry Braking',
    thumbnail: '/b2b/cis-marketing-library/iconImage/VIDEO/driveways-sport---dry-braking',
    videoUrl: 'https://player.vimeo.com/video/371088429',
    tags: ['lassa', 'drivewayssport'],
    type: 'VIDEO',
    date: 'Jan 06, 2020',
  },
  {
    id: '8',
    title: 'Driveways Sport - Wet Braking',
    thumbnail: '/b2b/cis-marketing-library/iconImage/VIDEO/driveways-sport---wet-braking-',
    videoUrl: 'https://player.vimeo.com/video/371088409',
    tags: ['lassa', 'drivewayssport'],
    type: 'VIDEO',
    date: 'Jan 06, 2020',
  },
  {
    id: '9',
    title: 'Driveways - Enjoy The Drive',
    thumbnail: '/b2b/cis-marketing-library/iconImage/VIDEO/driveways---enjoy-the-drive',
    videoUrl: 'https://player.vimeo.com/video/371088361',
    tags: ['lassa', 'driveways'],
    type: 'VIDEO',
    date: 'Jan 06, 2020',
  },
  {
    id: '10',
    title: 'Driveways - Excellent Handling',
    thumbnail: '/b2b/cis-marketing-library/iconImage/VIDEO/driveways---excellent-handling',
    videoUrl: 'https://player.vimeo.com/video/371088371',
    tags: ['lassa', 'driveways'],
    type: 'VIDEO',
    date: 'Jan 06, 2020',
  },
  {
    id: '11',
    title: 'Competus H/P2 - Superior Wet Braking',
    thumbnail: '/b2b/cis-marketing-library/iconImage/VIDEO/competus-hp2-superior-wet-braking',
    videoUrl: 'https://player.vimeo.com/video/448611578',
    tags: ['lassa', 'competus'],
    type: 'VIDEO',
    date: 'Aug 17, 2020',
  },
  {
    id: '12',
    title: 'Snoways 4 - New Winter Tyre',
    thumbnail: '/b2b/cis-marketing-library/iconImage/VIDEO/snoways-4---new-winter-tyre-',
    videoUrl: 'https://player.vimeo.com/video/449277830',
    tags: ['lassa', 'snoways'],
    type: 'VIDEO',
    date: 'Jan 06, 2020',
  },
];

export const getVideoLibraryData = (filters?: {
  type?: 'VIDEO' | 'IMAGE';
  tags?: string[];
  search?: string;
}): VideoItem[] => {
  let filteredData = [...videoLibraryData];

  if (filters?.type) {
    filteredData = filteredData.filter(video => video.type === filters.type);
  }

  if (filters?.tags && filters.tags.length > 0) {
    filteredData = filteredData.filter(video => 
      filters.tags!.some(tag => video.tags.includes(tag))
    );
  }

  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredData = filteredData.filter(video => 
      video.title.toLowerCase().includes(searchTerm) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  return filteredData;
};

export const getAllTags = (): string[] => {
  const allTags = new Set<string>();
  videoLibraryData.forEach(video => {
    video.tags.forEach(tag => allTags.add(tag));
  });
  return Array.from(allTags).sort();
}; 