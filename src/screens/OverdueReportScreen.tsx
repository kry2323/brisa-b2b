import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';

const OverdueReportScreen = ({ route, navigation }: any) => {
  const { reportData } = route.params || {};
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  
  // Form state variables
  const [startDate, setStartDate] = useState('01/01/2023');
  const [endDate, setEndDate] = useState('31/12/2023');
  const [customerCode, setCustomerCode] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  
  // Mock table data
  const tableData = [
    { id: 1, date: '15/03/2023', customerCode: 'CUST001', invoiceNumber: 'INV001', amount: '1,250.00', daysOverdue: '30' },
    { id: 2, date: '22/04/2023', customerCode: 'CUST002', invoiceNumber: 'INV002', amount: '2,500.00', daysOverdue: '45' },
    { id: 3, date: '10/05/2023', customerCode: 'CUST003', invoiceNumber: 'INV003', amount: '500.00', daysOverdue: '15' },
    { id: 4, date: '18/06/2023', customerCode: 'CUST001', invoiceNumber: 'INV004', amount: '3,750.00', daysOverdue: '60' },
  ];
  
  // Handle list button press
  const handleList = () => {
    console.log('Filtering with:', { startDate, endDate, customerCode, invoiceNumber });
    // Here you would typically fetch data from an API with these filters
  };

  const handleNavigateToReport = (reportData: any) => {
    setIsReportsModalOpen(false);
    
    // Navigate based on report ID using React Navigation
    switch (reportData.id) {
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
          <Text style={styles.title}>Overdue Report</Text>
          
          {/* Filter Form */}
          <View style={styles.formContainer}>
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Start Date:</Text>
                <View style={styles.dateContainer}>
                  <View style={styles.dateInputContainer}>
                    <TextInput
                      style={styles.dateInput}
                      value={startDate}
                      onChangeText={setStartDate}
                      placeholder="DD/MM/YYYY"
                    />
                  </View>
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>End Date:</Text>
                <View style={styles.dateContainer}>
                  <View style={styles.dateInputContainer}>
                    <TextInput
                      style={styles.dateInput}
                      value={endDate}
                      onChangeText={setEndDate}
                      placeholder="DD/MM/YYYY"
                    />
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Customer Code:</Text>
                <TextInput
                  style={styles.textInput}
                  value={customerCode}
                  onChangeText={setCustomerCode}
                  placeholder="Enter customer code"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Invoice Number:</Text>
                <TextInput
                  style={styles.textInput}
                  value={invoiceNumber}
                  onChangeText={setInvoiceNumber}
                  placeholder="Enter invoice number"
                />
              </View>
            </View>
            
            <TouchableOpacity style={styles.listButton} onPress={handleList}>
              <Text style={styles.listButtonText}>List</Text>
            </TouchableOpacity>
          </View>
          
          {/* Table */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Date</Text>
              <Text style={styles.tableHeaderCell}>Customer</Text>
              <Text style={styles.tableHeaderCell}>Invoice</Text>
              <Text style={styles.tableHeaderCell}>Amount</Text>
              <Text style={styles.tableHeaderCell}>Days Overdue</Text>
            </View>
            
            {tableData.map((item, index) => (
              <View 
                key={item.id} 
                style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
              >
                <Text style={styles.tableCell}>{item.date}</Text>
                <Text style={styles.tableCell}>{item.customerCode}</Text>
                <Text style={styles.tableCell}>{item.invoiceNumber}</Text>
                <Text style={styles.tableCell}>{item.amount}</Text>
                <Text style={styles.tableCell}>{item.daysOverdue}</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
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
    alignSelf: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    width: '100%',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  formGroup: {
    width: '48%',
    marginBottom: 10,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInputContainer: {
    flex: 1,
    height: 40,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dateInput: {
    fontSize: 14,
    color: '#333',
  },
  textInput: {
    height: 40,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#333',
  },
  listButton: {
    backgroundColor: '#666',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  listButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    marginBottom: 20,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingVertical: 12,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingVertical: 10,
  },
  tableRowEven: {
    backgroundColor: '#FFFFFF',
  },
  tableRowOdd: {
    backgroundColor: '#F9F9F9',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default OverdueReportScreen;