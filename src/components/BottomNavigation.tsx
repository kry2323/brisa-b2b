import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, ScrollView } from 'react-native';

interface BottomNavigationProps {
  isReportsModalOpen: boolean;
  setIsReportsModalOpen: (isOpen: boolean) => void;
  onNavigateToReport: (reportData: any) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ isReportsModalOpen, setIsReportsModalOpen, onNavigateToReport }) => {
  const [activeTab, setActiveTab] = useState('create-order');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);

  const financialReports = [
    { id: 'brisa-payments', title: 'Brisa Payments', icon: '💳', url: '/b2b/cis/brisa-payments' },
    { id: 'overdue-report', title: 'Overdue Report', icon: '⏰', url: '/b2b/cis/invoice' },
    { id: 'account-transactions', title: 'Account Transactions', icon: '📊', url: '/b2b/cis/account-transaction' },
  ];

  const orderSalesReports = [
    { id: 'shipments-documents', title: 'Shipments, Documents and Status', icon: '📦', url: '/b2b/proforma/proforma-list' },
    { id: 'sales-report', title: 'Sales Report', icon: '📈', url: '/b2b/cis/dispatch-report' },
    { id: 'order-monitoring', title: 'Order Monitoring', icon: '👁️', url: '/b2b/cis/order-monitoring' },
    { id: 'tyres-on-the-way', title: 'Tyres On The Way', icon: '🚚', url: '/b2b/cis/tyres-on-the-way' },
    { id: 'pos-material-tracking', title: 'POS Material Tracking', icon: '🏪', url: '/b2b/proforma/branded-product-report' },
  ];

  const navigationItems = [
    {
      id: 'create-order',
      title: 'Sipariş Oluştur',
      icon: '📋',
      shortTitle: 'Sipariş',
    },
    {
      id: 'cart',
      title: 'Sepet',
      icon: '🛒',
      shortTitle: 'Sepet',
    },
    {
      id: 'reports',
      title: 'Raporlar',
      icon: '📊',
      shortTitle: 'Raporlar',
    },
    {
      id: 'finance',
      title: 'Finans Rapor',
      icon: '💰',
      shortTitle: 'Finans',
    },
    {
      id: 'marketing',
      title: 'Marketing',
      icon: '📈',
      shortTitle: 'Marketing',
    },
    {
      id: 'other',
      title: 'Diğer',
      icon: '☰',
      shortTitle: 'Diğer',
    },
  ];

  const menuItems = [
    { id: 'profile', title: 'Profil', icon: '👤' },
    { id: 'settings', title: 'Ayarlar', icon: '⚙️' },
    { id: 'help', title: 'Yardım', icon: '❓' },
    { id: 'about', title: 'Hakkında', icon: 'ℹ️' },
    { id: 'logout', title: 'Çıkış', icon: '🚪' },
  ];

  const handleTabPress = (tabId: string) => {
    if (tabId === 'other') {
      setIsMenuOpen(true);
    } else if (tabId === 'reports') {
      setIsReportsModalOpen(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const handleMenuItemPress = (itemId: string) => {
    setIsMenuOpen(false);
    // Menü item'ı için işlemler burada yapılacak
    console.log('Menu item pressed:', itemId);
  };

  const handleReportTypePress = (reportType: string) => {
    setSelectedReportType(reportType);
  };

  const handleReportItemPress = (report: any) => {
    console.log('Report item pressed:', report);
    onNavigateToReport(report);
  };

  const getReportItems = () => {
    switch (selectedReportType) {
      case 'financial':
        return financialReports;
      case 'order-sales':
        return orderSalesReports;
      default:
        return [];
    }
  };

  const getModalTitle = () => {
    switch (selectedReportType) {
      case 'financial':
        return 'Financial Reports';
      case 'order-sales':
        return 'Order & Sales Reports';
      default:
        return 'Reports';
    }
  };

  return (
    <>
      {!isReportsModalOpen && (
        <View style={styles.container}>
          {navigationItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.tabButton,
                activeTab === item.id && styles.activeTab,
              ]}
              onPress={() => handleTabPress(item.id)}
            >
              <Text style={[
                styles.tabIcon,
                activeTab === item.id && styles.activeTabIcon,
              ]}>
                {item.icon}
              </Text>
              <Text style={[
                styles.tabText,
                activeTab === item.id && styles.activeTabText,
              ]}>
                {item.shortTitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isMenuOpen}
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            onPress={() => setIsMenuOpen(false)}
          />
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menü</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsMenuOpen(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuItems}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item.id)}
                >
                  <Text style={styles.menuItemIcon}>{item.icon}</Text>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isReportsModalOpen}
        onRequestClose={() => setIsReportsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            onPress={() => setIsReportsModalOpen(false)}
          />
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>
                {selectedReportType ? getModalTitle() : 'Raporlar'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  if (selectedReportType) {
                    setSelectedReportType(null);
                  } else {
                    setIsReportsModalOpen(false);
                  }
                }}
              >
                <Text style={styles.closeButtonText}>
                  {selectedReportType ? '←' : '✕'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
              {!selectedReportType ? (
                // Show report categories
                <>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleReportTypePress('financial')}
                  >
                    <Text style={styles.menuItemIcon}>📊</Text>
                    <Text style={styles.menuItemText}>Mali Raporlar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleReportTypePress('order-sales')}
                  >
                    <Text style={styles.menuItemIcon}>📈</Text>
                    <Text style={styles.menuItemText}>Sipariş ve Satış Raporları</Text>
                  </TouchableOpacity>
                </>
              ) : (
                // Show specific reports
                getReportItems().map((report) => (
                  <TouchableOpacity
                    key={report.id}
                    style={styles.menuItem}
                    onPress={() => handleReportItemPress(report)}
                  >
                    <Text style={styles.menuItemIcon}>{report.icon}</Text>
                    <Text style={styles.menuItemText}>{report.title}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFF5F5',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 4,
    color: '#666',
  },
  activeTabIcon: {
    color: '#D53439',
  },
  tabText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'MuseoSans-Medium',
  },
  activeTabText: {
    color: '#D53439',
    fontWeight: '600',
    fontFamily: 'MuseoSans-Medium',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    backgroundColor: '#000000',
    zIndex: 99999,
    height: '100%',
    elevation: 99999,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '100%',
    paddingBottom: 50,
    zIndex: 100000,
    elevation: 100000,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'MuseoSans-Bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
  },
  menuItems: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 2,
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
    textAlign: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    fontFamily: 'MuseoSans-Medium',
  },
});

export default BottomNavigation;