import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { useReportNavigation } from '../utils/navigationUtils';
import ColumnVisibilityModal from '../components/ColumnVisibilityModal';
import RowDetailModal from '../components/RowDetailModal';
import ShowDropdown from '../components/ShowDropdown';
import Pagination from '../components/Pagination';
import DatePicker from '../components/DatePicker';
import ExcelExport from '../components/ExcelExport';
import EmailSender from '../components/EmailSender';
import { getAccountTransactionsData, TableDataItem } from '../utils/mockData';
import { downloadBundledPdf } from '../utils/pdfAssets';
import CustomerSelectModal, { CustomerItem } from '../components/CustomerSelectModal';

const AccountTransactionsScreen = ({ route, navigation }: any) => {
  const { reportData } = route.params || {};
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Use centralized report navigation
  const handleNavigateToReport = useReportNavigation(navigation);
// Form state variables
  const [startDate, setStartDate] = useState('01/01/2023');
  const [endDate, setEndDate] = useState('31/12/2023');
  const [accountCode, setAccountCode] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  
  // Column visibility state
  const [columns, setColumns] = useState([
    { key: 'customer', label: 'Customer', visible: false },
    { key: 'customerName', label: 'Customer Name', visible: false },
    { key: 'shipToParty', label: 'Ship-to Party', visible: true },
    { key: 'shipToPartyName', label: 'Ship-To Party Name', visible: true },
    { key: 'customerOrder', label: 'Customer Order', visible: true },
    { key: 'orderDate', label: 'Order Date', visible: true },
    { key: 'plannedOrder', label: 'Planned Order', visible: false },
    { key: 'invoice', label: 'Invoice', visible: false },
    { key: 'invoiceDate', label: 'Invoice Date', visible: false },
    { key: 'productCode', label: 'Product Code', visible: false },
    { key: 'definition', label: 'Definition', visible: false },
    { key: 'group', label: 'Group', visible: false },
    { key: 'size', label: 'Size', visible: false },
    { key: 'season', label: 'Season', visible: false },
    { key: 'totalQuantity', label: 'Total Quantity', visible: false },
    { key: 'netValue', label: 'Net Value', visible: false },
    { key: 'currency', label: 'Currency', visible: false },
    { key: 'incoterm', label: 'Incoterm', visible: false },
    { key: 'color', label: 'color', visible: false },
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
      const data = getAccountTransactionsData({
        startDate,
        endDate,
        accountCode,
        transactionType,
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
    const data = getAccountTransactionsData({
      startDate,
      endDate,
      accountCode,
      transactionType,
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
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedTableData.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Account Transactions</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          
          {/* Filter Form */}
          <View style={styles.formContainer}>
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Start Date *</Text>
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="DD/MM/YYYY"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>End Date *</Text>
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="DD/MM/YYYY"
                />
              </View>
            </View>
            
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Account Code</Text>
                <TextInput
                  style={styles.textInput}
                  value={accountCode}
                  onChangeText={setAccountCode}
                  placeholder="Enter account code"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Transaction Type</Text>
                <TextInput
                  style={styles.textInput}
                  value={transactionType}
                  onChangeText={setTransactionType}
                  placeholder="Enter transaction type"
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
                    value={selectedCustomer ? `${selectedCustomer.code} - ${selectedCustomer.name}` : ''}
                    placeholder="Type or select a customer"
                    onChangeText={() => { setSelectedCustomer(null); }}
                  />
                  <TouchableOpacity style={{ height: 40, paddingHorizontal: 14, backgroundColor: '#F39C12', marginLeft: 8, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }} onPress={() => setIsCustomerModalOpen(true)}>
                    <Ionicons name="search" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <View style={[styles.formRow, { justifyContent: 'center', marginTop: 10 }]}>
              <TouchableOpacity style={styles.listButton} onPress={handleList}>
                <Text style={styles.listButtonText}>List</Text>
              </TouchableOpacity>
            </View>
            
            {/* Export Buttons Row */}
            <View style={[styles.formRow, styles.exportButtonsRow]}>
              <ExcelExport 
                data={filteredTableData}
                visibleColumns={columns}
                fileName={`AccountTransactions_${new Date().toISOString().split('T')[0]}`}

                buttonStyle={styles.exportButton}
              />
              
              <TouchableOpacity 
                style={styles.emailButton} 
                onPress={() => setIsEmailModalOpen(true)}
              >
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
          
          {/* Table */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <View style={styles.leadIconHeader} />
              {columns.filter(col => col.visible).map((column) => (
                <TouchableOpacity
                  key={column.key}
                  style={[styles.tableHeaderCellContainer, { flex: 1 }]}
                  onPress={() => handleColumnSort(column.key)}
                >
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>
                    {column.label}
                  </Text>
                  {sortColumn === column.key && (
                    <Text style={styles.sortIcon}>
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Scrollable Table Body */}
            <ScrollView 
              style={styles.tableBodyScroll} 
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              scrollEventThrottle={16}
            >
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <View
                    key={item.customerOrder || index}
                    style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd, styles.clickableRow]}
                  >
                    <TouchableOpacity style={styles.leadIcon} onPress={() => handleRowClick(item)}>
                      <Ionicons name="search" size={18} color="#D53439" />
                    </TouchableOpacity>
                    {columns.filter(col => col.visible).map((column) => (
                      column.key === 'invoice' ? (
                        <TouchableOpacity key={column.key} style={{ flex: 1 }} onPress={handleInvoiceDownload}>
                          <Text style={[styles.tableCell, styles.linkText]}>{item[column.key]}</Text>
                        </TouchableOpacity>
                      ) : column.key === 'plannedOrder' ? (
                        isPlannedOrderEligible(item[column.key]) ? (
                          <TouchableOpacity key={column.key} style={{ flex: 1 }} onPress={() => handlePlannedOrderDraftDownload(item[column.key])}>
                            <Text style={[styles.tableCell, styles.linkText]}>{item[column.key]}</Text>
                          </TouchableOpacity>
                        ) : (
                          <Text key={column.key} style={[styles.tableCell, { flex: 1 }]}>
                            {item[column.key]}
                          </Text>
                        )
                      ) : (
                        <Text key={column.key} style={[styles.tableCell, { flex: 1 }]}>
                          {item[column.key]}
                        </Text>
                      )
                    ))}
                  </View>
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No Data</Text>
                </View>
              )}
            </ScrollView>
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
        onNavigateToReport={(reportData) => handleNavigateToReport(reportData, setIsReportsModalOpen)}
      />
      
      {/* Column Visibility Modal */}
      <ColumnVisibilityModal
        visible={isColumnVisibilityModalOpen}
        onClose={() => setIsColumnVisibilityModalOpen(false)}
        columns={columns}
        onColumnToggle={handleColumnToggle}
        showValue={showValue}
        onShowValueChange={setShowValue}
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
        reportName="AccountTransactions"
      />
      <CustomerSelectModal
        visible={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSelect={(c) => { setSelectedCustomer(c); setAccountCode(c.code); }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    flexDirection: 'row',
    alignItems: 'center',
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
    width: '100%',
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
    padding: 10,
    fontSize: 16,
    backgroundColor: '#FFF',
    fontFamily: 'MuseoSans-Regular',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
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
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#8D8D8D',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  leadIconHeader: {
    width: 34,
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
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  leadIcon: {
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
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

export default AccountTransactionsScreen;