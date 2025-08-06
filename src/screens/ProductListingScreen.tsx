import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';

const ProductListingScreen = ({ route, navigation }: any) => {
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Name (Ascending)');
  const [viewType, setViewType] = useState('list'); // 'list' or 'grid'
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  
  // Örnek ürün verileri
  const [products, setProducts] = useState([
    { 
      id: '280035', 
      name: '10.00-20 16 PR EARTH GRIPPER EXC', 
      image: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/390x390/N08_1.jpg',
      images: [
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_1.jpg',
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_2.jpg'
      ],
      status: 'Ready for ordering. Price TBD'
    },
    { 
      id: '270219', 
      name: '11.2-24 8PR TR70', 
      image: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/390x390/N08_1.jpg',
      images: [
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_1.jpg',
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_2.jpg'
      ],
      status: 'Ready for ordering. Price TBD'
    },
    { 
      id: '280036', 
      name: '12.5/80-18 14PR IND POWER', 
      image: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/390x390/N08_1.jpg',
      images: [
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_1.jpg',
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_2.jpg'
      ],
      status: 'Ready for ordering. Price TBD'
    },
    { 
      id: '280037', 
      name: '16.9-28 12PR TR110', 
      image: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/390x390/N08_1.jpg',
      images: [
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_1.jpg',
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_2.jpg'
      ],
      status: 'Ready for ordering. Price TBD'
    },
    { 
      id: '280038', 
      name: '18.4-30 14PR TR130', 
      image: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/390x390/N08_1.jpg',
      images: [
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_1.jpg',
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_2.jpg'
      ],
      status: 'Ready for ordering. Price TBD'
    },
    { 
      id: '280039', 
      name: '20.8-38 16PR TR140', 
      image: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/390x390/N08_1.jpg',
      images: [
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_1.jpg',
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_2.jpg'
      ],
      status: 'Ready for ordering. Price TBD'
    },
  ]);

  // Rapor sayfalarına yönlendirme işlevi
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

  // Ürün miktarını artırma/azaltma işlevi
  const handleQuantityChange = (productId: string, change: number) => {
    const currentQuantity = quantities[productId] || 1;
    const newQuantity = Math.max(1, currentQuantity + change);
    
    setQuantities({
      ...quantities,
      [productId]: newQuantity
    });
    
    console.log(`Product ${productId} quantity changed to ${newQuantity}`);
  };

  // Sepete ekleme işlevi
  const handleAddToCart = (productId: string) => {
    const quantity = quantities[productId] || 1;
    // Burada sepete ekleme işlemini gerçekleştirebilirsiniz
    console.log(`Added product ${productId} to cart with quantity ${quantity}`);
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
            <Text style={styles.breadcrumbItemActive}>All Categories</Text>
          </View>
          
          <View style={styles.paginationTag}>
            <View style={styles.sorting}>
              <View style={styles.sortingRight}>
                <TouchableOpacity style={styles.refineButton}>
                  <Text style={styles.refineButtonText}>Refine</Text>
                </TouchableOpacity>
                
                <View style={styles.sortingDropdown}>
                  <TouchableOpacity style={styles.sortDropdown}>
                    <Text style={styles.sortDropdownText}>{sortOption}</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.sortingView}>
                  <TouchableOpacity 
                    style={[styles.viewTypeButton, viewType === 'list' && styles.viewTypeButtonActive]}
                    onPress={() => setViewType('list')}
                  >
                    <Text style={styles.viewTypeIcon}>☰</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.viewTypeSeparator} />
                  
                  <TouchableOpacity 
                    style={[styles.viewTypeButton, viewType === 'grid' && styles.viewTypeButtonActive]}
                    onPress={() => setViewType('grid')}
                  >
                    <Text style={styles.viewTypeIcon}>▦</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <View style={styles.sortingResult}>
              <Text style={styles.sortingResultText}>{products.length} products found</Text>
            </View>
          </View>
          
          <View style={styles.productGrid}>
            <View style={viewType === 'grid' ? styles.productRow : styles.productList}>
              {products.map((product) => (
                <View key={product.id} style={viewType === 'grid' ? styles.productCard : styles.productListItem}>
                  <TouchableOpacity 
                    style={viewType === 'grid' ? styles.productLink : styles.productLinkList}
                    onPress={() => navigation.navigate('ProductDetail', { product })}
                  >
                    <View style={viewType === 'grid' ? styles.productImageWrap : styles.productImageWrapList}>
                      <Image 
                        source={{ uri: product.image }} 
                        style={styles.productImage}
                        resizeMode="contain"
                      />
                    </View>
                    
                    <View style={viewType === 'list' ? styles.productInfoList : styles.productInfoGrid}>
                      <View style={styles.productNameWrapper}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={viewType === 'list' ? styles.productName : styles.productNameGrid}>{product.name}</Text>
                      </View>
                      <View style={styles.productIdWrapper}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={viewType === 'list' ? styles.productId : styles.productIdGrid}>{product.id}</Text>
                      </View>
                      
                      <View style={viewType === 'list' ? styles.productInfoIcons : styles.productInfoIconsGrid}>
                        <View style={viewType === 'list' ? styles.infoIcon : styles.infoIconGrid}>
                          <View style={styles.infoIconLeft}>
                            <Text style={viewType === 'list' ? styles.infoIconText : styles.infoIconTextGrid}>⛽</Text>
                          </View>
                          <View style={styles.infoIconRight}>
                            <Text style={viewType === 'list' ? styles.infoIconValue : styles.infoIconValueGrid}>-</Text>
                          </View>
                        </View>
                        
                        <View style={viewType === 'list' ? styles.infoIcon : styles.infoIconGrid}>
                          <View style={styles.infoIconLeft}>
                            <Text style={viewType === 'list' ? styles.infoIconText : styles.infoIconTextGrid}>🔊</Text>
                          </View>
                          <View style={styles.infoIconRight}>
                            <Text style={viewType === 'list' ? styles.infoIconValue : styles.infoIconValueGrid}>-</Text>
                          </View>
                        </View>
                        
                        <View style={viewType === 'list' ? styles.infoIcon : styles.infoIconGrid}>
                          <View style={styles.infoIconLeft}>
                            <Text style={viewType === 'list' ? styles.infoIconText : styles.infoIconTextGrid}>🌧️</Text>
                          </View>
                          <View style={styles.infoIconRight}>
                            <Text style={viewType === 'list' ? styles.infoIconValue : styles.infoIconValueGrid}>-</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View style={viewType === 'list' ? styles.productStatus : styles.productStatusGrid}>
                        <Text style={viewType === 'list' ? styles.productStatusText : styles.productStatusTextGrid}>{product.status}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  
                  <View style={styles.productAction}>
                    <View style={styles.quantitySelector}>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(product.id, -1)}
                      >
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      
                      <TextInput
                        style={styles.quantityInput}
                        value={String(quantities[product.id] || 1)}
                        keyboardType="numeric"
                        onChangeText={(text) => {
                          const value = parseInt(text) || 1;
                          setQuantities({
                            ...quantities,
                            [product.id]: Math.max(1, value)
                          });
                        }}
                      />
                      
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(product.id, 1)}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.addToCartButton}
                      onPress={() => handleAddToCart(product.id)}
                    >
                      <Text style={styles.addToCartButtonText}>Add to Bag</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Footer />
      </ScrollView>
      <BottomNavigation 
        isReportsModalOpen={isReportsModalOpen} 
        setIsReportsModalOpen={setIsReportsModalOpen}
        onNavigateToReport={handleNavigateToReport}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    width: '100%',
    minHeight: 500,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  breadcrumbItem: {
    fontSize: 16,
    color: '#0066CC',
  },
  breadcrumbItemActive: {
    fontSize: 16,
    color: '#333',
  },
  breadcrumbSeparator: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 8,
  },
  paginationTag: {
    width: '100%',
    marginBottom: 20,
  },
  sorting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  sortingResult: {
    flex: 1,
  },
  sortingResultText: {
    fontSize: 16,
    color: '#333',
  },
  sortingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refineButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    marginRight: 10,
  },
  refineButtonText: {
    fontSize: 14,
    color: '#333',
  },
  sortingDropdown: {
    marginRight: 10,
  },
  sortDropdown: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
  },
  sortDropdownText: {
    fontSize: 14,
    color: '#333',
  },
  sortingView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewTypeButton: {
    padding: 8,
  },
  viewTypeButtonActive: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
  },
  viewTypeIcon: {
    fontSize: 18,
    color: '#666',
  },
  viewTypeSeparator: {
    width: 1,
    height: 20,
    backgroundColor: '#DDD',
    marginHorizontal: 5,
  },
  productGrid: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#ffffff',
  },
  productRow: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '100%',
    marginTop: 10,
    overflow: 'scroll',
    backgroundColor: '#fafafa',
  },
  productList: {
    flexDirection: 'column',
  },
  productCard: {
    width: '98%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    minHeight: 110,
    flex: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productListItem: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEE',
    minHeight: 110,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  productLink: {
    padding: 10,
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  productLinkList: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImageWrap: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  productImageWrapList: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    padding: 5,
  },
  productInfoList: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  productInfoGrid: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 8,
    overflow: 'hidden',
    width: '100%',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    width: '100%',
  },
  productNameGrid: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    width: '100%',
  },
  productId: {
    fontSize: 11,
    color: '#666',
    marginBottom: 8,
    width: '100%',
  },
  productNameWrapper: {
    width: '95%',
    flexDirection: 'row',
    marginBottom: 3,
    overflow: 'hidden',
  },
  productIdWrapper: {
    width: '95%',
    flexDirection: 'row',
    marginBottom: 3,
    overflow: 'hidden',
  },
  productIdGrid: {
    fontSize: 9,
    color: '#666',
    marginBottom: 4,
    textAlign: 'left',
    width: '100%',
  },
  productInfoIcons: {
    flexDirection: 'row',
    marginBottom: 6,
    marginTop: 3,
    flexWrap: 'wrap',
    width: '95%',
  },
  productInfoIconsGrid: {
    flexDirection: 'row',
    marginBottom: 4,
    marginTop: 3,
    justifyContent: 'flex-start',
    width: '95%',
    flexWrap: 'wrap',
  },
  infoIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  infoIconGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
    marginBottom: 3,
  },
  infoIconLeft: {
    marginRight: 5,
  },
  infoIconText: {
    fontSize: 10,
    color: '#444444',
  },
  infoIconRight: {
  },
  infoIconValue: {
    fontSize: 10,
    color: '#666',
  },
  infoIconTextGrid: {
    fontSize: 9,
    color: '#666',
  },
  infoIconValueGrid: {
    fontSize: 9,
    color: '#666',
  },
  productStatus: {
    marginTop: 6,
    marginBottom: 4,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    alignSelf: 'flex-start',
  },
  productStatusGrid: {
    marginTop: 4,
    marginBottom: 4,
  },
  productStatusText: {
    fontSize: 11,
    color: '#666',
  },
  productStatusTextGrid: {
    fontSize: 10,
    color: '#666',
  },
  productAction: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    padding: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    flexWrap: 'nowrap',
    marginTop: 'auto',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f8f1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
  },
  quantityInput: {
    flex: 1,
    height: 36,
    textAlign: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 4,
    color: '#4CAF50',
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '55%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ProductListingScreen;