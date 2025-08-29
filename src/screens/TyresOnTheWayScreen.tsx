import React, { useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import DatePicker from '../components/DatePicker';
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import ExcelExport from '../components/ExcelExport';
import EmailSender from '../components/EmailSender';
import ColumnVisibilityModal from '../components/ColumnVisibilityModal';
import ShowDropdown from '../components/ShowDropdown';
import Pagination from '../components/Pagination';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const TyresOnTheWayScreen = ({ route, navigation }: any) => {
  const { reportData } = route.params || {};
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  
  // Form state
  const [startDate, setStartDate] = useState('30/12/2018');
  const [endDate, setEndDate] = useState('28/07/2025');
  const [shipmentNumber, setShipmentNumber] = useState('');
  const [productCode, setProductCode] = useState('');
  
  // Columns state for Tyres On The Way
  const [columns, setColumns] = useState([
    { key: 'shipToPartyName', label: 'Ship-to Party Name', visible: true },
    { key: 'map', label: 'Map', visible: true },
    { key: 'planNo', label: 'Plan No', visible: true },
    { key: 'invoiceNo', label: 'Invoice No', visible: true },
    { key: 'quantity', label: 'Quantity', visible: true },
    { key: 'etd', label: 'ETD', visible: true },
    { key: 'eta', label: 'ETA', visible: true },
    { key: 'agent', label: 'Agent', visible: true },
    { key: 'vesselName', label: 'Vessel Name', visible: true },
    { key: 'blNo', label: 'B/L No', visible: true },
    { key: 'placeOfDestination', label: 'Place of Destination', visible: true },
    { key: 'licensePlateNo', label: 'License plate no', visible: true },
    { key: 'shipToParty', label: 'Ship-to Party', visible: false },
  ]);

  // Rich mock data for Tyres On The Way
  type RowType = {
    shipToPartyName: string;
    map: string;
    planNo: string;
    invoiceNo: string;
    quantity: number;
    etd: string;
    eta: string;
    agent: string;
    vesselName: string;
    blNo: string;
    placeOfDestination: string;
    licensePlateNo: string;
    shipToParty: string;
  };

  const [tableData] = useState<RowType[]>(
    Array.from({ length: 30 }).map((_, i): RowType => ({
      shipToPartyName: 'SC RADBURG SOFT SRL',
      map: `MAP-${2024000 + i}`,
      planNo: `PLAN-${2024000 + i}`,
      invoiceNo: `INV-${2024000 + i}`,
      quantity: Math.floor(Math.random() * 1000) + 100,
      etd: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/2024`,
      eta: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/2024`,
      agent: `Agent ${i + 1}`,
      vesselName: `Vessel ${i + 1}`,
      blNo: `BL-${2024000 + i}`,
      placeOfDestination: `Destination ${i + 1}`,
      licensePlateNo: `PLATE-${1000 + i}`,
      shipToParty: `SHIP-${1000 + i}`,
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
    const html = `<!DOCTYPE html><html><head><meta charset=\"utf-8\" /></head><body><h1 style=\"font-family:Arial; font-size:16px;\">Tyres On The Way</h1><table style=\"width:100%;border-collapse:collapse;font-family:Arial;\"><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`;
    try {
      if (Platform.OS === 'web') { await Print.printAsync({ html }); }
      else { const { uri } = await Print.printToFileAsync({ html }); const canShare = await Sharing.isAvailableAsync(); if (canShare) await Sharing.shareAsync(uri); else await Print.printAsync({ html }); }
    } catch {}
  };
  
  // Email modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleList = () => {
    // In a real app, this would fetch data based on the form inputs
    console.log('Listing with filters:', { startDate, endDate, shipmentNumber, productCode });
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
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Tyres On The Way</Text>
          
          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Date Range Row */}
            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.formGroupFull]}>
                <Text style={styles.formLabel}>Shipment Date *</Text>
                <View style={styles.datePickerContainer}>
                  <View style={[styles.datePickerItem, styles.datePickerItemSpacing]}>
                    <DatePicker value={startDate} onChange={setStartDate} />
                  </View>
                  <View style={styles.datePickerItem}>
                    <DatePicker value={endDate} onChange={setEndDate} />
                  </View>
                </View>
              </View>
            </View>
            
            {/* Shipment Number and Product Code Row */}
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Shipment Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={shipmentNumber}
                  onChangeText={setShipmentNumber}
                  placeholder="Enter shipment number"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Product Code</Text>
                <TextInput
                  style={styles.textInput}
                  value={productCode}
                  onChangeText={setProductCode}
                  placeholder="Enter product code"
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
            
            {/* Export Buttons Row */}
            <View style={[styles.formRow, styles.exportButtonsRow]}>
              <ExcelExport 
                data={paginatedData}
                visibleColumns={columns}
                fileName={`TyresOnTheWay_${new Date().toISOString().split('T')[0]}`}
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
      
      {/* Email Sender Modal */}
      <EmailSender
        visible={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        data={paginatedData}
        visibleColumns={columns}
        reportName="TyresOnTheWay"
      />

      <ColumnVisibilityModal visible={isColumnVisibilityModalOpen} onClose={() => setIsColumnVisibilityModalOpen(false)} columns={columns} onColumnToggle={handleColumnToggle} maxVisibleColumns={null} />
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'left',
    fontFamily: 'MuseoSans-Medium',
    marginBottom: 20,
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
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerItem: {
    flex: 1,
  },
  datePickerItemSpacing: {
    marginRight: 10,
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
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#8D8D8D',
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
  tableHeaderCell: {
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
  tableBody: {
    flexDirection: 'row',
  },
  stickyColumn: {
    width: 120,
  },
  stickyCell: {
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  scrollableCell: {
    width: 120,
    paddingHorizontal: 8,
    minWidth: 120,
  },
  tableRowEven: { backgroundColor: '#FFFFFF' },
  tableRowOdd: { backgroundColor: '#F8F9FA' },
  tableCell: { 
    fontSize: 12, 
    color: '#495057', 
    textAlign: 'center', 
    fontFamily: 'MuseoSans-Regular',
  },
});

export default TyresOnTheWayScreen;