import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';

import Snap from './src/components/Snap';

import Login from './components/Login';
import Header from './src/components/Header';
import Banner from './src/components/Banner';
import OrderOperations from './src/components/OrderOperations';
import Marketing from './src/components/Marketing';
import Reports from './src/components/Reports';
import Footer from './src/components/Footer';
import BottomNavigation from './src/components/BottomNavigation';
import BrisaPaymentsScreen from './src/screens/BrisaPaymentsScreen';
import OverdueReportScreen from './src/screens/OverdueReportScreen';
import AccountTransactionsScreen from './src/screens/AccountTransactionsScreen';
import ShipmentsDocumentsScreen from './src/screens/ShipmentsDocumentsScreen';
import SalesReportScreen from './src/screens/SalesReportScreen';
import OrderMonitoringScreen from './src/screens/OrderMonitoringScreen';
import OrderMonitoringParentScreen from './src/screens/OrderMonitoringParentScreen';
import PlannedOrdersScreen from './src/screens/PlannedOrdersScreen';
import UnplannedOrdersScreen from './src/screens/UnplannedOrdersScreen';
import FinancialReportsParentScreen from './src/screens/FinancialReportsParentScreen';
import TyresOnTheWayScreen from './src/screens/TyresOnTheWayScreen';
import POSMaterialTrackingScreen from './src/screens/POSMaterialTrackingScreen';
import ProductListingScreen from './src/screens/ProductListingScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';

const Stack = createNativeStackNavigator();

// Login ekranı bileşeni
function LoginScreen({ navigation }: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
      <StatusBar style="light" backgroundColor="#383838" />
      <Login onLogin={() => navigation.navigate('Dashboard')} />
    </SafeAreaView>
  );
}

// Ana sayfa bileşeni (Dashboard)
function DashboardScreen({ navigation }: any) {
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Handle navigation to report screens
  const handleNavigateToReport = (reportData: any) => {
    console.log('Navigation triggered for:', reportData);
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

  // Ana sayfa render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#383838" />
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Snap />
        <Banner />
        <Footer />
      </ScrollView>
      <BottomNavigation 
        isReportsModalOpen={isReportsModalOpen} 
        setIsReportsModalOpen={setIsReportsModalOpen}
        onNavigateToReport={handleNavigateToReport}
      />
    </SafeAreaView>
  );
}

// Linking konfigürasyonu
const linking = {
  prefixes: ['http://localhost:8081', 'https://localhost:8081', 'http://localhost:8082', 'http://localhost:8083'],
  config: {
    screens: {
      Home: '/',
      ProductListing: '/products',
      BrisaPayments: {
        path: '/reports/brisa-payments',
        parse: {
          reportData: (reportData: string) => {
            try {
              return JSON.parse(decodeURIComponent(reportData));
            } catch {
              return null;
            }
          },
        },
        stringify: {
          reportData: (reportData: any) => {
            return encodeURIComponent(JSON.stringify(reportData));
          },
        },
      },
      OverdueReport: {
        path: '/reports/overdue-report',
        parse: {
          reportData: (reportData: string) => {
            try {
              return JSON.parse(decodeURIComponent(reportData));
            } catch {
              return null;
            }
          },
        },
        stringify: {
          reportData: (reportData: any) => {
            return encodeURIComponent(JSON.stringify(reportData));
          },
        },
      },
      AccountTransactions: {
        path: '/reports/account-transactions',
        parse: {
          reportData: (reportData: string) => {
            try {
              return JSON.parse(decodeURIComponent(reportData));
            } catch {
              return null;
            }
          },
        },
        stringify: {
          reportData: (reportData: any) => {
            return encodeURIComponent(JSON.stringify(reportData));
          },
        },
      },
      ShipmentsDocuments: {
        path: '/reports/shipments-documents',
        parse: {
          reportData: (reportData: string) => {
            try {
              return JSON.parse(decodeURIComponent(reportData));
            } catch {
              return null;
            }
          },
        },
        stringify: {
          reportData: (reportData: any) => {
            return encodeURIComponent(JSON.stringify(reportData));
          },
        },
      },
      SalesReport: {
        path: '/reports/sales-report',
        parse: {
          reportData: (reportData: string) => {
            try {
              return JSON.parse(decodeURIComponent(reportData));
            } catch {
              return null;
            }
          },
        },
        stringify: {
          reportData: (reportData: any) => {
            return encodeURIComponent(JSON.stringify(reportData));
          },
        },
      },
      OrderMonitoring: {
        path: '/reports/order-monitoring',
        parse: {
          reportData: (reportData: string) => {
            try {
              return JSON.parse(decodeURIComponent(reportData));
            } catch {
              return null;
            }
          },
        },
        stringify: {
          reportData: (reportData: any) => {
            return encodeURIComponent(JSON.stringify(reportData));
          },
        },
      },
      TyresOnTheWay: {
        path: '/reports/tyres-on-the-way',
        parse: {
          reportData: (reportData: string) => {
            try {
              return JSON.parse(decodeURIComponent(reportData));
            } catch {
              return null;
            }
          },
        },
        stringify: {
          reportData: (reportData: any) => {
            return encodeURIComponent(JSON.stringify(reportData));
          },
        },
      },
      POSMaterialTracking: {
        path: '/reports/pos-material-tracking',
        parse: {
          reportData: (reportData: string) => {
            try {
              return JSON.parse(decodeURIComponent(reportData));
            } catch {
              return null;
            }
          },
        },
        stringify: {
          reportData: (reportData: any) => {
            return encodeURIComponent(JSON.stringify(reportData));
          },
        },
      },
      FinancialReports: {
        path: '/reports/financial-reports',
        parse: {
          reportData: (reportData: string) => {
            try {
              return JSON.parse(decodeURIComponent(reportData));
            } catch {
              return null;
            }
          },
        },
        stringify: {
          reportData: (reportData: any) => {
            return encodeURIComponent(JSON.stringify(reportData));
          },
        },
      },
      PlannedOrders: {
        path: '/reports/planned-orders',
        parse: {
          reportData: (reportData: string) => {
            try {
              return JSON.parse(decodeURIComponent(reportData));
            } catch {
              return null;
            }
          },
        },
        stringify: {
          reportData: (reportData: any) => {
            return encodeURIComponent(JSON.stringify(reportData));
          },
        },
      },
      UnplannedOrders: {
        path: '/reports/unplanned-orders',
        parse: {
          reportData: (reportData: string) => {
            try {
              return JSON.parse(decodeURIComponent(reportData));
            } catch {
              return null;
            }
          },
        },
        stringify: {
          reportData: (reportData: any) => {
            return encodeURIComponent(JSON.stringify(reportData));
          },
        },
      },
      ProductDetail: {
        path: '/product/:productId',
        parse: {
          product: (product: string) => {
            try {
              return JSON.parse(decodeURIComponent(product));
            } catch {
              return null;
            }
          },
        },
        stringify: {
          product: (product: any) => {
            return encodeURIComponent(JSON.stringify(product));
          },
        },
      },
    },
  },
};

