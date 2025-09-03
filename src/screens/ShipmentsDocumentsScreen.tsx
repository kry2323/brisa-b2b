import React, { useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import DatePicker from '../components/DatePicker';
import { AntDesign, MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import ExcelExport from '../components/ExcelExport';
import EmailSender from '../components/EmailSender';
import { downloadBundledPdf } from '../utils/pdfAssets';
import ColumnVisibilityModal from '../components/ColumnVisibilityModal';
import CustomerSelectModal, { CustomerItem } from '../components/CustomerSelectModal';
import ShowDropdown from '../components/ShowDropdown';
import Pagination from '../components/Pagination';

const ShipmentsDocumentsScreen = ({ route, navigation }: any) => {
  const { reportData } = route.params || {};
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  
  // Form state
  const [startDate, setStartDate] = useState('30/12/2018');
  const [endDate, setEndDate] = useState('28/07/2025');
  const [planNo, setPlanNo] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [customerCode, setCustomerCode] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  
  // Table data state
  const [tableData, setTableData] = useState([
    { 
      planNo: '3500057880', invoiceNo: '9280033872', invoiceQty: '1,062',
      netValue: '10,620', currency: 'EUR', incoterm: 'FOB',
      etd: '01/06/2024', eta: '10/06/2024', shipmentDate: '02/06/2024',
      agent: 'DHL', containerPlateNo: 'TR-34 ABC 123',
      customer: 'C001', customerName: 'SC RADBURG SOFT SRL'
    },
    { 
      planNo: '3500058173', invoiceNo: '9280034066', invoiceQty: '1,264',
      netValue: '12,640', currency: 'EUR', incoterm: 'CIF',
      etd: '05/06/2024', eta: '14/06/2024', shipmentDate: '06/06/2024',
      agent: 'UPS', containerPlateNo: 'TR-06 XYZ 789',
      customer: 'C002', customerName: 'TECH SOLUTIONS LTD'
    },
    { 
      planNo: '3500058234', invoiceNo: '9280034155', invoiceQty: '856',
      netValue: '8,560', currency: 'USD', incoterm: 'EXW',
      etd: '08/06/2024', eta: '18/06/2024', shipmentDate: '09/06/2024',
      agent: 'FedEx', containerPlateNo: 'TR-35 DEF 456',
      customer: 'C003', customerName: 'INDUSTRIAL PARTS CO'
    },
    { 
      planNo: '3500058345', invoiceNo: '9280034244', invoiceQty: '2,150',
      netValue: '21,500', currency: 'EUR', incoterm: 'DDP',
      etd: '12/06/2024', eta: '22/06/2024', shipmentDate: '13/06/2024',
      agent: 'TNT', containerPlateNo: 'TR-07 GHI 789',
      customer: 'C004', customerName: 'AUTO PARTS SUPPLY'
    },
    { 
      planNo: '3500058456', invoiceNo: '9280034333', invoiceQty: '1,890',
      netValue: '18,900', currency: 'GBP', incoterm: 'FCA',
      etd: '15/06/2024', eta: '25/06/2024', shipmentDate: '16/06/2024',
      agent: 'DHL', containerPlateNo: 'TR-16 JKL 012',
      customer: 'C005', customerName: 'LOGISTICS PRO LTD'
    },
    { 
      planNo: '3500058567', invoiceNo: '9280034422', invoiceQty: '3,240',
      netValue: '32,400', currency: 'EUR', incoterm: 'CPT',
      etd: '18/06/2024', eta: '28/06/2024', shipmentDate: '19/06/2024',
      agent: 'UPS', containerPlateNo: 'TR-42 MNO 345',
      customer: 'C006', customerName: 'RACING TEAM SUPPLY'
    },
    { 
      planNo: '3500058678', invoiceNo: '9280034511', invoiceQty: '1,567',
      netValue: '15,670', currency: 'USD', incoterm: 'DAP',
      etd: '21/06/2024', eta: '01/07/2024', shipmentDate: '22/06/2024',
      agent: 'FedEx', containerPlateNo: 'TR-01 PQR 678',
      customer: 'C007', customerName: 'FLEET MANAGEMENT CO'
    },
    { 
      planNo: '3500058789', invoiceNo: '9280034600', invoiceQty: '2,890',
      netValue: '28,900', currency: 'EUR', incoterm: 'FAS',
      etd: '24/06/2024', eta: '04/07/2024', shipmentDate: '25/06/2024',
      agent: 'TNT', containerPlateNo: 'TR-26 STU 901',
      customer: 'C008', customerName: 'CONSTRUCTION SUPPLY'
    },
    { 
      planNo: '3500058890', invoiceNo: '9280034699', invoiceQty: '1,234',
      netValue: '12,340', currency: 'GBP', incoterm: 'DAT',
      etd: '27/06/2024', eta: '07/07/2024', shipmentDate: '28/06/2024',
      agent: 'DHL', containerPlateNo: 'TR-34 VWX 234',
      customer: 'C009', customerName: 'AVIATION EQUIPMENT'
    },
    { 
      planNo: '3500058901', invoiceNo: '9280034788', invoiceQty: '4,567',
      netValue: '45,670', currency: 'EUR', incoterm: 'CIP',
      etd: '30/06/2024', eta: '10/07/2024', shipmentDate: '01/07/2024',
      agent: 'UPS', containerPlateNo: 'TR-06 YZA 567',
      customer: 'C010', customerName: 'MARINE SUPPLY CO'
    },
    { 
      planNo: '3500059012', invoiceNo: '9280034877', invoiceQty: '2,345',
      netValue: '23,450', currency: 'USD', incoterm: 'FOB',
      etd: '03/07/2024', eta: '13/07/2024', shipmentDate: '04/07/2024',
      agent: 'FedEx', containerPlateNo: 'TR-35 BCD 890',
      customer: 'C011', customerName: 'ELECTRONICS DISTRIBUTOR'
    },
    { 
      planNo: '3500059123', invoiceNo: '9280034966', invoiceQty: '1,789',
      netValue: '17,890', currency: 'EUR', incoterm: 'CIF',
      etd: '06/07/2024', eta: '16/07/2024', shipmentDate: '07/07/2024',
      agent: 'TNT', containerPlateNo: 'TR-07 EFG 123',
      customer: 'C012', customerName: 'PHARMA SOLUTIONS'
    },
  ]);
  
  // Column visibility state for Excel export
  const [columns, setColumns] = useState([
    { key: 'planNo', label: 'Plan No', visible: true },
    { key: 'invoiceNo', label: 'Invoice No', visible: true },
    { key: 'invoiceQty', label: 'Invoice Qty', visible: true },
    { key: 'netValue', label: 'Net Value', visible: true },
    { key: 'customer', label: 'Customer', visible: true },
    { key: 'customerName', label: 'Customer Name', visible: true },
    { key: 'currency', label: 'Currency', visible: false },
    { key: 'incoterm', label: 'Incoterm', visible: false },
    { key: 'etd', label: 'ETD', visible: false },
    { key: 'eta', label: 'ETA', visible: false },
    { key: 'shipmentDate', label: 'Shipment Date', visible: false },
    { key: 'agent', label: 'Agent', visible: false },
    { key: 'containerPlateNo', label: 'Container / Plate No', visible: false },
  ]);

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isColumnVisibilityModalOpen, setIsColumnVisibilityModalOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleColumnToggle = (key: string) => {
    setColumns(prev => prev.map(col => col.key === key ? { ...col, visible: !col.visible } : col));
  };
  
  // Pagination handlers
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Calculate pagination
  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = tableData.slice(startIndex, endIndex);
  
  // Email modal state
  // const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleList = () => {
    // In a real app, this would fetch data based on the form inputs
  };

  const handlePlanDraftDownload = async (plan: string) => {
    if (!(plan?.startsWith('35') || plan?.endsWith('35'))) return;
    try {
      await downloadBundledPdf(require('../../INVOICE DRAFT.pdf'), `INVOICE_DRAFT_${plan}.pdf`);
    } catch (e) {
      console.error('Failed to download draft PDF', e);
    }
  };

  const handleInvoiceDownload = async () => {
    try {
      await downloadBundledPdf(require('../../INVOICE 2.pdf'), 'INVOICE_2.pdf');
    } catch (e) {
      console.error('Failed to download invoice PDF', e);
    }
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

  // Visible columns and horizontal scroll config (match Overdue style)
  const visibleColumns = useMemo(() => columns.filter(c => c.visible), [columns]);
  const stickyColumn = visibleColumns[0];
  const scrollableColumns = visibleColumns.slice(1);
  const isScrollable = scrollableColumns.length >= 2; // 2 veya daha fazla scrollable column varsa scroll etkin
  const headerScrollRef = useRef<any>(null);
  const bodyScrollRef = useRef<any>(null);
  const syncHeaderFromBody = (event: any) => {
    const x = event?.nativeEvent?.contentOffset?.x || 0;
    headerScrollRef.current?.scrollTo({ x, animated: false });
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
        <Text style={styles.title}>Shipments, Documents and Status</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          
          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Plan Date Row */}
            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.formGroupFull]}>
                <Text style={styles.formLabel}>Plan Date *</Text>
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
            
            {/* Plan No and Invoice No Row */}
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Plan No</Text>
                <TextInput
                  style={styles.textInput}
                  value={planNo}
                  onChangeText={setPlanNo}
                  placeholder="Enter Plan No"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Invoice No</Text>
                <TextInput
                  style={styles.textInput}
                  value={invoiceNo}
                  onChangeText={setInvoiceNo}
                  placeholder="Enter Invoice No"
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
                    <Ionicons name="search" size={18} color="#FFFFFF" />
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
            
            {/* Export Buttons Row */}
            <View style={[styles.formRow, styles.exportButtonsRow]}>
              <ExcelExport 
                data={tableData}
                visibleColumns={columns}
                fileName={`ShipmentsDocuments_${new Date().toISOString().split('T')[0]}`}
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
          
          {/* Table Section (sticky first column) */}
          <View style={styles.tableContainer}>
            {/* Header */}
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
                    <View key={col.key} style={[styles.tableHeaderCell, styles.scrollableHeaderCell]}>
                      <Text style={styles.tableHeaderCellText}>{col.label}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Body */}
            <View style={styles.tableBody}>
              {/* Lead icon column */}
              <View>
                {paginatedData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.leadIcon, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
                    onPress={() => {}}
                  >
                    <Ionicons name="search" size={18} color="#D53439" />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.stickyColumn}>
                {paginatedData.map((item, index) => (
                  <View key={index} style={[styles.stickyCell, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                    <Text style={styles.stickyCellText} numberOfLines={1} ellipsizeMode="tail">
                      {String((item as any)[stickyColumn?.key] ?? '')}
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
                    <View key={index} style={[styles.scrollableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                      {scrollableColumns.map((col) => (
                        <View key={col.key} style={styles.scrollableCell}>
                          {col.key === 'planNo' ? (
                            (item.planNo?.startsWith('35') || item.planNo?.endsWith('35')) ? (
                              <TouchableOpacity onPress={() => handlePlanDraftDownload(item.planNo)}>
                                <Text style={[styles.tableCell, styles.linkText]} numberOfLines={1} ellipsizeMode="tail">{item.planNo}</Text>
                              </TouchableOpacity>
                            ) : (
                              <Text style={styles.tableCell} numberOfLines={1} ellipsizeMode="tail">{item.planNo}</Text>
                            )
                          ) : col.key === 'invoiceNo' ? (
                            <TouchableOpacity onPress={handleInvoiceDownload}>
                              <Text style={[styles.tableCell, styles.linkText]} numberOfLines={1} ellipsizeMode="tail">{item.invoiceNo}</Text>
                            </TouchableOpacity>
                          ) : (
                            <Text style={styles.tableCell} numberOfLines={1} ellipsizeMode="tail">{String((item as any)[col.key] ?? '')}</Text>
                          )}
                        </View>
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
      
      {/* Email Sender Modal */}
      <EmailSender
        visible={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        data={tableData}
        visibleColumns={columns}
        reportName="ShipmentsDocuments"
      />
      
      {/* Customer Select Modal */}
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
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#FFF',
    fontFamily: 'MuseoSans-Regular',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerItem: {
    flex: 1,
  },
  datePickerItemSpacing: {
    marginRight: 8,
  },
  listButton: {
    backgroundColor: '#8D8D8D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
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
    flexDirection: 'row',
  },
  emailButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
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
  columnVisibilityHeaderPrimary: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
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
  
  // Show Dropdown Styles
  showDropdownContainer: {
    marginBottom: 12,
    width: '100%',
  },
 
  // Table Styles
  tableContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  tableHeaderCell: {
    // container for header scrollable cells
  },
  scrollableHeaderCell: {
    width: 120,
    paddingHorizontal: 8,
    minWidth: 120,
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
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    padding: 8,
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
  tableRowEven: {
    backgroundColor: '#F9F9F9',
  },
  tableRowOdd: {
    backgroundColor: '#FFFFFF',
  },
  tableCell: {
    padding: 0,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'MuseoSans-Regular',
  },
  stickyCellText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'MuseoSans-Regular',
  },
  linkText: {
    color: '#1976D2',
    textDecorationLine: 'underline',
  },
});

export default ShipmentsDocumentsScreen;