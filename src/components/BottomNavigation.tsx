import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, ScrollView, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

interface BottomNavigationProps {
  isReportsModalOpen: boolean;
  setIsReportsModalOpen: (isOpen: boolean) => void;
  onNavigateToReport: (reportData: any) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ isReportsModalOpen, setIsReportsModalOpen, onNavigateToReport }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMarketingModalOpen, setIsMarketingModalOpen] = useState(false);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const [isUploadOrderModalOpen, setIsUploadOrderModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  const [selectedOrderCategory, setSelectedOrderCategory] = useState<string | null>(null);

  const financialReports = [
    { id: 'account-transactions', title: 'Account Transactions', icon: '🧾', url: '/b2b/account-transactions' },
    { id: 'brisa-payments', title: 'Brisa Payments', icon: '💳', url: '/b2b/brisa-payments' },
    { id: 'overdue-report', title: 'Overdue Report', icon: '⏰', url: '/b2b/overdue-report' },
  ];

  const orderSalesReports = [
    { id: 'shipments-documents', title: 'Shipments, Documents and Status', icon: '📦', url: '/b2b/proforma/proforma-list' },
    { id: 'sales-report', title: 'Sales Report', icon: '📈', url: '/b2b/cis/dispatch-report' },
    { id: 'order-monitoring', title: 'Order Monitoring', icon: '👁️', url: '/b2b/cis/order-monitoring' },
    { id: 'tyres-on-the-way', title: 'Tyres On The Way', icon: '🚚', url: '/b2b/cis/tyres-on-the-way' },
    { id: 'pos-material-tracking', title: 'POS Material Tracking', icon: '🏪', url: '/b2b/proforma/branded-product-report' },
  ];
  
  const marketingItems = [
    { id: 'PRODUCT_PHOTO', title: 'Product Photos, Presentations', icon: '📸', url: '/b2b/cis-marketing-library/PRODUCT_PHOTO' },
    { id: 'CAMPAIGN_MATERIAL', title: 'Campaign Materials', icon: '🎯', url: '/b2b/cis-marketing-library/CAMPAIGN_MATERIAL' },
    { id: 'POS_MATERIAL', title: 'POS Materials', icon: '🏪', url: '/b2b/cis-marketing-library/POS_MATERIAL' },
    { id: 'SHOP_BRANDING', title: 'Shop Branding', icon: '🏬', url: '/b2b/cis-marketing-library/SHOP_BRANDING' },
    { id: 'LOGO_GUIDE', title: 'Logo Guidelines', icon: '🅻', url: '/b2b/cis-marketing-library/LOGO_GUIDE' },
    { id: 'PRODUCT_CATALOG', title: 'Catalogues, Leaflets, Posters', icon: '📚', url: '/b2b/cis-marketing-library/PRODUCT_CATALOG' },
    { id: 'VIDEO', title: 'Videos', icon: '🎬', url: '/b2b/cis-marketing-library/VIDEO' },
    { id: 'CAR_BRANDING', title: 'Car Branding', icon: '🚗', url: '/b2b/cis-marketing-library/CAR_BRANDING' },
    { id: 'SOCIAL_MEDIA_DATABASE', title: 'Social Media Database', icon: '📱', url: '/b2b/cis-marketing-library/SOCIAL_MEDIA_DATABASE' },
  ];

  const orderCategories = [
    {
      id: 'passenger-car',
      title: 'PASSENGER CAR',
      icon: '🚗',
      subCategories: [
        { id: 'psr-13-14', title: 'PSR 13-14', url: '/b2b/All-Categories/PASSENGER-CAR/PSR-13-14/c/CIS_PC_PSR13' },
        { id: 'psr-15', title: 'PSR 15', url: '/b2b/All-Categories/PASSENGER-CAR/PSR-15/c/CIS_PC_PSR15' },
        { id: 'psr-16', title: 'PSR 16', url: '/b2b/All-Categories/PASSENGER-CAR/PSR-16/c/CIS_PC_PSR16' },
        { id: 'uhp', title: 'UHP', url: '/b2b/All-Categories/PASSENGER-CAR/UHP/c/CIS_PC_UHP' },
        { id: '4x4', title: '4X4', url: '/b2b/All-Categories/PASSENGER-CAR/4X4/c/CIS_PC_4X4' },
      ],
    },
    {
      id: 'light-truck',
      title: 'LIGHT TRUCK',
      icon: '🚚',
      subCategories: [
        { id: 'lt-12', title: 'LT 12', url: '/b2b/All-Categories/LIGHT-TRUCK/LT-12/c/CIS_LT_LT12' },
        { id: 'lt-13', title: 'LT 13', url: '/b2b/All-Categories/LIGHT-TRUCK/LT-13/c/CIS_LT_LT13' },
        { id: 'lt-14', title: 'LT 14', url: '/b2b/All-Categories/LIGHT-TRUCK/LT-14/c/CIS_LT_LT14' },
        { id: 'lt-15', title: 'LT 15', url: '/b2b/All-Categories/LIGHT-TRUCK/LT-15/c/CIS_LT_LT15' },
        { id: 'lt-16', title: 'LT 16', url: '/b2b/All-Categories/LIGHT-TRUCK/LT-16/c/CIS_LT_LT16' },
      ],
    },
    {
      id: 'agriculture',
      title: 'AGRICULTURE',
      icon: '🚜',
      subCategories: [
        { id: 'ags-s', title: 'AGS-S', url: '/b2b/All-Categories/AGRICULTURE/AGS-S/c/CIS_AG_AGSS' },
        { id: 'ags-l', title: 'AGS-L', url: '/b2b/All-Categories/AGRICULTURE/AGS-L/c/CIS_AG_AGSL' },
        { id: 'agri', title: 'AGRI', url: '/b2b/All-Categories/AGRICULTURE/AGRI/c/CIS_AG_AGRI' },
      ],
    },
    {
      id: 'off-the-road',
      title: 'OFF THE ROAD',
      icon: '🏔️',
      subCategories: [
        { id: 'ors', title: 'ORS', url: '/b2b/All-Categories/OFF-THE-ROAD/ORS/c/CIS_OTR_ORS' },
      ],
    },
    {
      id: 'tbr',
      title: 'TBR',
      icon: '🚛',
      subCategories: [
        { id: 'tbr-17-5', title: 'TBR 17.5', url: '/b2b/All-Categories/TBR/TBR-17-5/c/CIS_TBR_TBR17' },
        { id: 'tbr-22-5', title: 'TBR 22.5', url: '/b2b/All-Categories/TBR/TBR-22-5/c/CIS_TBR_TBR22' },
      ],
    },
    {
      id: 'promotional-materials',
      title: 'PROMOTIONAL MATERIALS',
      icon: '🎁',
      subCategories: [
        { id: 'branded-consumer-products', title: 'Branded Consumer Products', url: '/b2b/All-Categories/Promotional-Materials-Order/c/CIS_PMO?q=%3Acis-name-asc%3ApatternDescription%3ABranded%2BConsumer%2BProducts&text=#' },
        { id: 'textile-products', title: 'Textile Products', url: '/b2b/All-Categories/Promotional-Materials-Order/c/CIS_PMO?q=%3Acis-name-asc%3ApatternDescription%3ATextile%2BProducts&text=#' },
        { id: 'stands-shop-branding-products', title: 'Stands & Shop Branding Products', url: '/b2b/All-Categories/Promotional-Materials-Order/c/CIS_PMO?q=%3Acis-name-asc%3ApatternDescription%3AStands%2B%2526%2BShop%2BBranding%2BProducts&text=#' },
      ],
    },
  ];

  const navigationItems = [
    {
      id: 'home',
      title: 'Homepage',
      icon: '🏠',
      shortTitle: 'Homepage',
    },
    {
      id: 'create-order',
      title: 'Create Order',
      icon: '📋',
      shortTitle: 'Create Order',
    },
    {
      id: 'order-sales',
      title: 'Order & Sales Reports',
      icon: '📊',
      shortTitle: 'Order & Sales Reports',
    },
    {
      id: 'financial',
      title: 'Financial Reports',
      icon: '💰',
      shortTitle: 'Financial Reports',
    },
    {
      id: 'marketing-library',
      title: 'Marketing Library',
      icon: '📚',
      shortTitle: 'Marketing Library',
    },
    {
      id: 'other',
      title: 'Other',
      icon: '☰',
      shortTitle: 'Other',
    },
  ];

  // Other menu now shows only Company, E Warranty and Links sections

  const handleTabPress = (tabId: string) => {
    if (tabId === 'other') {
      setActiveTab(tabId);
      setIsMenuOpen(true);
    } else if (tabId === 'order-sales') {
      setActiveTab(tabId);
      setIsReportsModalOpen(true);
    } else if (tabId === 'marketing-library') {
      setActiveTab(tabId);
      setIsMarketingModalOpen(true);
    } else if (tabId === 'create-order') {
      setActiveTab(tabId);
      // Open create order modal instead of direct navigation
      setIsCreateOrderModalOpen(true);
    } else if (tabId === 'upload-order') {
      setActiveTab(tabId);
      // Open upload order modal
      setIsUploadOrderModalOpen(true);
    } else if (tabId === 'financial') {
      setActiveTab(tabId);
      // Open financial reports modal
      setIsFinancialModalOpen(true);
    } else if (tabId === 'help') {
      setActiveTab(tabId);
      // Open help modal
      setIsHelpModalOpen(true);
    } else if (tabId === 'home') {
      setActiveTab(tabId);
      // Navigate to home/dashboard
      // @ts-ignore
      navigation.navigate('Dashboard');
    } else {
      setActiveTab(tabId);
    }
  };

  const handleMenuItemPress = (itemId: string) => {
    setIsMenuOpen(false);
    // Menü item'ı için işlemler burada yapılacak
    console.log('Menu item pressed:', itemId);
    
    if (itemId === 'lassa-team') {
      // Navigate to Lassa Team screen
      // @ts-ignore
      navigation.navigate('LassaTeam');
    } else if (itemId === 'company-news') {
      Linking.openURL('/b2b/cis-marketing-library/COMPANY_NEWS').catch(() => {});
    } else if (itemId === 'e-warranty') {
      Linking.openURL('https://egaranti.brisa-online.com/Authentication/Login').catch(() => {});
    } else if (itemId === 'new-dimension-request') {
      Linking.openURL('/b2b/cis-new-dimension/get').catch(() => {});
    } else if (itemId === 'brisa-academy') {
      Linking.openURL('https://portal.brisaakademi.com.tr/').catch(() => {});
    } else if (itemId === 'european-label-regulation') {
      Linking.openURL('/b2b/cis/european-label-regulation').catch(() => {});
    } else if (itemId === 'marketing-library') {
      // Open Marketing Library modal from Other tab
      setIsMarketingModalOpen(true);
    }
  };

  const handleReportTypePress = (reportType: string) => {
    setSelectedReportType(reportType);
  };

  const handleReportItemPress = (report: any) => {
    console.log('Report item pressed:', report);
    onNavigateToReport(report);
    setIsReportsModalOpen(false);
  };

  const closeAllModals = () => {
    setIsReportsModalOpen(false);
    setIsMenuOpen(false);
    setIsMarketingModalOpen(false);
    setIsFinancialModalOpen(false);
    setIsUploadOrderModalOpen(false);
    setIsHelpModalOpen(false);
    setIsCreateOrderModalOpen(false);
  };

  const handleForwardedTabPress = (tabId: string) => {
    closeAllModals();
    handleTabPress(tabId);
  };

  const renderModalBottomTapLayer = () => (
    <View style={styles.modalTapLayer}>
      <View style={styles.tapRow}>
        {navigationItems.map((item) => (
          <TouchableOpacity
            key={`tap-${item.id}`}
            style={styles.tapZone}
            onPress={() => handleForwardedTabPress(item.id)}
          />
        ))}
      </View>
    </View>
  );
  
  const handleOrderCategoryPress = (categoryId: string) => {
    setSelectedOrderCategory(categoryId);
  };
  
  const handleOrderSubCategoryPress = (subCategory: any) => {
    console.log('Order subcategory pressed:', subCategory);
    setIsCreateOrderModalOpen(false);
    // Navigate to the product listing with the selected category
    // @ts-ignore
    navigation.navigate('ProductListing', { categoryUrl: subCategory.url });
  };
  
  const handleMarketingItemPress = (item: any) => {
    console.log(`Marketing item pressed: ${item.id}`);
    setIsMarketingModalOpen(false);
    // Navigate to marketing item based on ID
    switch (item.id) {
      case 'VIDEO':
        // @ts-ignore
        navigation.navigate('VideoLibrary');
        break;
      case 'PRODUCT_PHOTO':
        // @ts-ignore
        navigation.navigate('ProductListing');
        break;
      case 'CAMPAIGN_MATERIAL':
        // @ts-ignore
        navigation.navigate('Dashboard');
        break;
      case 'SOCIAL_MEDIA_DATABASE':
        // @ts-ignore
        navigation.navigate('Dashboard');
        break;
      case 'PRODUCT_CATALOG':
        // @ts-ignore
        navigation.navigate('Dashboard');
        break;
      case 'POS_MATERIAL':
      case 'SHOP_BRANDING':
      case 'LOGO_GUIDE':
      case 'CAR_BRANDING':
        // @ts-ignore
        navigation.navigate('Dashboard');
        break;
      default:
        // @ts-ignore
        navigation.navigate('Dashboard');
        break;
    }
  };

  // Sync active tab with current route
  useEffect(() => {
    const routeName = (route as any)?.name;
    const params = (route as any)?.params || {};

    const routeToTab: Record<string, string> = {
      Dashboard: 'home',
      Home: 'home',
      ShipmentsDocuments: 'order-sales',
      SalesReport: 'order-sales',
      OrderMonitoring: 'order-sales',
      PlannedOrders: 'order-sales',
      UnplannedOrders: 'order-sales',
      TyresOnTheWay: 'order-sales',
      POSMaterialTracking: 'order-sales',
      BrisaPayments: 'financial',
      OverdueReport: 'financial',
      AccountTransactions: 'financial',
      FinancialReports: 'financial',
      VideoLibrary: 'marketing-library',
      VideoDetail: 'marketing-library',
      VideoPlayer: 'marketing-library',
      LassaTeam: 'other',
    };

    let nextActive: string | undefined = routeToTab[routeName];

    // Special case: ProductListing can come from Create Order
    if (routeName === 'ProductListing') {
      if (params && (params as any).categoryUrl) {
        nextActive = 'create-order';
      }
    }

    if (nextActive && nextActive !== activeTab) {
      setActiveTab(nextActive);
    }
  }, [route]);

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
  
  // Combine all reports for direct access
  // Removed combined report list; reports are split into separate tabs now

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
            <View style={styles.tabIconWrapper}>
              <Text style={[
                styles.tabIcon,
                activeTab === item.id && styles.activeTabIcon,
              ]}>
                {item.icon}
              </Text>
            </View>
            <View style={styles.tabLabelWrapper}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === item.id && styles.activeTabText,
                ]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.shortTitle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
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
              {/* Company Section */}
              <View style={styles.menuSectionHeader}>
                <Text style={styles.menuSectionHeaderIcon}>🏢</Text>
                <Text style={styles.menuSectionHeaderText}>Company</Text>
              </View>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('company-news')}
              >
                <Text style={styles.menuItemIcon}>📰</Text>
                <Text style={styles.menuItemText}>Company News</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('lassa-team')}
              >
                <Text style={styles.menuItemIcon}>👥</Text>
                <Text style={styles.menuItemText}>Your Lassa Team</Text>
              </TouchableOpacity>

              {/* E Warranty direct link */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('e-warranty')}
              >
                <Text style={styles.menuItemIcon}>🧾</Text>
                <Text style={styles.menuItemText}>E Warranty</Text>
              </TouchableOpacity>

              {/* Links Section */}
              <View style={styles.menuSectionHeader}>
                <Text style={styles.menuSectionHeaderIcon}>🔗</Text>
                <Text style={styles.menuSectionHeaderText}>Links</Text>
              </View>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('new-dimension-request')}
              >
                <Text style={styles.menuItemIcon}>📝</Text>
                <Text style={styles.menuItemText}>New Dimension Request Form</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('brisa-academy')}
              >
                <Text style={styles.menuItemIcon}>🎓</Text>
                <Text style={styles.menuItemText}>Brisa Academy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('european-label-regulation')}
              >
                <Text style={styles.menuItemIcon}>🇪🇺</Text>
                <Text style={styles.menuItemText}>European Label Regulation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {renderModalBottomTapLayer()}
      </Modal>

      {/* Marketing Library Modal (moved under Other tab) */}
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        visible={isMarketingModalOpen}
        onRequestClose={() => setIsMarketingModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            onPress={() => setIsMarketingModalOpen(false)}
          />
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Marketing Library</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsMarketingModalOpen(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
              {marketingItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => handleMarketingItemPress(item)}
                >
                  <Text style={styles.menuItemIcon}>{item.icon}</Text>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        {renderModalBottomTapLayer()}
      </Modal>

      {/* Upload Order Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        visible={isUploadOrderModalOpen}
        onRequestClose={() => setIsUploadOrderModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            onPress={() => setIsUploadOrderModalOpen(false)}
          />
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Sipariş Yükle</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsUploadOrderModalOpen(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.uploadContainer}>
              <View style={styles.menuSectionHeader}>
                <Text style={styles.menuSectionHeaderIcon}>📤</Text>
                <Text style={styles.menuSectionHeaderText}>Excel ile Sipariş Yükle</Text>
              </View>
              <Text style={styles.uploadDescription}>
                Excel dosyanızı yükleyerek toplu sipariş oluşturabilirsiniz. Lütfen şablona uygun bir dosya kullanın.
              </Text>
              <TouchableOpacity style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Dosya Seç</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.downloadTemplateButton}>
                <Text style={styles.downloadTemplateText}>Şablonu İndir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {renderModalBottomTapLayer()}
      </Modal>

      {/* Create Order Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        visible={isCreateOrderModalOpen}
        onRequestClose={() => setIsCreateOrderModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            onPress={() => setIsCreateOrderModalOpen(false)}
          />
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Sipariş Oluştur</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsCreateOrderModalOpen(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
              {orderCategories.map((category) => (
                <View key={category.id} style={styles.orderCategoryContainer}>
                  <TouchableOpacity 
                    style={styles.orderCategoryHeader}
                    onPress={() => handleOrderCategoryPress(category.id)}
                  >
                    <Text style={styles.orderCategoryIcon}>{category.icon}</Text>
                    <Text style={styles.orderCategoryTitle}>{category.title}</Text>
                    <Text style={styles.orderCategoryArrow}>
                      {selectedOrderCategory === category.id ? '▼' : '▶'}
                    </Text>
                  </TouchableOpacity>
                  
                  {selectedOrderCategory === category.id && (
                    <View style={styles.orderSubCategoriesContainer}>
                      {category.subCategories.map((subCategory) => (
                        <TouchableOpacity 
                          key={subCategory.id}
                          style={styles.orderSubCategoryItem}
                          onPress={() => handleOrderSubCategoryPress(subCategory)}
                        >
                          <Text style={styles.orderSubCategoryText}>{subCategory.title}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        {renderModalBottomTapLayer()}
      </Modal>

      {/* Help Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        visible={isHelpModalOpen}
        onRequestClose={() => setIsHelpModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            onPress={() => setIsHelpModalOpen(false)}
          />
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Yardım</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsHelpModalOpen(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
              <View style={styles.menuSectionHeader}>
                <Text style={styles.menuSectionHeaderIcon}>📞</Text>
                <Text style={styles.menuSectionHeaderText}>Bize Ulaşın</Text>
              </View>
              <TouchableOpacity style={styles.helpItem}>
                <Text style={styles.helpItemIcon}>📱</Text>
                <Text style={styles.helpItemText}>+90 212 123 45 67</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.helpItem}>
                <Text style={styles.helpItemIcon}>✉️</Text>
                <Text style={styles.helpItemText}>destek@brisa.com.tr</Text>
              </TouchableOpacity>
              
              <View style={styles.menuSectionHeader}>
                <Text style={styles.menuSectionHeaderIcon}>📚</Text>
                <Text style={styles.menuSectionHeaderText}>Sık Sorulan Sorular</Text>
              </View>
              <TouchableOpacity style={styles.helpItem}>
                <Text style={styles.helpItemIcon}>❓</Text>
                <Text style={styles.helpItemText}>Sipariş nasıl oluşturabilirim?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.helpItem}>
                <Text style={styles.helpItemIcon}>❓</Text>
                <Text style={styles.helpItemText}>Ödeme seçenekleri nelerdir?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.helpItem}>
                <Text style={styles.helpItemIcon}>❓</Text>
                <Text style={styles.helpItemText}>Siparişimi nasıl takip edebilirim?</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
        {renderModalBottomTapLayer()}
      </Modal>

      {/* Order & Sales Reports Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
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
              <Text style={styles.menuTitle}>Order & Sales Reports</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsReportsModalOpen(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
              {orderSalesReports.map((report) => (
                <TouchableOpacity
                  key={report.id}
                  style={styles.menuItem}
                  onPress={() => handleReportItemPress(report)}
                >
                  <Text style={styles.menuItemIcon}>{report.icon}</Text>
                  <Text style={styles.menuItemText}>{report.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        {renderModalBottomTapLayer()}
      </Modal>

      {/* Financial Reports Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        visible={isFinancialModalOpen}
        onRequestClose={() => setIsFinancialModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            onPress={() => setIsFinancialModalOpen(false)}
          />
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Financial Reports</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsFinancialModalOpen(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
              {financialReports.map((report) => (
                <TouchableOpacity
                  key={report.id}
                  style={styles.menuItem}
                  onPress={() => {
                    handleReportItemPress(report);
                    setIsFinancialModalOpen(false);
                  }}
                >
                  <Text style={styles.menuItemIcon}>{report.icon}</Text>
                  <Text style={styles.menuItemText}>{report.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        {renderModalBottomTapLayer()}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 90,
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
  menuSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuSectionHeaderIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
    textAlign: 'center',
    color: '#D53439',
  },
  menuSectionHeaderText: {
    fontSize: 18,
    color: '#D53439',
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
  },
  uploadContainer: {
    padding: 20,
  },
  uploadDescription: {
    fontSize: 16,
    color: '#333',
    marginVertical: 15,
    lineHeight: 22,
  },
  uploadButton: {
    backgroundColor: '#D53439',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  downloadTemplateButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#D53439',
  },
  downloadTemplateText: {
    color: '#D53439',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  helpItemIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
    textAlign: 'center',
  },
  helpItemText: {
    fontSize: 16,
    color: '#333',
  },
  // Order Category Styles
  orderCategoryContainer: {
    marginBottom: 5,
  },
  orderCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  orderCategoryIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
    textAlign: 'center',
    color: '#D53439',
  },
  orderCategoryTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
  },
  orderCategoryArrow: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  orderSubCategoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingLeft: 40,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
    marginLeft: 20,
  },
  orderSubCategoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderSubCategoryText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'MuseoSans-Medium',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  tabIconWrapper: {
    height: 26,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  tabLabelWrapper: {
    height: 28,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 2,
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
  modalTapLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    backgroundColor: 'transparent',
    zIndex: 1000000,
    elevation: 1000000,
  },
  tapRow: {
    flex: 1,
    flexDirection: 'row',
  },
  tapZone: {
    flex: 1,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 80,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 99999,
    elevation: 99999,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 80,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 0,
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