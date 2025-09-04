import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { useReportNavigation } from '../utils/navigationUtils';
import { getFavoriteProducts, removeFavoriteProduct, FavoriteProduct, addToCart } from '../utils/storage';

const MyWishListScreen = ({ navigation }: any) => {
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  
  // Use centralized report navigation
  const handleNavigateToReport = useReportNavigation(navigation);
const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const favs = getFavoriteProducts();
    setFavorites(favs);
  }, []);

  const handleRemove = (productId: string) => {
    removeFavoriteProduct(productId);
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAddToBag = (productId: string) => {
    const qty = quantities[productId] || 1;
    addToCart(productId, qty);
  };

  const handleNavigateToProduct = (product: FavoriteProduct) => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.breadcrumb}>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
              <Text style={styles.breadcrumbItem}>Home</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}>{'>'}</Text>
            <Text style={styles.breadcrumbItemActive}>My Wish List</Text>
          </View>

          <Text style={styles.resultText}>{favorites.length} products found</Text>

          <View style={styles.grid}>
            {favorites.map((p) => (
              <View key={p.id} style={styles.card}>
                <TouchableOpacity style={styles.cardLink} activeOpacity={0.9} onPress={() => handleNavigateToProduct(p)}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
                    <Text style={styles.productId}>{p.id}</Text>
                  </View>
                  <View style={styles.imageWrap}>
                    {p.image ? (
                      <Image source={{ uri: p.image }} style={styles.productImage} resizeMode="contain" />
                    ) : null}
                  </View>
                </TouchableOpacity>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => handleRemove(p.id)}>
                    <Text style={styles.secondaryButtonText}>Remove from favorite list</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.footerRow}>
                  <View style={styles.quantitySelector}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => setQuantities((q) => ({ ...q, [p.id]: Math.max(1, (q[p.id] || 1) - 1) }))}
                      disabled={(quantities[p.id] || 1) <= 1}
                    >
                      <Text style={[styles.quantityButtonText, (quantities[p.id] || 1) <= 1 ? styles.quantityButtonTextDisabled : null]}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.quantityInput}
                      value={String(quantities[p.id] || 1)}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        const value = parseInt(text) || 1;
                        setQuantities((q) => ({ ...q, [p.id]: Math.max(1, value) }));
                      }}
                      maxLength={5}
                    />
                    <TouchableOpacity
                      style={[styles.quantityButton, styles.incrementButton]}
                      onPress={() => setQuantities((q) => ({ ...q, [p.id]: (q[p.id] || 1) + 1 }))}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToBag(p.id)}>
                    <Text style={styles.addToCartButtonText}>Add to Bag</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            {favorites.length === 0 && (
              <Text style={styles.emptyText}>There are no items in your wish list.</Text>
            )}
          </View>
        </View>
        <Footer />
      </ScrollView>
      <BottomNavigation 
        isReportsModalOpen={isReportsModalOpen}
        setIsReportsModalOpen={setIsReportsModalOpen}
        onNavigateToReport={(reportData) => handleNavigateToReport(reportData, setIsReportsModalOpen)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  scrollView: { flex: 1 },
  content: { padding: 20, width: '100%' },
  breadcrumb: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  breadcrumbItem: { fontSize: 14, color: '#0066CC' },
  breadcrumbItemActive: { fontSize: 14, color: '#333' },
  breadcrumbSeparator: { fontSize: 14, color: '#666', marginHorizontal: 4 },
  resultText: { marginBottom: 12, color: '#333' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', padding: 12 },
  cardLink: { width: '100%' },
  cardHeader: { marginBottom: 8 },
  productName: { fontSize: 16, fontWeight: '700', color: '#333' },
  productId: { fontSize: 12, color: '#777', marginTop: 2 },
  imageWrap: { width: '100%', height: 150, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', borderRadius: 8, borderWidth: 1, borderColor: '#EEE' },
  productImage: { width: '90%', height: '90%' },
  actions: { marginTop: 10 },
  secondaryButton: { paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#F8F8F8', borderWidth: 1, borderColor: '#DDD', borderRadius: 4 },
  secondaryButtonText: { fontSize: 14, color: '#333', textAlign: 'center' },
  footerRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', height: 36, backgroundColor: '#ffffff', borderRadius: 6, borderWidth: 1, borderColor: '#D9D9D9', overflow: 'hidden', minWidth: 110 },
  quantityButton: { width: 36, height: 36, backgroundColor: '#F7FBF8', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderLeftWidth: 0, borderColor: '#E6E6E6' },
  quantityButtonText: { fontSize: 14, color: '#4CAF50', fontWeight: '700' },
  quantityButtonTextDisabled: { color: '#cccccc' },
  quantityInput: { flex: 1, height: 36, textAlign: 'center', borderWidth: 0, color: '#333333', fontWeight: '500', fontSize: 14 },
  incrementButton: { backgroundColor: '#ffffff' },
  addToCartButton: { backgroundColor: '#4CAF50', height: 36, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flex: 1 },
  addToCartButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  emptyText: { marginTop: 20, color: '#666' },
});

export default MyWishListScreen;

