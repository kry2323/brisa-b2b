import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import LassaLogo from '../../assets/lassa-logo.svg';

const Header = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isHomeScreen = route.name === 'Home';

  return (
    <View style={styles.header}>

      {/* Logo - SVG Logo */}
      <TouchableOpacity 
        style={styles.logoContainer} 
        onPress={() => navigation.navigate('Dashboard')}
      >
        <LassaLogo height={40} />
      </TouchableOpacity>

      {/* Cart */}
      <TouchableOpacity style={styles.cartButton}>
        <Text style={styles.cartIcon}>🛒</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#383838',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'web' ? 12 : Constants.statusBarHeight + 12,
    minHeight: 60,
  },
  hamburgerButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'center',
  },
  hamburgerLine: {
    width: 20,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  logoContainer: {
    marginRight: 15,
   
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cisSection: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 15,
  },
  cisText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cisSubtext: {
    color: '#FFFFFF',
    fontSize: 8,
    opacity: 0.8,
    lineHeight: 10,
  },
  cartButton: {
    padding: 4,
  },
  cartIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});

export default Header;