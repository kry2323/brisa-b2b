import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import ExcelExport from '../components/ExcelExport';
import EmailSender from '../components/EmailSender';

const UnplannedOrdersScreen = ({ route, navigation }: any) => {
  const { reportData } = route.params || {};
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  
  // Form state
  const [startDate, setStartDate] = useState('30/12/2018');
  const [endDate, setEndDate] = useState('28/07/2025');
  const [orderNumber, setOrderNumber] = useState('');
  const [status, setStatus] = useState('');
  
  // Table data state
  const [tableData, setTableData] = useState([
    { orderNumber: 'ORD-2023-003', date: '05/03/2023', status: 'Unplanned', amount: '€12,450' },
    { orderNumber: 'ORD-2023-004', date: '18/04/2023', status: 'Unplanned', amount: '€7,890' },
  ]);
  
  // Column visibility state for Excel export
  const [columns, setColumns] = useState([
    { key: 'orderNumber', label: 'Order Number', visible: true },
    { key: 'date', label: 'Date', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'amount', label: 'Amount', visible: true },
  ]);
  
  // Email modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleList = () => {
    // In a real app, this would fetch data based on the form inputs
    console.log('Listing unplanned orders with filters:', { startDate, endDate, orderNumber, status });
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
          <Text style={styles.title}>Unplanned Orders</Text>
          
          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Date Range Row */}
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Order Date *</Text>
                <View style={styles.dateContainer}>
                  <View style={styles.dateInputContainer}>
                    <TextInput
                      style={styles.dateInput}
                      value={startDate}
                      onChangeText={setStartDate}
                    />
                  </View>
                  <View style={styles.dateInputContainer}>
                    <TextInput
                      style={styles.dateInput}
                      value={endDate}
                      onChangeText={setEndDate}
                    />
                  </View>
                </View>
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
            
            {/* Export Buttons Row */}
            <View style={[styles.formRow, styles.exportButtonsRow]}>
              <ExcelExport 
                data={tableData}
                visibleColumns={columns}
                fileName={`UnplannedOrders_${new Date().toISOString().split('T')[0]}`}
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
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Order Number</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Date</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Status</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Amount</Text>
            </View>
            
            {/* Table Rows */}
            {tableData.map((item, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.orderNumber}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.date}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.status}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.amount}</Text>
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
        reportName="UnplannedOrders"
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
    minHeight: 500,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
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
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  textInput: {
    height: 40,
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
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
  },
  listButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tableContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#666',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tableRowEven: {
    backgroundColor: '#F9F9F9',
  },
  tableRowOdd: {
    backgroundColor: '#FFF',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default UnplannedOrdersScreen;
