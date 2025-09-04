import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { useReportNavigation } from '../utils/navigationUtils';
import { t } from '../utils/translations';

const FinancialReportsParentScreen = ({ route, navigation }: any) => {
  const { reportData } = route.params || {};
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Use centralized report navigation
  const handleNavigateToReport = useReportNavigation(navigation);
const financialReportOptions = [
    {
      id: 'brisa-payments',
      title: t('screens.brisaPayments.title'),
      description: t('common.viewAndManageBrisaPaymentReports'),
      icon: t('common.brisaPaymentsIcon'),
      screen: 'BrisaPayments'
    },
    {
      id: 'overdue-report',
      title: t('screens.overdueReport.title'),
      description: t('common.viewOverduePaymentReports'),
      icon: t('common.overdueReportIcon'),
      screen: 'OverdueReport'
    },
    {
      id: 'account-transactions',
      title: t('screens.accountTransactions.title'),
      description: t('common.viewAccountTransactionHistory'),
      icon: t('common.accountTransactionsIcon'),
      screen: 'AccountTransactions'
    },
    {
      id: 'shipments-documents',
      title: t('screens.shipmentsDocuments.title'),
      description: t('common.viewShipmentDocuments'),
      icon: '📦',
      screen: 'ShipmentsDocuments'
    },
    {
      id: 'sales-report',
      title: t('screens.salesReport.title'),
      description: t('common.viewSalesReports'),
      icon: '📈',
      screen: 'SalesReport'
    },
    {
      id: 'order-monitoring',
      title: t('screens.orderMonitoring.title'),
      description: t('common.monitorOrderStatus'),
      icon: '📋',
      screen: 'OrderMonitoring'
    },
    {
      id: 'tyres-on-the-way',
      title: t('screens.tyresOnTheWay.title'),
      description: t('common.trackTyresInTransit'),
      icon: '🚚',
      screen: 'TyresOnTheWay'
    },
    {
      id: 'pos-material-tracking',
      title: t('screens.posMaterialTracking.title'),
      description: t('common.trackPOSMaterials'),
      icon: '🏪',
      screen: 'POSMaterialTracking'
    }
  ];

  const handleOptionPress = (option: any) => {
    navigation.navigate(option.screen, { reportData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Financial Reports</Text>
          <Text style={styles.subtitle}>Select a report type to continue</Text>
          
          <View style={styles.optionsContainer}>
            {financialReportOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionCard}
                onPress={() => handleOptionPress(option)}
              >
                <View style={styles.optionIconContainer}>
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <Text style={styles.optionArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Footer />
      </ScrollView>
      <BottomNavigation 
        isReportsModalOpen={isReportsModalOpen} 
        setIsReportsModalOpen={setIsReportsModalOpen}
        onNavigateToReport={(reportData) => handleNavigateToReport(reportData, setIsReportsModalOpen)}
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
    minHeight: 500,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    alignSelf: 'flex-start',
  },
  optionsContainer: {
    width: '100%',
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  optionArrow: {
    fontSize: 20,
    color: '#D53439',
    fontWeight: 'bold',
  },
});

export default FinancialReportsParentScreen;
