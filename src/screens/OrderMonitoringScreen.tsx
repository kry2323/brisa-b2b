import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import ColumnVisibilityModal from '../components/ColumnVisibilityModal';
import DatePicker from '../components/DatePicker';
import ShowDropdown from '../components/ShowDropdown';
import ExcelExport from '../components/ExcelExport';
import Pagination from '../components/Pagination';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';

const OrderMonitoringScreen = ({ route, navigation }: any) => {
  const { reportData } = route.params || {};
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  
  // Form state
  const [startDate, setStartDate] = useState('30/12/2018');
  const [endDate, setEndDate] = useState('28/07/2025');
  const [orderNumber, setOrderNumber] = useState('');
  const [status, setStatus] = useState('');
  
  // Columns state (dynamic, unlimited visibility)
  const [columns, setColumns] = useState([
    { key: 'orderNo', label: 'Order No', visible: true }, // sticky
    { key: 'shipToParty', label: 'Ship-to Party', visible: true },
    { key: 'orderQty', label: 'Order Qty', visible: true },
    { key: 'invoicedQty', label: 'Invoiced Qty', visible: true },
    { key: 'notInvoicedQty', label: 'Not Invoiced Qty', visible: true },
    { key: 'orderDate', label: 'Order Date', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'amount', label: 'Amount', visible: true },
    { key: 'currency', label: 'Currency', visible: true },
    { key: 'incoterm', label: 'Incoterm', visible: true },
  ]);

  // Rich mock data
  type RowType = {
    orderNo: string;
    shipToParty: string;
    orderQty: number;
    invoicedQty: number;
    notInvoicedQty: number;
    orderDate: string;
    status: string;
    amount: string;
    currency: string;
    incoterm: string;
  };

  const [tableData, setTableData] = useState<RowType[]>(
    Array.from({ length: 30 }).map((_, i): RowType => ({
      orderNo: `20000${61873 + i}`,
      shipToParty: 'SC RADBURG SOFT SRL',
      orderQty: Math.floor(Math.random() * 50) + 1,
      invoicedQty: Math.floor(Math.random() * 50),
      notInvoicedQty: Math.floor(Math.random() * 15),
      orderDate: '21/09/2023',
      status: i % 3 === 0 ? 'Processing' : i % 3 === 1 ? 'Shipped' : 'Pending',
      amount: `€${(Math.random() * 10000).toFixed(0)}`,
      currency: 'EUR',
      incoterm: 'CIF',
    }))
  );

  // Refs to synchronize horizontal scroll between header and body
  const headerScrollRef = useRef<any>(null);
  const bodyScrollRef = useRef<any>(null);

  const syncHeaderFromBody = (event: any) => {
    const x = event?.nativeEvent?.contentOffset?.x || 0;
    headerScrollRef.current?.scrollTo({ x, animated: false });
  };

  // Column visibility handlers
  const [isColumnVisibilityModalOpen, setIsColumnVisibilityModalOpen] = useState(false);
  const handleColumnToggle = (key: string) => {
    setColumns((prev) => prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)));
  };

  const visibleNonStickyColumns = useMemo(
    () => columns.filter((c, idx) => idx !== 0 && c.visible),
    [columns]
  );

  // Pagination state (default 100 Show)
  const [itemsPerPage, setItemsPerPage] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalItems = tableData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = tableData.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Print current visible table as PDF and share
  const handlePrint = async () => {
    const visibleCols = columns.filter(c => c.visible);
    const rowsHtml = paginatedData.map(row => {
      const tds = visibleCols.map(c => `<td style=\"border:1px solid #ddd;padding:6px;font-size:12px;\">${String((row as Record<string, any>)[c.key] ?? '')}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }).join('');
    const headerHtml = visibleCols.map(c => `<th style=\"border:1px solid #ddd;padding:8px;background:#666;color:#fff;font-weight:600;font-size:12px;\">${c.label}</th>`).join('');
    const html = `<!DOCTYPE html><html><head><meta charset=\"utf-8\" /></head><body>
      <h1 style=\"font-family:Arial; font-size:16px;\">Order Monitoring</h1>
      <table style=\"width:100%;border-collapse:collapse;font-family:Arial;\">
        <thead><tr>${headerHtml}</tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </body></html>`;
    try {
      if (Platform.OS === 'web') {
        await Print.printAsync({ html });
      } else {
        const { uri } = await Print.printToFileAsync({ html });
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(uri);
        } else {
          await Print.printAsync({ html });
        }
      }
    } catch (e) {
      console.error('Print error', e);
    }
  };

  const handleList = () => {
    // In a real app, this would fetch data based on the form inputs
    console.log('Listing with filters:', { startDate, endDate, orderNumber, status });
    // For now we'll just use the mock data already set
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
        <Text style={styles.title}>Order Monitoring</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          
          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Date Range Row - match Sales Report layout */}
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Start Date</Text>
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="DD/MM/YYYY"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>End Date</Text>
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="DD/MM/YYYY"
                />
              </View>
            </View>
            
            {/* Order Number and Status Row */}
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Order Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={orderNumber}
                  onChangeText={setOrderNumber}
                  placeholder="Enter order number"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Status</Text>
                <TextInput
                  style={styles.textInput}
                  value={status}
                  onChangeText={setStatus}
                  placeholder="Enter status"
                />
              </View>
            </View>
            
            {/* List Button Row */}
            <View style={styles.formRow}>
              <TouchableOpacity style={styles.listButton} onPress={handleList}>
                <AntDesign name="bars" size={18} color="#FFFFFF" style={{marginRight: 8}} />
                <Text style={styles.listButtonText}>List</Text>
              </TouchableOpacity>
            </View>

            {/* Export Buttons Row (inside same container) */}
            <View style={[styles.formRow, styles.exportButtonsRow]}>
              <ExcelExport
                data={paginatedData}
                visibleColumns={columns}
                fileName={`OrderMonitoring_${new Date().toISOString().split('T')[0]}`}
                buttonText="Excel İndir"
                buttonStyle={styles.exportButton}
                buttonIcon={<FontAwesome name="file-excel-o" size={18} color="#FFFFFF" style={{marginRight: 8}} />}
              />
              <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
                <Text style={styles.emailButtonText}>Print</Text>
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
            <ShowDropdown value={itemsPerPage} onValueChange={handleItemsPerPageChange} />
          </View>

          {/* Table Section */}
          <View style={styles.tableContainer}>
            {/* Header Row with sticky left column and a synced horizontal scroller */}
            <View style={styles.tableHeaderRow}>
              <View style={[styles.tableHeaderSticky, styles.stickyColWidth]}>
                <Text style={styles.tableHeaderCell}>{columns[0].label}</Text>
              </View>
              <ScrollView
                ref={headerScrollRef}
                horizontal
                showsHorizontalScrollIndicator={true}
                scrollEnabled={false}
                scrollEventThrottle={16}
                bounces={false}
                overScrollMode="never"
                style={styles.headerScrollable}
              >
                <View style={styles.headerScrollableRow}>
                  {visibleNonStickyColumns.map((col) => (
                    <Text key={col.key} style={[styles.tableHeaderCell, styles.colWidth]}>{col.label}</Text>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Body with sticky left column and horizontally scrollable right side */}
            <View style={styles.tableBody}>
              <View style={styles.leftColumn}>
                {paginatedData.map((item, index) => (
                  <View
                    key={index}
                    style={[styles.leftCell, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
                  >
                    <Text style={styles.tableCell}>{item.orderNo}</Text>
                  </View>
                ))}
              </View>
              <ScrollView
                ref={bodyScrollRef}
                horizontal
                showsHorizontalScrollIndicator={true}
                onScroll={syncHeaderFromBody}
                scrollEventThrottle={16}
                bounces={false}
                overScrollMode="never"
                style={styles.bodyScrollable}
              >
                <View>
                  {paginatedData.map((item, index) => (
                    <View
                      key={index}
                      style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
                    >
                      {visibleNonStickyColumns.map((col) => (
                        <Text key={col.key} style={[styles.tableCell, styles.colWidth]}>
                          {String((item as Record<string, any>)[col.key] ?? '')}
                        </Text>
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

      {/* Unlimited column visibility for Order Monitoring */}
      <ColumnVisibilityModal
        visible={isColumnVisibilityModalOpen}
        onClose={() => setIsColumnVisibilityModalOpen(false)}
        columns={columns}
        onColumnToggle={handleColumnToggle}
        maxVisibleColumns={null}
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
    width: '100%',
    minHeight: 500,
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
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
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
    height: 40,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    paddingHorizontal: 10,
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
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tableContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#8D8D8D',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#8D8D8D',
    alignItems: 'center',
  },
  tableHeaderSticky: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#8D8D8D',
    borderRightWidth: 1,
    borderRightColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHeaderCell: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'MuseoSans-Bold',
  },
  columnVisibilityHeader: {
    width: '100%',
    backgroundColor: '#F2F2F2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    marginTop: 10,
  },
  columnVisibilityHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
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
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 10,
  },
  exportButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  exportButton: {
    width: '48%',
    marginRight: 8,
  },
  printButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    width: '48%',
  },
  emailButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerScrollable: {
    flex: 1,
  },
  headerScrollableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  tableBody: {
    flexDirection: 'row',
  },
  leftColumn: {
    width: 110,
  },
  leftCell: {
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  tableRowEven: {
    backgroundColor: '#FFFFFF',
  },
  tableRowOdd: {
    backgroundColor: '#F8F9FA',
  },
  tableCell: {
    fontSize: 12,
    color: '#495057',
    textAlign: 'center',
    fontFamily: 'MuseoSans-Regular',
    padding: 4,
  },
  stickyColWidth: {
    width: 110,
  },
  colWidth: {
    width: 110,
  },
  bodyScrollable: {
    flex: 1,
  },
});

export default OrderMonitoringScreen;