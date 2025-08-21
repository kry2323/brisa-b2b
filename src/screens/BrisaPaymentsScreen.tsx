import React, { useState, useEffect } from 'react';
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

const BrisaPaymentsScreen = ({ route, navigation }: any) => {
  const { reportData } = route.params || {};
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  
  // Form state variables
  const [startDate, setStartDate] = useState('01/01/2023');
  const [endDate, setEndDate] = useState('31/12/2023');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  
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
    console.log('Filtering with:', { startDate, endDate, paymentNumber, paymentStatus });
    updateFilteredData();
    console.log('Filtered results:', filteredTableData.length, 'items');
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
        console.log('Unknown report type');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.titleContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{
            padding: 10,
            marginRight: 10
          }}
        >
          <Text style={{fontSize: 24, color: '#333'}}>←</Text>
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
                buttonText="Excel İndir"
                buttonStyle={styles.exportButton}
                buttonIcon={<FontAwesome name="file-excel-o" size={18} color="#FFFFFF" style={{marginRight: 8}} />}
              />
              
              <TouchableOpacity 
                style={styles.emailButton} 
                onPress={() => setIsEmailModalOpen(true)}
              >
                <MaterialIcons name="email" size={18} color="#FFFFFF" style={{marginRight: 8}} />
                <Text style={styles.emailButtonText}>Mail Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Column Visibility Header - Full Width */}
          <TouchableOpacity 
            style={styles.columnVisibilityHeader}
            onPress={() => setIsColumnVisibilityModalOpen(true)}
          >
            <Text style={styles.columnVisibilityHeaderText}>Column Visibility</Text>
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
                  style={styles.tableHeaderCellContainer}
                  onPress={() => handleColumnSort(column.key)}
                >
                  <Text style={styles.tableHeaderCell}>
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
                  <TouchableOpacity
                    key={item.customerOrder || index}
                    style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd, styles.clickableRow]}
                    onPress={() => handleRowClick(item)}
                  >
                    <View style={styles.leadIcon}>
                      <Ionicons name="search" size={18} color="#D53439" />
                    </View>
                    {columns.filter(col => col.visible).map((column) => (
                      <Text key={column.key} style={styles.tableCell}>
                        {item[column.key]}
                      </Text>
                    ))}
                  </TouchableOpacity>
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
        onNavigateToReport={handleNavigateToReport}
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
        reportName="BrisaPayments"
      />
    </SafeAreaView>
  );
};

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
    width:"100%",
  },
  formGroup: {
    width: '48%',
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
    paddingHorizontal: 20,
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