// Font yükleme fonksiyonu
const loadFonts = async () => {
  await Font.loadAsync({
    'MuseoSans-Regular': require('./assets/fonts/MuseoSans-Regular.ttf'),
    'MuseoSans-Medium': require('./assets/fonts/MuseoSans-Medium.ttf'),
    'MuseoSans-Bold': require('./assets/fonts/MuseoSans-Bold.ttf'),
  });
};

// Ana App bileşeni
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return null; // Fontlar yüklenene kadar loading göster
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Header'ları gizle çünkü kendi Header bileşenimiz var
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Home" component={DashboardScreen} />
        <Stack.Screen 
          name="ProductListing" 
          component={ProductListingScreen} 
          options={{ title: 'Product Listing' }}
        />
        <Stack.Screen 
          name="BrisaPayments" 
          component={BrisaPaymentsScreen} 
          options={{ title: 'Brisa Payments' }}
        />
        <Stack.Screen 
          name="OverdueReport" 
          component={OverdueReportScreen} 
          options={{ title: 'Overdue Report' }}
        />
        <Stack.Screen 
          name="AccountTransactions" 
          component={AccountTransactionsScreen} 
          options={{ title: 'Account Transactions' }}
        />
        <Stack.Screen 
          name="ShipmentsDocuments" 
          component={ShipmentsDocumentsScreen} 
          options={{ title: 'Shipments, Documents and Status' }}
        />
        <Stack.Screen 
          name="SalesReport" 
          component={SalesReportScreen} 
          options={{ title: 'Sales Report' }}
        />
        <Stack.Screen 
          name="OrderMonitoring" 
          component={OrderMonitoringParentScreen} 
          options={{ title: 'Order Monitoring' }}
        />
        <Stack.Screen 
          name="PlannedOrders" 
          component={PlannedOrdersScreen} 
          options={{ title: 'Planned Orders' }}
        />
        <Stack.Screen 
          name="UnplannedOrders" 
          component={UnplannedOrdersScreen} 
          options={{ title: 'Unplanned Orders' }}
        />
        <Stack.Screen 
          name="FinancialReports" 
          component={FinancialReportsParentScreen} 
          options={{ title: 'Financial Reports' }}
        />
        <Stack.Screen 
          name="TyresOnTheWay" 
          component={TyresOnTheWayScreen} 
          options={{ title: 'Tyres On The Way' }}
        />
        <Stack.Screen 
          name="POSMaterialTracking" 
          component={POSMaterialTrackingScreen} 
          options={{ title: 'POS Material Tracking' }}
        />
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen} 
          options={{ title: 'Product Detail' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});
