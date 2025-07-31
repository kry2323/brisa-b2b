import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';

const ProductDetailScreen = ({ route, navigation }: any) => {
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Product Details');
  const [expandedTabs, setExpandedTabs] = useState<{[key: string]: boolean}>({
    'Product Details': true,
    'Specs': false,
    'Quality Certificates': false,
    'Reviews': false
  });
  const [isEnergyLabelModalOpen, setIsEnergyLabelModalOpen] = useState(false);
  
  const defaultProduct = {
    id: '280035',
    name: '10.00-20 16 PR EARTH GRIPPER EXC',
    image: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/390x390/N08_1.jpg',
    status: 'Ready for ordering. Price TBD',
    images: [
      'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_1.jpg',
      'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_2.jpg'
    ]
  };

  const product = route.params?.product || defaultProduct;

  // Ensure product.images exists and is an array
  const productImages = product?.images || [product?.image || defaultProduct.image];

  // Ensure selectedImage doesn't exceed the array bounds
  const safeSelectedImage = Math.min(selectedImage, Math.max(0, productImages.length - 1));

  const tabs = ['Product Details', 'Specs', 'Quality Certificates', 'Reviews'];

  // Rapor sayfalarına yönlendirme işlevi
  const handleNavigateToReport = (reportData: any) => {
    console.log('Navigation triggered for:', reportData);
    setIsReportsModalOpen(false);
    
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

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    console.log(`Added product ${product.id} to cart with quantity ${quantity}`);
  };

  const toggleTab = (tabName: string) => {
    setExpandedTabs(prev => ({
      ...prev,
      [tabName]: !prev[tabName]
    }));
  };

  const renderTabContent = (tabName: string) => {
    switch (tabName) {
             case 'Product Details':
         return (
           <View style={styles.tabContent}>
             <View style={styles.energyLabel}>
               <Image 
                 source={{ uri: 'https://b2bcis.brisa-online.com/b2b/_ui/shared/images/template/png/energy-label.png' }} 
                 style={styles.energyLabelImage}
                 resizeMode="contain"
                 onError={(error) => console.log('Energy label loading error:', error)}
               />
               <TouchableOpacity 
                 style={styles.expandButton}
                 onPress={() => setIsEnergyLabelModalOpen(true)}
               >
                 <Text style={styles.expandButtonText}>Genişlet</Text>
               </TouchableOpacity>
             </View>
             <Text style={styles.detailText}>
               The dual tie bars located at the center provides increased pattern stability.
             </Text>
           </View>
         );
      case 'Specs':
        return (
          <View style={styles.tabContent}>
            <View style={styles.specsList}>
              <View style={styles.specItem}>
                <Text style={styles.specTitle}>Ean</Text>
                <Text style={styles.specValue}>8697322800351</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specTitle}>Pattern For Tires</Text>
                <Text style={styles.specValue}>EG EXC</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specTitle}>Speed Rating</Text>
                <Text style={styles.specValue}>0</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specTitle}>Thread Depth</Text>
                <Text style={styles.specValue}>23.0 millimeter</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specTitle}>Weight</Text>
                <Text style={styles.specValue}>42.809 kilogram</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specTitle}>Local</Text>
                <Text style={styles.specValue}>internal</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specTitle}>Volume</Text>
                <Text style={styles.specValue}>0.0 product.details.volumeUnit.</Text>
              </View>
            </View>
          </View>
        );
      case 'Quality Certificates':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyText}>No certificates available</Text>
          </View>
        );
      case 'Reviews':
        return (
          <View style={styles.tabContent}>
            <View style={styles.reviewForm}>
              <Text style={styles.reviewTitle}>Your Rating</Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} style={styles.starButton}>
                    <Text style={styles.starIcon}>★</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.reviewInput}
                placeholder="Name (Optional)"
              />
              <TextInput
                style={styles.reviewInput}
                placeholder="Comment Headline"
              />
              <TextInput
                style={[styles.reviewInput, styles.reviewTextarea]}
                placeholder="Review Description"
                multiline
                numberOfLines={4}
              />
              <TouchableOpacity style={styles.submitReviewButton}>
                <Text style={styles.submitReviewButtonText}>Submit Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
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
            <TouchableOpacity onPress={() => navigation.navigate('ProductListing')}>
              <Text style={styles.breadcrumbItem}>All Categories</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}>{'>'}</Text>
            <Text style={styles.breadcrumbItem}>OFF THE ROAD</Text>
            <Text style={styles.breadcrumbSeparator}>{'>'}</Text>
            <Text style={styles.breadcrumbItem}>ORS</Text>
            <Text style={styles.breadcrumbSeparator}>{'>'}</Text>
            <Text style={styles.breadcrumbItemActive}>{product.name}</Text>
          </View>
          
          <View style={styles.productContainer}>
            {/* Left Column - Product Images */}
                         <View style={styles.imageColumn}>
               <View style={styles.mainImageContainer}>
                 <Image 
                   source={{ uri: productImages[safeSelectedImage] || product.image }} 
                   style={styles.mainImage}
                   resizeMode="contain"
                   onError={(error) => console.log('Image loading error:', error)}
                 />
                 
                 <View style={styles.thumbnailContainer}>
                   {productImages.map((image: string, index: number) => (
                     <TouchableOpacity 
                       key={index}
                       style={[styles.thumbnail, safeSelectedImage === index && styles.thumbnailActive]}
                       onPress={() => setSelectedImage(index)}
                     >
                       <Image 
                         source={{ uri: image }} 
                         style={styles.thumbnailImage}
                         resizeMode="contain"
                         onError={(error) => console.log('Thumbnail loading error:', error)}
                       />
                     </TouchableOpacity>
                   ))}
                 </View>
               </View>
             </View>
            
                         {/* Right Column - Product Info */}
             <View style={styles.infoColumn}>
               <View style={styles.productInfoContainer}>
                 <Image 
                   source={{ uri: 'https://b2bcis.brisa-online.com/b2b/medias/lassa-logo-mini.png?context=bWFzdGVyfGltYWdlc3w3MzV8aW1hZ2UvcG5nfGFETmpMMmhtTVM4NE9USXdNVFV6TURrMk1qSXlMMnhoYzNOaExXeHZaMjh0YldsdWFTNXdibWN8Mzg3NDdjMTIxYzQxODQzYWNiMzdlMGVkMDI5NmEwMjYyODI1MGQ5ZDVlYTI1ZWEyYmQzMjNlOGEzNTg1YTA1ZQ' }} 
                   style={styles.brandLogo}
                   resizeMode="contain"
                   onError={(error) => console.log('Logo loading error:', error)}
                 />
                 
                 <Text style={styles.productTitle}>{product.name}</Text>
                 
                 <View style={styles.productCodeContainer}>
                   <Text style={styles.carIcon}>🚗</Text>
                   <Text style={styles.productCode}>{product.id}</Text>
                 </View>
                 
                 <View style={styles.actionButtons}>
                   <TouchableOpacity style={styles.actionButton}>
                     <Text style={styles.actionButtonText}>⭐ Add to favorite list</Text>
                   </TouchableOpacity>
                   
                   <TouchableOpacity style={styles.actionButton}>
                     <Text style={styles.actionButtonText}>↔️ Compare</Text>
                   </TouchableOpacity>
                 </View>
                 
                 <View style={styles.priceContainer}>
                   <Text style={styles.priceText}>-</Text>
                 </View>
                 
                 <Text style={styles.statusText}>{product.status}</Text>
                 
                 <View style={styles.quantityContainer}>
                   <View style={styles.quantitySelector}>
                     <TouchableOpacity 
                       style={styles.quantityButton}
                       onPress={() => handleQuantityChange(-1)}
                     >
                       <Text style={styles.quantityButtonText}>-</Text>
                     </TouchableOpacity>
                     
                     <TextInput
                       style={styles.quantityInput}
                       value={String(quantity)}
                       keyboardType="numeric"
                       onChangeText={(text) => {
                         const value = parseInt(text) || 1;
                         setQuantity(Math.max(1, value));
                       }}
                     />
                     
                     <TouchableOpacity 
                       style={styles.quantityButton}
                       onPress={() => handleQuantityChange(1)}
                     >
                       <Text style={styles.quantityButtonText}>+</Text>
                     </TouchableOpacity>
                   </View>
                   
                   <TouchableOpacity 
                     style={styles.addToCartButton}
                     onPress={handleAddToCart}
                   >
                     <Text style={styles.addToCartButtonText}>Add to Bag</Text>
                   </TouchableOpacity>
                 </View>
               </View>
             </View>
          </View>
          
                     {/* Accordion Tabs Section */}
           <View style={styles.tabsContainer}>
             {tabs.map((tab) => (
               <View key={tab} style={styles.accordionItem}>
                 <TouchableOpacity
                   style={styles.accordionHeader}
                   onPress={() => toggleTab(tab)}
                 >
                   <Text style={styles.accordionTitle}>{tab}</Text>
                   <Text style={styles.accordionIcon}>
                     {expandedTabs[tab] ? '−' : '+'}
                   </Text>
                 </TouchableOpacity>
                 
                 {expandedTabs[tab] && (
                   <View style={styles.accordionContent}>
                     {renderTabContent(tab)}
                   </View>
                 )}
               </View>
             ))}
           </View>
        </View>
        <Footer />
      </ScrollView>
             <BottomNavigation 
         isReportsModalOpen={isReportsModalOpen} 
         setIsReportsModalOpen={setIsReportsModalOpen}
         onNavigateToReport={handleNavigateToReport}
       />
       
       {/* Energy Label Modal */}
       {isEnergyLabelModalOpen && (
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>Energy Label</Text>
               <TouchableOpacity 
                 style={styles.closeButton}
                 onPress={() => setIsEnergyLabelModalOpen(false)}
               >
                 <Text style={styles.closeButtonText}>✕</Text>
               </TouchableOpacity>
             </View>
             <Image 
               source={{ uri: 'https://b2bcis.brisa-online.com/b2b/_ui/shared/images/template/png/energy-label.png' }} 
               style={styles.modalImage}
               resizeMode="contain"
               onError={(error) => console.log('Modal energy label loading error:', error)}
             />
           </View>
         </View>
       )}
     </SafeAreaView>
   );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    width: '100%',
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  breadcrumbItem: {
    fontSize: 14,
    color: '#0066CC',
  },
  breadcrumbItemActive: {
    fontSize: 14,
    color: '#333',
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 4,
  },
  productContainer: {
    flexDirection: 'column',
    marginBottom: 30,
  },
  imageColumn: {
    width: '100%',
    marginBottom: 20,
  },
  mainImageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
      mainImage: {
      width: '90%',
      height: '70%',
      alignSelf: 'flex-end',
    },
  thumbnailContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
    left: 10,
    top: 0,
    bottom: 0,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginVertical: 3,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  thumbnailActive: {
    borderColor: '#4CAF50',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoColumn: {
    width: '100%',
  },
  productInfoContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  brandLogo: {
    width: 120,
    height: 14,
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  productCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  carIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  productCode: {
    fontSize: 18,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    marginRight: 15,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#333',
  },
  priceContainer: {
    marginBottom: 15,
  },
  priceText: {
    fontSize: 18,
    color: '#666',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
  },
  quantityContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f8f1',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '100%',
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  tabsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F8F8F8',
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  accordionIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  accordionContent: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  tabNavigation: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  tabButtonActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#4CAF50',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#666',
  },
  tabButtonTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  tabContentContainer: {
    padding: 20,
  },
  tabContent: {
    minHeight: 200,
  },
  energyLabel: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  energyLabelImage: {
    width: 200,
    height: 100,
  },
  energyLabelGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  energyLabelFuel: {
    alignItems: 'center',
  },
  energyLabelRain: {
    alignItems: 'center',
  },
  energyLabelSound: {
    alignItems: 'center',
  },
  energyLabelClass: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  specsList: {
    width: '100%',
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  specTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  reviewForm: {
    width: '100%',
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  starButton: {
    marginRight: 10,
  },
  starIcon: {
    fontSize: 24,
    color: '#FFD700',
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
  },
  reviewTextarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitReviewButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitReviewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  expandButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  expandButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxWidth: '90%',
    width: '90%',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: 509,
  },
});

export default ProductDetailScreen; 