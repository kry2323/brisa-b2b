import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';

import Snap from './src/components/Snap';
import DesignExamples from './src/components/DesignExamples';
import DashboardExample from './src/components/DashboardExample';
import EcommerceExample from './src/components/EcommerceExample';

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
  const [currentView, setCurrentView] = useState('main');

  // Kullanıcı henüz giriş yapmadıysa login ekranını göster
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
        <StatusBar style="light" backgroundColor="#383838" />
        <Login onLogin={() => setIsLoggedIn(true)} />
      </SafeAreaView>
    );
  }

  // Tasarım örnekleri seçim ekranı
  if (currentView === 'examples') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor="#383838" />
        <View style={styles.examplesHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setCurrentView('main')}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.examplesTitle}>Tasarım Örnekleri</Text>
        </View>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.examplesGrid}>
            <TouchableOpacity 
              style={styles.exampleCard}
              onPress={() => setCurrentView('design')}
            >
              <Text style={styles.exampleIcon}>🎨</Text>
              <Text style={styles.exampleTitle}>UI Bileşenleri</Text>
              <Text style={styles.exampleSubtitle}>Kartlar, butonlar, formlar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.exampleCard}
              onPress={() => setCurrentView('dashboard')}
            >
              <Text style={styles.exampleIcon}>📊</Text>
              <Text style={styles.exampleTitle}>Dashboard</Text>
              <Text style={styles.exampleSubtitle}>Metrikler ve grafikler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.exampleCard}
              onPress={() => setCurrentView('ecommerce')}
            >
              <Text style={styles.exampleIcon}>🛍️</Text>
              <Text style={styles.exampleTitle}>E-ticaret</Text>
              <Text style={styles.exampleSubtitle}>Ürün kartları ve sepet</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Tasarım örnekleri görünümleri
  if (currentView === 'design') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor="#383838" />
        <View style={styles.examplesHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setCurrentView('examples')}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.examplesTitle}>UI Bileşenleri</Text>
        </View>
        <DesignExamples />
      </SafeAreaView>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor="#383838" />
        <View style={styles.examplesHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setCurrentView('examples')}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.examplesTitle}>Dashboard</Text>
        </View>
        <DashboardExample />
      </SafeAreaView>
    );
  }

  if (currentView === 'ecommerce') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor="#383838" />
        <View style={styles.examplesHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setCurrentView('examples')}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.examplesTitle}>E-ticaret</Text>
        </View>
        <EcommerceExample />
      </SafeAreaView>
    );
  }

  // Ana ekran
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
        
        {/* Tasarım Örnekleri Butonu */}
        <TouchableOpacity 
          style={styles.examplesButton}
          onPress={() => setCurrentView('examples')}
        >
          <Text style={styles.examplesButtonText}>🎨 Tasarım Örnekleri</Text>
        </TouchableOpacity>
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
  examplesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  examplesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  examplesGrid: {
    padding: 20,
    gap: 16,
  },
  exampleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exampleIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  exampleSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  examplesButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  examplesButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
