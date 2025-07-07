import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, View, SafeAreaView } from 'react-native';
import Header from './components/Header';
import Banner from './components/Banner';
import OrderOperations from './components/OrderOperations';
import Marketing from './components/Marketing';
import Snap from './components/Snap';
import Reports from './components/Reports';
import BottomNavigation from './components/BottomNavigation';
import Footer from './components/Footer';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#383838" />
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Banner />
        <OrderOperations />
        <Marketing />
        <Snap />
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
