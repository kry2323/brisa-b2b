import React, { useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import ColumnVisibilityModal from '../components/ColumnVisibilityModal';
import DatePicker from '../components/DatePicker';
import ShowDropdown from '../components/ShowDropdown';
import ExcelExport from '../components/ExcelExport';
import Pagination from '../components/Pagination';
import CustomerSelectModal, { CustomerItem } from '../components/CustomerSelectModal';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { useReportNavigation } from '../utils/navigationUtils';

const OrderMonitoringScreen = ({ route, navigation }: any) => {
  const { reportData } = route.params || {};
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Use centralized report navigation
  const handleNavigateToReport = useReportNavigation(navigation);
// Form state
  const [startDate, setStartDate] = useState('30/12/2018');
  const [endDate, setEndDate] = useState('28/07/2025');
  const [orderNumber, setOrderNumber] = useState('');
  const [status, setStatus] = useState('');
  const [customerCode, setCustomerCode] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  
  // Columns state for Order Monitoring
  const [columns, setColumns] = useState([
    { key: 'shipToParty', label: 'Ship-to Party', visible: true },
    { key: 'orderNo', label: 'Order No', visible: true },
    { key: 'orderQty', label: 'Order Qty.', visible: true },
    { key: 'invoicedQty', label: 'Invoiced Qty', visible: true },
    { key: 'notInvoicedQty', label: 'Not Invoiced Qty', visible: true },
    { key: 'orderDate', label: 'Order Date', visible: true },
    { key: 'shipTo', label: 'Ship-To', visible: false },
    { key: 'item', label: 'Item', visible: false },
    { key: 'purchaseOrderNo', label: 'Purchase Order No', visible: false },
    { key: 'material', label: 'Material', visible: false },
    { key: 'materialDescript', label: 'Material Descript', visible: false },
    { key: 'invoiceNo', label: 'Invoice No', visible: false },
    { key: 'season', label: 'Season', visible: false },
    { key: 'reqDeliveryDate', label: 'Req. Delivery Date', visible: false },
  ]);

  // Rich mock data for Order Monitoring
  type RowType = {
    shipToParty: string;
    orderNo: string;
    orderQty: number;
    invoicedQty: number;
    notInvoicedQty: number;
    orderDate: string;
    shipTo: string;
    item: string;
    purchaseOrderNo: string;
    material: string;
    materialDescript: string;
    invoiceNo: string;
    season: string;
    reqDeliveryDate: string;
  };

  const [tableData] = useState<RowType[]>(
    Array.from({ length: 30 }).map((_, i): RowType => ({
      shipToParty: 'SC RADBURG SOFT SRL',
      orderNo: `ORD-${2024000 + i}`,
      orderQty: Math.floor(Math.random() * 1000) + 100,
      invoicedQty: Math.floor(Math.random() * 800) + 50,
      notInvoicedQty: Math.floor(Math.random() * 200) + 10,
      orderDate: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/2024`,
      shipTo: `SHIP-${1000 + i}`,
      item: `ITEM-${1000 + i}`,
      purchaseOrderNo: `PO-${2024000 + i}`,
      material: `MAT-${5000 + i}`,
      materialDescript: `Tire Material Description ${i + 1}`,
      invoiceNo: `INV-${2024000 + i}`,
      season: ['Spring', 'Summer', 'Fall', 'Winter'][i % 4],
      reqDeliveryDate: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/2024`,
    }))
  );

  // Column visibility handlers
  const [isColumnVisibilityModalOpen, setIsColumnVisibilityModalOpen] = useState(false);
  const handleColumnToggle = (key: string) => {
    setColumns((prev) => prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)));
  };

  const visibleColumns = useMemo(
    () => columns.filter(c => c.visible),
    [columns]
  );

  // Sticky column logic
  const stickyColumn = visibleColumns[0]; // First column is sticky
  const scrollableColumns = visibleColumns.slice(1); // Rest are scrollable
  const isScrollable = scrollableColumns.length >= 2; // 2 veya daha fazla scrollable column varsa scroll etkin
  
  // Scroll sync refs
  const headerScrollRef = useRef<any>(null);
  const bodyScrollRef = useRef<any>(null);
  
  // Sync header scroll with body scroll
  const syncHeaderFromBody = (event: any) => {
    const x = event?.nativeEvent?.contentOffset?.x || 0;
    headerScrollRef.current?.scrollTo({ x, animated: false });
  };

  // Pagination state (default 100 Show)
  const [itemsPerPage, setItemsPerPage] = useState<number>(100); // -1 means "Show All"
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalItems = tableData.length;
  const effectiveItemsPerPage = itemsPerPage === -1 ? totalItems : itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectiveItemsPerPage));
  const startIndex = (currentPage - 1) * effectiveItemsPerPage;
  const endIndex = itemsPerPage === -1 ? totalItems : startIndex + effectiveItemsPerPage;
  const paginatedData = tableData.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrint = async () => {
    const rowsHtml = paginatedData.map(row => {
      const tds = visibleColumns.map(c => `<td style=\"border:1px solid #ddd;padding:6px;font-size:12px;\">${String((row as Record<string, any>)[c.key] ?? '')}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }).join('');
    const headerHtml = visibleColumns.map(c => `<th style=\"border:1px solid #ddd;padding:8px;background:#666;color:#fff;font-weight:600;font-size:12px;\">${c.label}</th>`).join('');
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
      // Print error
    }
  };

  const handleList = () => {
    // In a real app, this would fetch data based on the form inputs
    // For now we'll just use the mock data already set
  };

  const handlePrevious = () => {
    navigation.navigate('OrderMonitoring', { reportData });
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
                  <TouchableOpacity style={{ height: 38, paddingHorizontal: 10, backgroundColor: '#F39C12', marginLeft: 8, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }} onPress={() => setIsCustomerModalOpen(true)}>
                    <AntDesign name="search1" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
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

                buttonStyle={styles.exportButton}
                buttonIcon={<FontAwesome name="file-excel-o" size={18} color="#FFFFFF" style={{marginRight: 8}} />}
              />
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
            <ShowDropdown value={itemsPerPage} onValueChange={handleItemsPerPageChange} fullWidth />
          </View>

          {/* Table */}
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
                    <Text key={col.key} style={[styles.tableHeaderCellText, styles.scrollableHeaderCell]}>{col.label}</Text>
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
                    onPress={() => { /* Handle row click if needed */ }}
                  >
                    <Ionicons name="search" size={18} color="#D53439" />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.stickyColumn}>
                {paginatedData.map((item, index) => (
                  <View
                    key={index}
                    style={[styles.stickyCell, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
                  >
                    <Text style={styles.stickyCellText} numberOfLines={1} ellipsizeMode="tail">
                      {String((item as Record<string, any>)[stickyColumn?.key] ?? '')}
                    </Text>
                  </View>
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
                        <Text key={col.key} style={[styles.tableCell, styles.scrollableCell]} numberOfLines={1} ellipsizeMode="tail">
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
        onNavigateToReport={(reportData) => handleNavigateToReport(reportData, setIsReportsModalOpen)}
      />

      {/* Unlimited column visibility for Order Monitoring */}
      <ColumnVisibilityModal
        visible={isColumnVisibilityModalOpen}
        onClose={() => setIsColumnVisibilityModalOpen(false)}
        columns={columns}
        onColumnToggle={handleColumnToggle}
        maxVisibleColumns={null}
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
  formGroupFull: {
    width: '100%',
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
  tableHeaderCellText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'MuseoSans-Bold',
  },
  headerScrollable: {
    flex: 1,
  },
  headerScrollableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  scrollableHeaderCell: {
    width: 120,
    paddingHorizontal: 8,
    minWidth: 120,
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
    width: '100%',
  },
  emailButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tableBody: {
    flexDirection: 'row',
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  scrollableCell: {
    width: 120,
    paddingHorizontal: 8,
    minWidth: 120,
  },
  // Common styles
  tableRowEven: { 
    backgroundColor: '#FFFFFF' 
  },
  tableRowOdd: { 
    backgroundColor: '#F8F9FA' 
  },
  tableCell: { 
    fontSize: 12, 
    color: '#495057', 
    textAlign: 'center', 
    fontFamily: 'MuseoSans-Regular',
  },
  stickyCellText: {
    fontSize: 12,
    color: '#495057',
    textAlign: 'center',
    fontFamily: 'MuseoSans-Regular',
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
});

export default OrderMonitoringScreen;