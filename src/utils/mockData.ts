// Mock Data Generator for Report Screens
// This file serves as a static backend for the application

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
  const customers = [
    { code: 'CUST001', name: 'ABC Company Ltd.' },
    { code: 'CUST002', name: 'XYZ Corporation' },
    { code: 'CUST003', name: 'DEF Industries' },
    { code: 'CUST004', name: 'GHI Motors' },
    { code: 'CUST005', name: 'JKL Transport' },
    { code: 'CUST006', name: 'MNO Racing' },
    { code: 'CUST007', name: 'PQR Fleet' },
    { code: 'CUST008', name: 'STU Construction' },
    { code: 'CUST009', name: 'VWX Aviation' },
    { code: 'CUST010', name: 'YZA Marine' },
    { code: 'CUST011', name: 'BCD Electronics' },
    { code: 'CUST012', name: 'EFG Pharmaceuticals' },
    { code: 'CUST013', name: 'HIJ Automotive' },
    { code: 'CUST014', name: 'KLM Aerospace' },
    { code: 'CUST015', name: 'NOP Energy' },
  ];

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

// Generate 100 items for each report type
export const overdueReportData: TableDataItem[] = generateRandomData(100);
export const salesReportData: TableDataItem[] = generateRandomData(100);
export const brisaPaymentsData: TableDataItem[] = generateRandomData(100);
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