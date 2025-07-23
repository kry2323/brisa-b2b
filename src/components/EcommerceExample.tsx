import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  Image,
} from 'react-native';

const { width } = Dimensions.get('window');

const EcommerceExample = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tümü');
  const [cartCount, setCartCount] = useState(3);

  const categories = [
    { key: 'tümü', label: 'Tümü', icon: '🏠' },
    { key: 'elektronik', label: 'Elektronik', icon: '📱' },
    { key: 'giyim', label: 'Giyim', icon: '👕' },
    { key: 'ev', label: 'Ev & Yaşam', icon: '🏠' },
    { key: 'spor', label: 'Spor', icon: '⚽' },
  ];

  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      price: '₺45,999',
      originalPrice: '₺49,999',
      rating: 4.8,
      reviews: 124,
      image: '📱',
      category: 'elektronik',
      discount: 8,
    },
    {
      id: 2,
      name: 'Nike Air Max',
      price: '₺2,499',
      originalPrice: '₺2,999',
      rating: 4.6,
      reviews: 89,
      image: '👟',
      category: 'spor',
      discount: 17,
    },
    {
      id: 3,
      name: 'Samsung TV 55"',
      price: '₺12,999',
      originalPrice: '₺15,999',
      rating: 4.7,
      reviews: 56,
      image: '📺',
      category: 'elektronik',
      discount: 19,
    },
    {
      id: 4,
      name: 'Adidas T-Shirt',
      price: '₺299',
      originalPrice: '₺399',
      rating: 4.4,
      reviews: 234,
      image: '👕',
      category: 'giyim',
      discount: 25,
    },
  ];

  const filteredProducts = selectedCategory === 'tümü' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleProductPress = (product: any) => {
    Alert.alert('Ürün Detayı', `${product.name} - ${product.price}`);
  };

  const handleAddToCart = (product: any) => {
    setCartCount(prev => prev + 1);
    Alert.alert('Başarılı', `${product.name} sepete eklendi!`);
  };

  const handleCartPress = () => {
    Alert.alert('Sepet', `${cartCount} ürün sepetinizde`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={i <= rating ? styles.starFilled : styles.starEmpty}>
          ★
        </Text>
      );
    }
    return stars;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Merhaba!</Text>
            <Text style={styles.subtitle}>Ne aramıştınız?</Text>
          </View>
          <TouchableOpacity style={styles.cartButton} onPress={handleCartPress}>
            <Text style={styles.cartIcon}>🛒</Text>
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartCount}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Ürün ara..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryButton,
              selectedCategory === category.key && styles.activeCategoryButton
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryLabel,
              selectedCategory === category.key && styles.activeCategoryLabel
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured Banner */}
      <View style={styles.bannerContainer}>
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Yılbaşı İndirimi</Text>
            <Text style={styles.bannerSubtitle}>%50'ye varan indirimler</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Alışverişe Başla</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerImage}>
            <Text style={styles.bannerImageText}>🎄</Text>
          </View>
        </View>
      </View>

      {/* Products Grid */}
      <View style={styles.productsContainer}>
        <View style={styles.productsHeader}>
          <Text style={styles.productsTitle}>Öne Çıkan Ürünler</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <TouchableOpacity 
                style={styles.productImage}
                onPress={() => handleProductPress(product)}
              >
                <Text style={styles.productImageText}>{product.image}</Text>
                {product.discount > 0 && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>%{product.discount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
                
                <View style={styles.productRating}>
                  <View style={styles.stars}>
                    {renderStars(product.rating)}
                  </View>
                  <Text style={styles.reviewCount}>({product.reviews})</Text>
                </View>
                
                <View style={styles.productPrice}>
                  <Text style={styles.currentPrice}>{product.price}</Text>
                  {product.originalPrice !== product.price && (
                    <Text style={styles.originalPrice}>{product.originalPrice}</Text>
                  )}
                </View>
                
                <TouchableOpacity 
                  style={styles.addToCartButton}
                  onPress={() => handleAddToCart(product)}
                >
                  <Text style={styles.addToCartText}>Sepete Ekle</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Special Offers */}
      <View style={styles.offersContainer}>
        <Text style={styles.offersTitle}>Özel Teklifler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.offerCard}>
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>Ücretsiz Kargo</Text>
              <Text style={styles.offerSubtitle}>₺150+ alışverişlerde</Text>
            </View>
            <Text style={styles.offerIcon}>🚚</Text>
          </View>
          
          <View style={styles.offerCard}>
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>Hızlı Teslimat</Text>
              <Text style={styles.offerSubtitle}>Aynı gün teslimat</Text>
            </View>
            <Text style={styles.offerIcon}>⚡</Text>
          </View>
          
          <View style={styles.offerCard}>
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>Güvenli Ödeme</Text>
              <Text style={styles.offerSubtitle}>256-bit SSL</Text>
            </View>
            <Text style={styles.offerIcon}>🔒</Text>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeCategoryButton: {
    backgroundColor: '#007AFF',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeCategoryLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  bannerContainer: {
    padding: 20,
  },
  banner: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 12,
  },
  bannerButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bannerImage: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImageText: {
    fontSize: 40,
  },
  productsContainer: {
    padding: 20,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: (width - 52) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    height: 120,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productImageText: {
    fontSize: 40,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 4,
  },
  starFilled: {
    color: '#FFD700',
    fontSize: 12,
  },
  starEmpty: {
    color: '#E0E0E0',
    fontSize: 12,
  },
  reviewCount: {
    fontSize: 10,
    color: '#666',
  },
  productPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  offersContainer: {
    padding: 20,
  },
  offersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 140,
  },
  offerContent: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  offerSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  offerIcon: {
    fontSize: 24,
    marginLeft: 8,
  },
});

export default EcommerceExample;