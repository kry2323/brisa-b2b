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
import SearchBox from './src/components/SearchBox';
import OverdueNotice from './src/components/OverdueNotice';
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
import LassaTeamScreen from './src/screens/LassaTeamScreen';
import ProductListingScreen from './src/screens/ProductListingScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import MyWishListScreen from './src/screens/MyWishListScreen';
import CompareListScreen from './src/screens/CompareListScreen';
import CartScreen from './src/screens/CartScreen';
import VideoLibraryScreen from './src/screens/VideoLibraryScreen';
import VideoPlayerScreen from './src/screens/VideoPlayerScreen';
import VideoDetailScreen from './src/screens/VideoDetailScreen';
import { getOverdueReportData } from './src/utils/mockData';
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
  const [overdueCount, setOverdueCount] = useState<number>(0);
  const [maxOverdueDays, setMaxOverdueDays] = useState<string | null>(null);
  const [overdueCurrency, setOverdueCurrency] = useState<string | null>(null);

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
      case 'lassa-team':
        navigation.navigate('LassaTeam', { reportData });
        break;
      default:
        console.log('Unknown report type');
    }
  };

  useEffect(() => {
    // Load overdue stats once on mount
    try {
      const data = getOverdueReportData();
      const items = Array.isArray(data) ? data : [];
      setOverdueCount(items.length);
      if (items.length > 0) {
        // Find max overdue days
        const maxDays = items.reduce((max, it) => {
          const v = parseInt(String((it as any).overdueDays || '0'), 10) || 0;
          return Math.max(max, v);
        }, 0);
        setMaxOverdueDays(String(maxDays));

        // Choose dominant currency among overdue items
        const currencyCounts: Record<string, number> = {};
        for (const it of items) {
          const c = String((it as any).curr || '').trim();
          if (!c) continue;
          currencyCounts[c] = (currencyCounts[c] || 0) + 1;
        }
        const dominant = Object.entries(currencyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
        setOverdueCurrency(dominant);
      } else {
        setMaxOverdueDays(null);
        setOverdueCurrency(null);
      }
    } catch (e) {
      setOverdueCount(0);
      setMaxOverdueDays(null);
      setOverdueCurrency(null);
    }
  }, []);

  // Ana sayfa render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#383838" />
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <SearchBox onSubmit={(q) => navigation.navigate('ProductListing', { initialQuery: q })} />
        <Banner />
        {overdueCount > 0 && (
          <OverdueNotice
            count={overdueCount}
            onPress={() => navigation.navigate('OverdueReport', { reportData: { id: 'overdue-report' } })}
          />
        )}
        <Snap overdueDays={maxOverdueDays} currency={overdueCurrency} />
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
      MyWishList: '/wishlist',
      CompareList: '/compare',
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
      LassaTeam: {
        path: '/reports/lassa-team',
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
      VideoLibrary: {
        path: '/video-library',
      },
      VideoPlayer: {
        path: '/video-player',
        parse: {
          videoUrl: (videoUrl: string) => decodeURIComponent(videoUrl),
          title: (title: string) => decodeURIComponent(title),
        },
        stringify: {
          videoUrl: (videoUrl: string) => encodeURIComponent(videoUrl),
          title: (title: string) => encodeURIComponent(title),
        },
      },
      VideoDetail: {
        path: '/video-detail',
        parse: {
          videoId: (videoId: string) => decodeURIComponent(videoId),
          videoUrl: (videoUrl: string) => decodeURIComponent(videoUrl),
          title: (title: string) => decodeURIComponent(title),
        },
        stringify: {
          videoId: (videoId: string) => encodeURIComponent(videoId),
          videoUrl: (videoUrl: string) => encodeURIComponent(videoUrl),
          title: (title: string) => encodeURIComponent(title),
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
          name="Cart" 
          component={CartScreen}
          options={{ title: 'Cart' }}
        />
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
          name="OrderMonitoringReport" 
          component={OrderMonitoringScreen}
          options={{ title: 'Order Monitoring Report' }}
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
          name="LassaTeam"
          component={LassaTeamScreen}
          options={{ title: 'Your Lassa Team' }}
        />
        <Stack.Screen
          name="ProductDetail" 
          component={ProductDetailScreen} 
          options={{ title: 'Product Detail' }}
        />
        <Stack.Screen
          name="MyWishList"
          component={MyWishListScreen}
          options={{ title: 'My Wish List' }}
        />
        <Stack.Screen
          name="CompareList"
          component={CompareListScreen}
          options={{ title: 'Compare List' }}
        />
        <Stack.Screen
          name="VideoLibrary"
          component={VideoLibraryScreen}
          options={{ title: 'Video Library' }}
        />
        <Stack.Screen
          name="VideoPlayer"
          component={VideoPlayerScreen as unknown as React.ComponentType<any>}
          options={{ title: 'Video Player' }}
        />
        <Stack.Screen
          name="VideoDetail"
          component={VideoDetailScreen as unknown as React.ComponentType<any>}
          options={{ title: 'Video Detail' }}
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
