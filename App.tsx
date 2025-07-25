import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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

const Stack = createNativeStackNavigator();

// Ana sayfa bileşeni
function HomeScreen({ navigation }: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Kullanıcı henüz giriş yapmadıysa login ekranını göster
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
        <StatusBar style="light" backgroundColor="#383838" />
        <Login onLogin={() => setIsLoggedIn(true)} />
      </SafeAreaView>
    );
  }

  // Handle navigation to report screens
  const handleNavigateToReport = (reportData: any) => {
    console.log('Navigation triggered for:', reportData);
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

  // Ana sayfa render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#383838" />
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Snap />
        <Banner />
        <OrderOperations />
        <Marketing />
        <Reports />
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
  prefixes: ['http://localhost:8081', 'https://localhost:8081'],
  config: {
    screens: {
      Home: '/',
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
    },
  },
};

// Ana App bileşeni
export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Header'ları gizle çünkü kendi Header bileşenimiz var
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
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
  },
});
