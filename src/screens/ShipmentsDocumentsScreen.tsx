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
    { planNo: '3500057880', invoiceNo: '9280033872', invoiceQty: '1,062' },
    { planNo: '3500058173', invoiceNo: '9280034066', invoiceQty: '1,264' },
  ]);
  
  // Column visibility state for Excel export
  const [columns, setColumns] = useState([
    { key: 'planNo', label: 'Plan No', visible: true },
    { key: 'invoiceNo', label: 'Invoice No', visible: true },
    { key: 'invoiceQty', label: 'Invoice Qty', visible: true },
  ]);
  
  // Email modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

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
          
          {/* Table Section */}
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Plan No</Text>
              <Text style={styles.tableHeaderCell}>Invoice No</Text>
              <Text style={styles.tableHeaderCell}>Invoice Qty</Text>
            </View>
            
            {/* Table Rows */}
            {tableData.map((item, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                {(item.planNo?.startsWith('35') || item.planNo?.endsWith('35')) ? (
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => handlePlanDraftDownload(item.planNo)}>
                    <Text style={[styles.tableCell, styles.linkText]}>{item.planNo}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.tableCell}>{item.planNo}</Text>
                )}
                <TouchableOpacity style={{ flex: 1 }} onPress={handleInvoiceDownload}>
                  <Text style={[styles.tableCell, styles.linkText]}>{item.invoiceNo}</Text>
                </TouchableOpacity>
                <Text style={styles.tableCell}>{item.invoiceQty}</Text>
              </View>
            ))}
          </View>
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
    padding: 12,
  },
  tableHeaderCell: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    padding: 12,
  },
  tableRowEven: {
    backgroundColor: '#F9F9F9',
  },
  tableRowOdd: {
    backgroundColor: '#FFFFFF',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  linkText: {
    color: '#1976D2',
    textDecorationLine: 'underline',
  },
});

export default ShipmentsDocumentsScreen;