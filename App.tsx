import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';

import Snap from './src/components/Snap';

import Login from './components/Login';
import Header from './src/components/Header';
import Banner from './src/components/Banner';
import OrderOperations from './src/components/OrderOperations';
import Marketing from './src/components/Marketing';
import Reports from './src/components/Reports';
import Footer from './src/components/Footer';
import BottomNavigation from './src/components/BottomNavigation';


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kullanıcı henüz giriş yapmadıysa login ekranını göster
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
        <StatusBar style="light" backgroundColor="#383838" />
        <Login onLogin={() => setIsLoggedIn(true)} />
      </SafeAreaView>
    );
  }

  // Giriş yaptıktan sonra mevcut ana ekranı göster
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
      <BottomNavigation />
    </SafeAreaView>
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
