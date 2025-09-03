import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import ColumnVisibilityModal from '../components/ColumnVisibilityModal';
import RowDetailModal from '../components/RowDetailModal';
import ShowDropdown from '../components/ShowDropdown';
import Pagination from '../components/Pagination';
import DatePicker from '../components/DatePicker';
import ExcelExport from '../components/ExcelExport';
import EmailSender from '../components/EmailSender';
import { getBrisaPaymentsData, TableDataItem } from '../utils/mockData';
import { downloadBundledPdf } from '../utils/pdfAssets';
import CustomerSelectModal, { CustomerItem } from '../components/CustomerSelectModal';

const BrisaPaymentsScreen = ({ route, navigation }: any) => {
  const { reportData } = route.params || {};
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  
  // Form state variables
  const [startDate, setStartDate] = useState('01/01/2023');
  const [endDate, setEndDate] = useState('31/12/2023');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [customerCode, setCustomerCode] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  
  // Column visibility state for Brisa Payments
  const [columns, setColumns] = useState([
    { key: 'type', label: 'Type', visible: true },
    { key: 'invoiceDate', label: 'Invoice Date', visible: true },
    { key: 'description', label: 'Description', visible: true },
    { key: 'amount', label: 'Amount', visible: true },
    { key: 'curr', label: 'Curr.', visible: true },
    { key: 'customer', label: 'Customer', visible: true },
    { key: 'customerName', label: 'Customer Name', visible: true },
    { key: 'shipToParty', label: 'Ship-to Party', visible: false },
    { key: 'shipToPartyName', label: 'Ship-To Party Name', visible: false },
    { key: 'customerOrder', label: 'Customer Order', visible: false },
    { key: 'orderDate', label: 'Order Date', visible: false },
    { key: 'plannedOrder', label: 'Planned Order', visible: false },
    { key: 'invoice', label: 'Invoice', visible: false },
    { key: 'productCode', label: 'Product Code', visible: false },
    { key: 'definition', label: 'Definition', visible: false },
    { key: 'group', label: 'Group', visible: false },
    { key: 'size', label: 'Size', visible: false },
    { key: 'season', label: 'Season', visible: false },
    { key: 'totalQuantity', label: 'Total Quantity', visible: false },
    { key: 'netValue', label: 'Net Value', visible: false },
    { key: 'currency', label: 'Currency', visible: false },
    { key: 'incoterm', label: 'Incoterm', visible: false },
    { key: 'color', label: 'Color', visible: false },
  ]);
  
  // Modal states
  const [isColumnVisibilityModalOpen, setIsColumnVisibilityModalOpen] = useState(false);
  const [isRowDetailModalOpen, setIsRowDetailModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [showValue, setShowValue] = useState(100);
  
  // Data state
  const [tableData, setTableData] = useState<TableDataItem[]>([]);
  const [filteredTableData, setFilteredTableData] = useState<TableDataItem[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Load initial data
  useEffect(() => {
    const loadData = () => {
          const data = getBrisaPaymentsData({
      startDate,
      endDate,
      paymentNumber,
      paymentStatus,
    });
    setTableData(data);
    setFilteredTableData(data);
    };
    
    loadData();
  }, []);

  // Date parsing helper function
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Filter data based on date range and other filters
  const updateFilteredData = () => {
    const data = getBrisaPaymentsData({
      startDate,
      endDate,
      paymentNumber,
      paymentStatus,
    });
    setFilteredTableData(data);
  };

  // Handle list button press
  const handleList = () => {
    updateFilteredData();
  };

  // Handle column visibility toggle
  const handleColumnToggle = (key: string) => {
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  // Handle row click for detail popup
  const handleRowClick = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsRowDetailModalOpen(true);
  };

  const handleInvoiceDownload = async () => {
    try {
      await downloadBundledPdf(require('../../INVOICE 2.pdf'), 'INVOICE_2.pdf');
    } catch (e) {
      console.error('Failed to download invoice PDF', e);
    }
  };

  const handlePlannedOrderDraftDownload = async (plannedOrderValue: string) => {
    const val = String(plannedOrderValue || '');
    const digits = val.replace(/\D+/g, '');
    if (!(digits.startsWith('35') || digits.endsWith('35') || digits.endsWith('53'))) return;
    try {
      await downloadBundledPdf(require('../../INVOICE DRAFT.pdf'), `INVOICE_DRAFT_${val}.pdf`);
    } catch (e) {
      console.error('Failed to download draft PDF', e);
    }
  };

  const isPlannedOrderEligible = (plannedOrderValue: string): boolean => {
    const val = String(plannedOrderValue || '');
    const digits = val.replace(/\D+/g, '');
    return !!(digits.startsWith('35') || digits.endsWith('35') || digits.endsWith('53'));
  };

  // Handle column header click for sorting
  const handleColumnSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, set to ascending
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Sort filtered table data
  const sortedTableData = [...filteredTableData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    // Handle numeric values
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // Handle string values
    const aStr = String(aValue || '');
    const bStr = String(bValue || '');
    
    if (sortDirection === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  // Pagination calculations
  const totalItems = sortedTableData.length;
  const effectiveItemsPerPage = itemsPerPage === -1 ? totalItems : itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectiveItemsPerPage));
  const startIndex = (currentPage - 1) * effectiveItemsPerPage;
  const endIndex = itemsPerPage === -1 ? totalItems : startIndex + effectiveItemsPerPage;
  const paginatedData = sortedTableData.slice(startIndex, endIndex);

  // Column visibility logic
  const visibleColumns = useMemo(
    () => columns.filter(c => c.visible),
    [columns]
  );
  
  // Sticky column logic
  const stickyColumn = visibleColumns[0]; // First column is sticky
  const scrollableColumns = visibleColumns.slice(1); // Rest are scrollable
  const isScrollable = scrollableColumns.length >= 4; // 4 or more scrollable columns (total 5+) - scrollable when 5 or more total columns
  
  // Scroll sync refs
  const headerScrollRef = useRef<any>(null);
  const bodyScrollRef = useRef<any>(null);
  
  // Sync header scroll with body scroll
  const syncHeaderFromBody = (event: any) => {
    const x = event?.nativeEvent?.contentOffset?.x || 0;
    headerScrollRef.current?.scrollTo({ x, animated: false });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleNavigateToReport = (reportData: any) => {
    setIsReportsModalOpen(false);
    
    // Navigate based on report ID using React Navigation
    switch (reportData.id) {
      case 'financial-reports':
        navigation.navigate('FinancialReports', { reportData });
        break;
      case 'brisa-payments':
        navigation.navigate('BrisaPayments', { reportData });
        break;
      case 'overdue-report':
        navigation.navigate('OverdueReport', { reportData });
        break;
      case 'account-transactions':
        navigation.navigate('AccountTransactions', { reportData });
        break;
      case 'shipments-documents':
        navigation.navigate('ShipmentsDocuments', { reportData });
        break;
      case 'sales-report':
        navigation.navigate('SalesReport', { reportData });
        break;
      case 'order-monitoring':
        navigation.navigate('OrderMonitoring', { reportData });
        break;
      case 'tyres-on-the-way':
        navigation.navigate('TyresOnTheWay', { reportData });
        break;
      case 'pos-material-tracking':
        navigation.navigate('POSMaterialTracking', { reportData });
        break;
      default:
        // Unknown report type
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.titleContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{
            padding: 8,
            marginRight: 10,
            marginTop: -10,
      }}
        >
          <Text style={{fontSize: 28, color: '#333', marginRight: -10}}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Brisa Payments</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          
          {/* Filter Form */}
          <View style={styles.formContainer}>
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Start Date:</Text>
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="DD/MM/YYYY"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>End Date:</Text>
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="DD/MM/YYYY"
                />
              </View>
            </View>
            
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Payment Number:</Text>
                <TextInput
                  style={styles.textInput}
                  value={paymentNumber}
                  onChangeText={setPaymentNumber}
                  placeholder="Enter payment number"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Payment Status:</Text>
                <TextInput
                  style={styles.textInput}
                  value={paymentStatus}
                  onChangeText={setPaymentStatus}
                  placeholder="Enter status"
                />
              </View>
            </View>

            {/* Select Customer Row - full width */}
            <View style={styles.formRow}>
              <View style={styles.formGroupFull}>
                <Text style={styles.formLabel}>Select Customer</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    style={[styles.textInput, { flex: 1 }]}
                    value={selectedCustomer ? `${selectedCustomer.code} - ${selectedCustomer.name}` : customerCode}
                    placeholder="Type or select a customer"
                    onChangeText={(txt) => { setSelectedCustomer(null); setCustomerCode(txt); }}
                  />
                  <TouchableOpacity style={{ height: 40, paddingHorizontal: 14, backgroundColor: '#F39C12', marginLeft: 8, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }} onPress={() => setIsCustomerModalOpen(true)}>
                    <AntDesign name="search1" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <View style={styles.formRow}>
              <TouchableOpacity style={styles.listButton} onPress={handleList}>
                <AntDesign name="bars" size={18} color="#FFFFFF" style={{marginRight: 8}} />
                <Text style={styles.listButtonText}>List</Text>
              </TouchableOpacity>
            </View>
            
            {/* Export Buttons Row */}
            <View style={[styles.formRow, styles.exportButtonsRow]}>
              <ExcelExport 
                data={filteredTableData}
                visibleColumns={columns}
                fileName={`BrisaPayments_${new Date().toISOString().split('T')[0]}`}

                buttonStyle={styles.exportButton}
                buttonIcon={<FontAwesome name="file-excel-o" size={18} color="#FFFFFF" style={{marginRight: 8}} />}
              />
              
              <TouchableOpacity 
                style={styles.emailButton} 
                onPress={() => setIsEmailModalOpen(true)}
              >
                <MaterialIcons name="email" size={18} color="#FFFFFF" style={{marginRight: 8}} />
                <Text style={styles.emailButtonText}>Send via Email</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Column Visibility Header - Full Width (primary highlight) */}
          <TouchableOpacity 
            style={styles.columnVisibilityHeaderPrimary}
            onPress={() => setIsColumnVisibilityModalOpen(true)}
          >
            <Text style={styles.columnVisibilityHeaderPrimaryText}>Column Visibility</Text>
          </TouchableOpacity>
          
          {/* Show Dropdown */}
          <View style={styles.showDropdownContainer}>
            <ShowDropdown 
              value={itemsPerPage}
              onValueChange={handleItemsPerPageChange}
            />
          </View>
          
          {/* Table Section */}
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeaderRow}>
              <View style={styles.leadIconHeader} />
              <View style={styles.tableHeaderSticky}>
                <Text style={styles.tableHeaderCellText}>{stickyColumn?.label}</Text>
              </View>
              <ScrollView 
                ref={headerScrollRef}
                horizontal 
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                style={styles.headerScrollable}
              >
                <View style={styles.headerScrollableRow}>
                  {scrollableColumns.map((col) => (
                    <TouchableOpacity
                      key={col.key}
                      style={styles.scrollableHeaderCell}
                      onPress={() => handleColumnSort(col.key)}
                    >
                      <Text style={styles.tableHeaderCellText}>{col.label}</Text>
                      {sortColumn === col.key && (
                        <Text style={styles.sortIcon}>
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
            
            {/* Table Body */}
            <View style={styles.tableBody}>
              {/* Lead icon column */}
              <View>
                {paginatedData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.leadIcon, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
                    onPress={() => handleRowClick(item)}
                  >
                    <Ionicons name="search" size={18} color="#D53439" />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.stickyColumn}>
                {paginatedData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.stickyCell, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
                    onPress={() => handleRowClick(item)}
                  >
                    <Text style={styles.stickyCellText} numberOfLines={1} ellipsizeMode="tail">
                      {String((item as Record<string, any>)[stickyColumn?.key] ?? '')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <ScrollView 
                ref={bodyScrollRef}
                horizontal 
                showsHorizontalScrollIndicator={isScrollable} 
                scrollEnabled={isScrollable}
                onScroll={syncHeaderFromBody}
                scrollEventThrottle={16}
                style={styles.bodyScrollable}
              >
                <View>
                  {paginatedData.map((item, index) => (
                    <View
                      key={index}
                      style={[styles.scrollableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
                    >
                      {scrollableColumns.map((col) => (
                        <TouchableOpacity 
                          key={col.key} 
                          style={styles.scrollableCell}
                          onPress={() => handleRowClick(item)}
                        >
                          {col.key === 'invoice' ? (
                            <TouchableOpacity onPress={handleInvoiceDownload}>
                              <Text style={[styles.tableCell, styles.linkText]} numberOfLines={1} ellipsizeMode="tail">
                                {String((item as Record<string, any>)[col.key] ?? '')}
                              </Text>
                            </TouchableOpacity>
                          ) : col.key === 'plannedOrder' ? (
                            isPlannedOrderEligible((item as Record<string, any>)[col.key]) ? (
                              <TouchableOpacity onPress={() => handlePlannedOrderDraftDownload((item as Record<string, any>)[col.key])}>
                                <Text style={[styles.tableCell, styles.linkText]} numberOfLines={1} ellipsizeMode="tail">
                                  {String((item as Record<string, any>)[col.key] ?? '')}
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <Text style={styles.tableCell} numberOfLines={1} ellipsizeMode="tail">
                                {String((item as Record<string, any>)[col.key] ?? '')}
                              </Text>
                            )
                          ) : (
                            <Text style={styles.tableCell} numberOfLines={1} ellipsizeMode="tail">
                              {String((item as Record<string, any>)[col.key] ?? '')}
                            </Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </View>
        <Footer />
      </ScrollView>
      <BottomNavigation 
        isReportsModalOpen={isReportsModalOpen} 
        setIsReportsModalOpen={setIsReportsModalOpen}
        onNavigateToReport={handleNavigateToReport}
      />
      
      {/* Column Visibility Modal */}
      <ColumnVisibilityModal
        visible={isColumnVisibilityModalOpen}
        onClose={() => setIsColumnVisibilityModalOpen(false)}
        columns={columns}
        onColumnToggle={handleColumnToggle}
        maxVisibleColumns={null}
      />
      
      {/* Row Detail Modal */}
      <RowDetailModal
        visible={isRowDetailModalOpen}
        onClose={() => setIsRowDetailModalOpen(false)}
        rowData={selectedRowData}
        columns={columns}
      />
      
      {/* Email Sender Modal */}
      <EmailSender
        visible={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        data={filteredTableData}
        visibleColumns={columns}
        reportName="BrisaPayments"
      />
      <CustomerSelectModal
        visible={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSelect={(c) => { setSelectedCustomer(c); setCustomerCode(c.code); }}
      />
    </SafeAreaView>
  );
};

const ROW_HEIGHT = 52;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  exportButtonsRow: {
    marginTop: 15,
    justifyContent: 'space-between',
  },
  exportButton: {
    width: '48%',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  emailButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    flexDirection: 'row',
  },
  emailButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'left',
    fontFamily: 'MuseoSans-Medium',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
    width:"100%",
  },
  formGroup: {
    width: '48%',
    marginBottom: 10,
  },
  formGroupFull: {
    width: '100%',
    marginBottom: 10,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    fontFamily: 'MuseoSans-Bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#FFF',
    fontFamily: 'MuseoSans-Regular',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  listButton: {
    backgroundColor: '#8D8D8D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  listButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
  },
  columnVisibilityHeader: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  columnVisibilityHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'MuseoSans-Bold',
  },
  columnVisibilityHeaderPrimary: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: -5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DA3C42',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
    elevation: 3,
  },
  columnVisibilityHeaderPrimaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DA3C42',
    fontFamily: 'MuseoSans-Bold',
  },
  showDropdownContainer: {
    marginBottom: 10,
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  tableBodyScroll: {
    maxHeight: 400,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#8D8D8D',
  },
  leadIconHeader: {
    width: 34,
    height: ROW_HEIGHT,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#555',
  },
  tableHeaderSticky: {
    width: 120,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#8D8D8D',
    borderRightWidth: 1,
    borderRightColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerScrollable: {
    flex: 1,
  },
  headerScrollableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  scrollableHeaderCell: {
    width: 90,
    paddingHorizontal: 8,
    minWidth: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHeaderCellText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'MuseoSans-Bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#8D8D8D',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  tableHeaderCellContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'MuseoSans-Bold',
  },
  sortIcon: {
    fontSize: 12,
    color: '#007AFF',
    marginLeft: 5,
  },
  tableBody: {
    flexDirection: 'row',
  },
  leadIcon: {
    width: 34,
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    borderRightWidth: 1,
    borderRightColor: '#E9ECEF',
  },
  stickyColumn: {
    width: 120,
  },
  stickyCell: {
    height: ROW_HEIGHT,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    borderRightWidth: 1,
    borderRightColor: '#E9ECEF',
  },
  bodyScrollable: {
    flex: 1,
  },
  scrollableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ROW_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  scrollableCell: {
    width: 90,
    paddingHorizontal: 8,
    minWidth: 90,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  tableRowEven: {
    backgroundColor: '#FFFFFF',
  },
  tableRowOdd: {
    backgroundColor: '#F8F9FA',
  },
  clickableRow: {
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  tableCell: {
    flex: 1,
    padding: 12,
    fontSize: 12,
    color: '#495057',
    textAlign: 'center',
    fontFamily: 'MuseoSans-Regular',
  },
  linkText: {
    color: '#1976D2',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  stickyCellText: {
    fontSize: 12,
    color: '#495057',
    textAlign: 'center',
    fontFamily: 'MuseoSans-Regular',
  },
  noDataContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#DA3C42',
    borderStyle: 'dashed',
    margin: 20,
    borderRadius: 8,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DA3C42',
    fontFamily: 'MuseoSans-Bold',
  },
});

export default BrisaPaymentsScreen;