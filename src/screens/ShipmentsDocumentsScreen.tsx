import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import DatePicker from '../components/DatePicker';
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import ExcelExport from '../components/ExcelExport';
import EmailSender from '../components/EmailSender';
import { downloadBundledPdf } from '../utils/pdfAssets';
import ColumnVisibilityModal from '../components/ColumnVisibilityModal';
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
  
  // Table data state
  const [tableData, setTableData] = useState([
    { 
      planNo: '3500057880', invoiceNo: '9280033872', invoiceQty: '1,062',
      netValue: '10,620', currency: 'EUR', incoterm: 'FOB',
      etd: '01/06/2024', eta: '10/06/2024', shipmentDate: '02/06/2024',
      agent: 'DHL', containerPlateNo: 'TR-34 ABC 123'
    },
    { 
      planNo: '3500058173', invoiceNo: '9280034066', invoiceQty: '1,264',
      netValue: '12,640', currency: 'EUR', incoterm: 'CIF',
      etd: '05/06/2024', eta: '14/06/2024', shipmentDate: '06/06/2024',
      agent: 'UPS', containerPlateNo: 'TR-06 XYZ 789'
    },
    { 
      planNo: '3500058234', invoiceNo: '9280034155', invoiceQty: '856',
      netValue: '8,560', currency: 'USD', incoterm: 'EXW',
      etd: '08/06/2024', eta: '18/06/2024', shipmentDate: '09/06/2024',
      agent: 'FedEx', containerPlateNo: 'TR-35 DEF 456'
    },
    { 
      planNo: '3500058345', invoiceNo: '9280034244', invoiceQty: '2,150',
      netValue: '21,500', currency: 'EUR', incoterm: 'DDP',
      etd: '12/06/2024', eta: '22/06/2024', shipmentDate: '13/06/2024',
      agent: 'TNT', containerPlateNo: 'TR-07 GHI 789'
    },
    { 
      planNo: '3500058456', invoiceNo: '9280034333', invoiceQty: '1,890',
      netValue: '18,900', currency: 'GBP', incoterm: 'FCA',
      etd: '15/06/2024', eta: '25/06/2024', shipmentDate: '16/06/2024',
      agent: 'DHL', containerPlateNo: 'TR-16 JKL 012'
    },
    { 
      planNo: '3500058567', invoiceNo: '9280034422', invoiceQty: '3,240',
      netValue: '32,400', currency: 'EUR', incoterm: 'CPT',
      etd: '18/06/2024', eta: '28/06/2024', shipmentDate: '19/06/2024',
      agent: 'UPS', containerPlateNo: 'TR-42 MNO 345'
    },
    { 
      planNo: '3500058678', invoiceNo: '9280034511', invoiceQty: '1,567',
      netValue: '15,670', currency: 'USD', incoterm: 'DAP',
      etd: '21/06/2024', eta: '01/07/2024', shipmentDate: '22/06/2024',
      agent: 'FedEx', containerPlateNo: 'TR-01 PQR 678'
    },
    { 
      planNo: '3500058789', invoiceNo: '9280034600', invoiceQty: '2,890',
      netValue: '28,900', currency: 'EUR', incoterm: 'FAS',
      etd: '24/06/2024', eta: '04/07/2024', shipmentDate: '25/06/2024',
      agent: 'TNT', containerPlateNo: 'TR-26 STU 901'
    },
    { 
      planNo: '3500058890', invoiceNo: '9280034699', invoiceQty: '1,234',
      netValue: '12,340', currency: 'GBP', incoterm: 'DAT',
      etd: '27/06/2024', eta: '07/07/2024', shipmentDate: '28/06/2024',
      agent: 'DHL', containerPlateNo: 'TR-34 VWX 234'
    },
    { 
      planNo: '3500058901', invoiceNo: '9280034788', invoiceQty: '4,567',
      netValue: '45,670', currency: 'EUR', incoterm: 'CIP',
      etd: '30/06/2024', eta: '10/07/2024', shipmentDate: '01/07/2024',
      agent: 'UPS', containerPlateNo: 'TR-06 YZA 567'
    },
    { 
      planNo: '3500059012', invoiceNo: '9280034877', invoiceQty: '2,345',
      netValue: '23,450', currency: 'USD', incoterm: 'FOB',
      etd: '03/07/2024', eta: '13/07/2024', shipmentDate: '04/07/2024',
      agent: 'FedEx', containerPlateNo: 'TR-35 BCD 890'
    },
    { 
      planNo: '3500059123', invoiceNo: '9280034966', invoiceQty: '1,789',
      netValue: '17,890', currency: 'EUR', incoterm: 'CIF',
      etd: '06/07/2024', eta: '16/07/2024', shipmentDate: '07/07/2024',
      agent: 'TNT', containerPlateNo: 'TR-07 EFG 123'
    },
  ]);
  
  // Column visibility state for Excel export
  const [columns, setColumns] = useState([
    { key: 'planNo', label: 'Plan No', visible: true },
    { key: 'invoiceNo', label: 'Invoice No', visible: true },
    { key: 'invoiceQty', label: 'Invoice Qty', visible: true },
    { key: 'netValue', label: 'Net Value', visible: true },
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
    console.log('Listing with filters:', { startDate, endDate, planNo, invoiceNo });
    // For now we'll just use the mock data already set
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
        console.log('Unknown report type');
    }
  };

  // Visible columns and horizontal scroll config
  const visibleCols = columns.filter(col => col.visible);
  const isScrollable = visibleCols.length > 4;
  const COLUMN_WIDTH = 120; // Reduced from 160 to 120
  const VISIBLE_COLUMNS_COUNT = 4; // Always show only 4 columns
  
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Shipments, Documents and Status</Text>
          
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
          
                     {/* Table Section */}
           <View style={styles.tableContainer}>
             <ScrollView horizontal showsHorizontalScrollIndicator={isScrollable}>
               <View style={{ width: visibleCols.length * COLUMN_WIDTH }}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  {visibleCols.map((column) => (
                    <Text 
                      key={column.key} 
                      style={[
                        styles.tableHeaderCell,
                        { width: COLUMN_WIDTH, flex: undefined }
                      ]}
                    >
                      {column.label}
                    </Text>
                  ))}
                </View>
                
                                 {/* Table Rows */}
                 {paginatedData.map((item, index) => (
                  <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                    {visibleCols.map((column) => {
                      if (column.key === 'planNo') {
                        const clickable = (item.planNo?.startsWith('35') || item.planNo?.endsWith('35'));
                        return clickable ? (
                          <TouchableOpacity key={column.key} style={{ width: COLUMN_WIDTH }} onPress={() => handlePlanDraftDownload(item.planNo)}>
                            <Text style={[styles.tableCell, styles.linkText]}>{item.planNo}</Text>
                          </TouchableOpacity>
                        ) : (
                          <Text 
                            key={column.key} 
                            style={[styles.tableCell, { width: COLUMN_WIDTH, flex: undefined }]}
                          >
                            {item.planNo}
                          </Text>
                        );
                      }
                      if (column.key === 'invoiceNo') {
                        return (
                          <TouchableOpacity key={column.key} style={{ width: COLUMN_WIDTH }} onPress={handleInvoiceDownload}>
                            <Text style={[styles.tableCell, styles.linkText]}>{item.invoiceNo}</Text>
                          </TouchableOpacity>
                        );
                      }
                      return (
                        <Text 
                          key={column.key} 
                          style={[styles.tableCell, { width: COLUMN_WIDTH, flex: undefined }]}
                        >
                          {(item as any)[column.key]}
                        </Text>
                      );
                    })}
                  </View>
                ))}
                             </View>
             </ScrollView>
           </View>
           
           {/* Pagination */}
           <Pagination
             currentPage={currentPage}
             totalPages={totalPages}
             totalItems={totalItems}
             itemsPerPage={itemsPerPage}
             onPageChange={handlePageChange}
           />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  exportButtonsRow: {
    marginTop: 15,
    justifyContent: 'space-between',
  },
  exportButton: {
    backgroundColor: '#4CAF50',
    width: '48%',
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
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    minHeight: 500,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  
  // Form Styles
  formContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
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
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerItem: {
    flex: 1
  },
  datePickerItemSpacing: {
    marginRight: 10
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    height: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    fontSize: 16,
  },
  listButton: {
    backgroundColor: '#8D8D8D',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
  },
  listButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Column Visibility Button Styles
  columnVisibilityHeader: {
    backgroundColor: '#424242',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
     columnVisibilityHeaderText: {
     color: '#FFFFFF',
     fontSize: 16,
     fontWeight: 'bold',
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
   
   // Show Dropdown Styles
   showDropdownContainer: {
     marginBottom: 12,
     alignItems: 'flex-start',
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
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#666',
    padding: 8,
  },
  tableHeaderCell: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    padding: 8,
  },
  tableRowEven: {
    backgroundColor: '#F9F9F9',
  },
  tableRowOdd: {
    backgroundColor: '#FFFFFF',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#333',
  },
  linkText: {
    color: '#1976D2',
    textDecorationLine: 'underline',
  },
});

export default ShipmentsDocumentsScreen;