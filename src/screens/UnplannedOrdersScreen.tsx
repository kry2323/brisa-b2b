import React, { useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import DatePicker from '../components/DatePicker';
import ExcelExport from '../components/ExcelExport';
import ColumnVisibilityModal from '../components/ColumnVisibilityModal';
import ShowDropdown from '../components/ShowDropdown';
import Pagination from '../components/Pagination';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const UnplannedOrdersScreen = ({ route, navigation }: any) => {
  const { reportData } = route.params || {};
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  
  // Form state
  const [startDate, setStartDate] = useState('30/12/2018');
  const [endDate, setEndDate] = useState('28/07/2025');
  const [orderNumber, setOrderNumber] = useState('');
  const [status, setStatus] = useState('');
  
  // Columns state for Unplanned Orders
  const [columns, setColumns] = useState([
    { key: 'remainingQty', label: 'Remaining Qty', visible: true },
    { key: 'orderNo', label: 'Order No', visible: false },
    { key: 'item', label: 'Item', visible: false },
    { key: 'material', label: 'Material', visible: false },
    { key: 'description', label: 'Description', visible: false },
    { key: 'season', label: 'Season', visible: false },
    { key: 'purchaseOrder', label: 'Purchase Order', visible: false },
    { key: 'requestedDeliveryDate', label: 'Requested Delivery Date', visible: false },
    { key: 'shipTo', label: 'Ship-to', visible: false },
    { key: 'shipToParty', label: 'Ship-To Party', visible: false },
    { key: 'customerMaterial', label: 'Customer Material', visible: false },
  ]);

  // Rich mock data for Unplanned Orders
  type RowType = {
    remainingQty: number;
    orderNo: string;
    item: string;
    material: string;
    description: string;
    season: string;
    purchaseOrder: string;
    requestedDeliveryDate: string;
    shipTo: string;
    shipToParty: string;
    customerMaterial: string;
  };

  const [tableData] = useState<RowType[]>(
    Array.from({ length: 30 }).map((_, i): RowType => ({
      remainingQty: Math.floor(Math.random() * 500) + 50,
      orderNo: `UNP-${2024000 + i}`,
      item: `ITEM-${1000 + i}`,
      material: `MAT-${5000 + i}`,
      description: `Unplanned Tire Description ${i + 1}`,
      season: ['Spring', 'Summer', 'Fall', 'Winter'][i % 4],
      purchaseOrder: `PO-${2024000 + i}`,
      requestedDeliveryDate: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/2024`,
      shipTo: `SHIP-${1000 + i}`,
      shipToParty: 'SC RADBURG SOFT SRL',
      customerMaterial: `CUST-MAT-${2000 + i}`,
    }))
  );

  // Column visibility
  const [isColumnVisibilityModalOpen, setIsColumnVisibilityModalOpen] = useState(false);
  const handleColumnToggle = (key: string) => {
    setColumns(prev => prev.map(c => (c.key === key ? { ...c, visible: !c.visible } : c)));
  };
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

  // Pagination and Show
  const [itemsPerPage, setItemsPerPage] = useState<number>(100); // -1 means "Show All"
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalItems = tableData.length;
  const effectiveItemsPerPage = itemsPerPage === -1 ? totalItems : itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectiveItemsPerPage));
  const startIndex = (currentPage - 1) * effectiveItemsPerPage;
  const endIndex = itemsPerPage === -1 ? totalItems : startIndex + effectiveItemsPerPage;
  const paginatedData = tableData.slice(startIndex, endIndex);
  const handleItemsPerPageChange = (value: number) => { setItemsPerPage(value); setCurrentPage(1); };
  const handlePageChange = (page: number) => setCurrentPage(page);

  // Print
  const handlePrint = async () => {
    const visibleCols = columns.filter(c => c.visible);
    const rowsHtml = paginatedData.map(row => {
      const tds = visibleCols.map(c => `<td style=\"border:1px solid #ddd;padding:6px;font-size:12px;\">${String((row as any)[c.key] ?? '')}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }).join('');
    const headerHtml = visibleCols.map(c => `<th style=\"border:1px solid #ddd;padding:8px;background:#666;color:#fff;font-weight:600;font-size:12px;\">${c.label}</th>`).join('');
    const html = `<!DOCTYPE html><html><head><meta charset=\"utf-8\" /></head><body><h1 style=\"font-family:Arial; font-size:16px;\">Unplanned Orders</h1><table style=\"width:100%;border-collapse:collapse;font-family:Arial;\"><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`;
    try {
      if (Platform.OS === 'web') { await Print.printAsync({ html }); }
      else { const { uri } = await Print.printToFileAsync({ html }); const canShare = await Sharing.isAvailableAsync(); if (canShare) await Sharing.shareAsync(uri); else await Print.printAsync({ html }); }
    } catch {}
  };

  const handleList = () => {
    console.log('Listing unplanned orders with filters:', { startDate, endDate, orderNumber, status });
  };

  const handleNavigateToReport = (reportData: any) => {
    setIsReportsModalOpen(false);
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

  const handlePrevious = () => {
    navigation.navigate('OrderMonitoring', { reportData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.titleContainer}>
        <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
          <AntDesign name="arrowleft" size={20} color="#DA3C42" />
          <Text style={styles.previousButtonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Unplanned Orders</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          
          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Date Range Row */}
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Start Date</Text>
                <DatePicker value={startDate} onChange={setStartDate} placeholder="DD/MM/YYYY" />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>End Date</Text>
                <DatePicker value={endDate} onChange={setEndDate} placeholder="DD/MM/YYYY" />
              </View>
            </View>
            
            {/* Order Number and Status Row */}
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Order Number</Text>
                <TextInput style={styles.textInput} value={orderNumber} onChangeText={setOrderNumber} placeholder="Enter order number" />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Status</Text>
                <TextInput style={styles.textInput} value={status} onChangeText={setStatus} placeholder="Enter status" />
              </View>
            </View>
            
            {/* List Button Row */}
            <View style={styles.formRow}>
              <TouchableOpacity style={styles.listButton} onPress={handleList}>
                <AntDesign name="bars" size={18} color="#FFFFFF" style={{marginRight: 8}} />
                <Text style={styles.listButtonText}>List</Text>
              </TouchableOpacity>
            </View>

            {/* Export Buttons Row */}
            <View style={[styles.formRow, styles.exportButtonsRow]}>
              <ExcelExport 
                data={paginatedData}
                visibleColumns={columns}
                fileName={`UnplannedOrders_${new Date().toISOString().split('T')[0]}`}
                buttonText="Excel İndir"
                buttonStyle={styles.exportButton}
                buttonIcon={<FontAwesome name="file-excel-o" size={18} color="#FFFFFF" style={{marginRight: 8}} />}
              />
              <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
                <Text style={styles.emailButtonText}>Print</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Column Visibility */}
          <TouchableOpacity style={styles.columnVisibilityHeaderPrimary} onPress={() => setIsColumnVisibilityModalOpen(true)}>
            <Text style={styles.columnVisibilityHeaderPrimaryText}>Column Visibility</Text>
          </TouchableOpacity>

          {/* Show Dropdown */}
          <View style={styles.showDropdownContainer}>
            <ShowDropdown value={itemsPerPage} onValueChange={handleItemsPerPageChange} />
          </View>

          {/* Table */}
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeaderRow}>
              <View style={styles.tableHeaderSticky}>
                <Text style={styles.tableHeaderCell}>{stickyColumn?.label}</Text>
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
                    <Text key={col.key} style={[styles.tableHeaderCell, styles.scrollableHeaderCell]}>{col.label}</Text>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Table Body */}
            <View style={styles.tableBody}>
              <View style={styles.stickyColumn}>
                {paginatedData.map((item, index) => (
                  <View
                    key={index}
                    style={[styles.stickyCell, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
                  >
                    <Text style={styles.tableCell} numberOfLines={1} ellipsizeMode="tail">
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
            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} />
          )}
        </View>
        <Footer />
      </ScrollView>
      <BottomNavigation 
        isReportsModalOpen={isReportsModalOpen} 
        setIsReportsModalOpen={setIsReportsModalOpen}
        onNavigateToReport={handleNavigateToReport}
      />

      <ColumnVisibilityModal visible={isColumnVisibilityModalOpen} onClose={() => setIsColumnVisibilityModalOpen(false)} columns={columns} onColumnToggle={handleColumnToggle} maxVisibleColumns={null} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollView: { flex: 1 },
  content: { padding: 20, width: '100%', minHeight: 500 },
  titleContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    flexDirection: 'row',
    alignItems: 'center',
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F8F8F8',
  },
  previousButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DA3C42',
    marginLeft: 4,
  },
  title: { fontSize: 18, fontWeight: '600', color: '#333', flex: 1 },

  formContainer: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 10, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  formRow: { flexDirection: 'row', marginBottom: 15, justifyContent: 'space-between', width: '100%' },
  formGroup: { width: '48%', marginBottom: 10 },
  formLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  textInput: { height: 40, borderWidth: 1, borderColor: '#DDD', borderRadius: 4, paddingHorizontal: 10, backgroundColor: '#FFF' },

  listButton: { backgroundColor: '#8D8D8D', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 5, alignItems: 'center', width: '100%', flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  listButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },

  exportButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  exportButton: { width: '48%', marginRight: 8 },
  printButton: { backgroundColor: '#2196F3', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginLeft: 8, width: '48%' },
  emailButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },

  columnVisibilityHeaderPrimary: { backgroundColor: '#FFFFFF', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 10, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: '#DA3C42', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 3.84, elevation: 3 },
  columnVisibilityHeaderPrimaryText: { fontSize: 16, fontWeight: 'bold', color: '#DA3C42' },
  showDropdownContainer: { alignSelf: 'flex-end', marginTop: 10, marginBottom: 10 },

  tableContainer: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 10, overflow: 'hidden', marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  
  // Header styles
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#8D8D8D' },
  tableHeaderSticky: { width: 120, paddingVertical: 12, paddingHorizontal: 8, backgroundColor: '#8D8D8D', borderRightWidth: 1, borderRightColor: '#555', justifyContent: 'center', alignItems: 'center' },
  tableHeaderCell: { color: '#FFF', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  headerScrollable: { flex: 1 },
  headerScrollableRow: { flexDirection: 'row', paddingVertical: 12 },
  scrollableHeaderCell: { width: 120, paddingHorizontal: 8, minWidth: 120 },

  // Body styles
  tableBody: { flexDirection: 'row' },
  stickyColumn: { width: 120 },
  stickyCell: { paddingVertical: 12, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E9ECEF', borderRightWidth: 1, borderRightColor: '#E9ECEF' },
  bodyScrollable: { flex: 1 },
  scrollableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E9ECEF' },
  scrollableCell: { width: 120, paddingHorizontal: 8, minWidth: 120 },
  
  // Common styles
  tableRowEven: { backgroundColor: '#FFFFFF' },
  tableRowOdd: { backgroundColor: '#F8F9FA' },
  tableCell: { fontSize: 12, color: '#495057', textAlign: 'center' },

});

export default UnplannedOrdersScreen;
