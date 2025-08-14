import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal, Alert } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import LassaLogo from '../../assets/lassa-logo.svg';
import { Ionicons } from '@expo/vector-icons';
import { getCartItems } from '../utils/storage';
import { subscribeCart } from '../utils/cartEvents';

const Header = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isHomeScreen = route.name === 'Home';
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState<number>(getCartItems().length);

  useEffect(() => {
    const unsubscribe = subscribeCart(() => {
      try {
        const count = getCartItems().length;
        setCartCount(count);
      } catch {}
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.header}>

      {/* Logo - SVG Logo */}
      <TouchableOpacity 
        style={styles.logoContainer} 
        onPress={() => navigation.navigate('Dashboard' as never)}
      >
        <LassaLogo height={40} />
      </TouchableOpacity>

      {/* Right actions: Wish List + Cart */}
      <View style={styles.rightActions}>
        <TouchableOpacity style={styles.iconButton} onPress={() => setIsProfileOpen(true)} accessibilityLabel="Open profile menu">
          <Ionicons name="person-circle-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton} 
          accessibilityLabel="Open cart"
          onPress={() => navigation.navigate('Cart' as never)}
        >
          <View style={{ position: 'relative' }}>
            <Text style={styles.cartIcon}>🛒</Text>
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Profile Modal */}
      <Modal transparent visible={isProfileOpen} animationType="fade" statusBarTranslucent={true} onRequestClose={() => setIsProfileOpen(false)}>
        <View style={styles.profileModalOverlay}>
          <View style={styles.profileModalContainer}>
            <View style={styles.profileHeaderRow}>
              <Ionicons name="person-circle" size={28} color="#333" />
              <Text style={styles.profileHeaderText}>Profile</Text>
              <TouchableOpacity onPress={() => setIsProfileOpen(false)} style={styles.profileCloseButton}>
                <Text style={styles.profileCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.profileOptionRow}
              onPress={() => {
                setIsProfileOpen(false);
                (navigation as any).navigate('MyWishList');
              }}
            >
              <Ionicons name="heart-outline" size={20} color="#333" style={styles.profileOptionIcon} />
              <Text style={styles.profileOptionText}>Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileOptionRow}
              onPress={() => {
                setIsProfileOpen(false);
                (navigation as any).navigate('CompareList');
              }}
            >
              <Ionicons name="git-compare-outline" size={20} color="#333" style={styles.profileOptionIcon} />
              <Text style={styles.profileOptionText}>Compare List</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileOptionRow}
              onPress={() => {
                setIsProfileOpen(false);
                Alert.alert('Password', 'Change password coming soon.');
              }}
            >
              <Ionicons name="key-outline" size={20} color="#333" style={styles.profileOptionIcon} />
              <Text style={styles.profileOptionText}>Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileOptionRow}
              onPress={() => {
                setIsProfileOpen(false);
                Alert.alert('Profile', 'Profile settings coming soon.');
              }}
            >
              <Ionicons name="settings-outline" size={20} color="#333" style={styles.profileOptionIcon} />
              <Text style={styles.profileOptionText}>Profile Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontFamily: 'MuseoSans-Bold',
  },
  cisSubtext: {
    color: '#FFFFFF',
    fontSize: 8,
    opacity: 0.8,
    lineHeight: 10,
    fontFamily: 'MuseoSans-Regular',
  },
  cartButton: {
    padding: 4,
  },
  iconButton: {
    padding: 6,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -6,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  profileModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileModalContainer: {
    width: '95%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 8,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  profileHeaderText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  profileCloseButton: {
    padding: 6,
  },
  profileCloseText: {
    fontSize: 16,
    color: '#666',
  },
  profileOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileOptionIcon: {
    marginRight: 10,
  },
  profileOptionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});

export default Header;