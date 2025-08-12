import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Image, Linking } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { addRecentlyViewedProduct, getProductReviews, addProductReview, type ProductReview, isProductFavorite, toggleFavoriteProduct, addToCart, addCompareProduct } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';

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
  const [isSizeGuideModalOpen, setIsSizeGuideModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewHeadline, setReviewHeadline] = useState<string>('');
  const [reviewDescription, setReviewDescription] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string>('');
  const [compareToast, setCompareToast] = useState<string>('');
  
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
  const isPromotionalMaterials: boolean = Boolean(route.params?.isPromotionalMaterials);

  // Size options support for promotional textile products
  type SizeOption = { value: string; qty: number };
  const sizeOptions: SizeOption[] = Array.isArray(product?.sizeOptions)
    ? (product.sizeOptions as SizeOption[])
    : [];
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Ensure product.images exists and is an array
  const productImages = product?.images || [product?.image || defaultProduct.image];

  // Ensure selectedImage doesn't exceed the array bounds
  const safeSelectedImage = Math.min(selectedImage, Math.max(0, productImages.length - 1));

  const tabs = isPromotionalMaterials
    ? ['Product Details']
    : ['Product Details', 'Specs', 'Quality Certificates', 'Reviews'];

  const qualityCertificates = [
    {
      id: 'cert-1',
      name: 'Certificate PDF - 1.pdf',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      id: 'cert-2',
      name: 'Certificate PDF - 2.pdf',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      id: 'cert-3',
      name: 'Certificate PDF - 3.pdf',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  ];

  const hasSizeOptions = (Array.isArray(sizeOptions) && sizeOptions.length > 0);
  const defaultSizeGuideUrl = 'https://b2bcis.brisa-online.com/b2b/medias/646152074-lassa-size-liste2.jpg?context=bWFzdGVyfHJvb3R8MTI3NzkyfGltYWdlL2pwZWd8YUdaa0wyZ3dOQzg1TlRBMU1UTTNOemcyT1RFd0x6WTBOakUxTWpBM05DMXNZWE56WVMxemFYcGxMV3hwYzNSbE1pNXFjR2N8OTNkYTIxODc5Y2IyZmU1MWQ1NjU2OWVmOWZhOWE2NGIwZTY0YmE3ZTFjNzU0YTExOTY1ODkwZGRiODc2Y2UzNQ';

  const isOutOfStock = (): boolean => {
    if (hasSizeOptions) {
      const qty = sizeOptions.find((o) => o.value === selectedSize)?.qty ?? 0;
      return qty <= 0 || quantity > qty;
    }
    if (typeof product?.stock === 'number') {
      return product.stock <= 0 || quantity > product.stock;
    }
    return false;
  };

  useEffect(() => {
    if (product?.id && product?.name) {
      addRecentlyViewedProduct({ id: product.id, name: product.name });
    }
  }, [product?.id]);

  useEffect(() => {
    if (product?.id) {
      const existing = getProductReviews(product.id);
      setReviews(existing);
      setIsFavorite(isProductFavorite(product.id));
    }
  }, [product?.id]);

  // Select default available size on load if size options exist
  useEffect(() => {
    if (sizeOptions.length > 0) {
      const firstAvailable = sizeOptions.find((s) => (s?.qty ?? 0) > 0)?.value || sizeOptions[0].value;
      setSelectedSize(firstAvailable);
    } else {
      setSelectedSize(null);
    }
  }, [product?.id]);

  // Rapor sayfalarına yönlendirme işlevi
  const handleNavigateToReport = (reportData: any) => {
    console.log('Navigation triggered for:', reportData);
    setIsReportsModalOpen(false);
    
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

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    console.log(`Added product ${product.id} to cart with quantity ${quantity}`);
    if (product?.id) addToCart(product.id, quantity);
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
               {isPromotionalMaterials ? (
                 <>
                   {/* For promotional materials, show only description here (no stock in tab) */}
                   {!!product?.description && (
                     <Text style={styles.detailText}>{product.description}</Text>
                   )}
                 </>
               ) : hasSizeOptions ? (
                 <View style={styles.sizeGuide}>
                   <Text style={styles.sizeGuideTitle}>Size Guide</Text>
                   <Image
                     source={{ uri: product?.sizeGuideImage || defaultSizeGuideUrl }}
                     style={styles.sizeGuideImage}
                     resizeMode="contain"
                     onError={(error) => console.log('Size guide loading error:', error)}
                   />
                   <TouchableOpacity 
                     style={styles.expandButton}
                     onPress={() => setIsSizeGuideModalOpen(true)}
                   >
                     <Text style={styles.expandButtonText}>Genişlet</Text>
                   </TouchableOpacity>
                   {!!sizeOptions?.length && (
                     <Text style={styles.sizeGuideInfo}>
                       Sizes: {sizeOptions.map((s: any) => s.value).join(' - ')}
                     </Text>
                   )}
                 </View>
               ) : (
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
               )}
               {!isPromotionalMaterials && (
                 <Text style={styles.detailText}>
                   {hasSizeOptions
                     ? 'Material: 100% cotton'
                     : 'The dual tie bars located at the center provides increased pattern stability.'}
                 </Text>
               )}
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
            <ScrollView
              style={styles.certificateScroll}
              contentContainerStyle={styles.certificateGrid}
              horizontal={false}
              showsVerticalScrollIndicator={true}
            >
              {qualityCertificates.map((cert) => (
                <TouchableOpacity
                  key={cert.id}
                  style={styles.certificateCard}
                  onPress={() => Linking.openURL(cert.url)}
                  activeOpacity={0.85}
                >
                  <View style={styles.certificateIconWrap}>
                    <Ionicons name="document-text-outline" size={36} color="#D53439" />
                  </View>
                  <Text style={styles.certificateName} numberOfLines={1}>
                    {cert.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      case 'Reviews':
        return (
          <View style={styles.tabContent}>
            <View style={styles.reviewForm}>
              <Text style={styles.reviewTitle}>Your Rating</Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    style={styles.starButton}
                    onPress={() => setReviewRating(star)}
                    accessibilityLabel={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Text style={[styles.starIcon, reviewRating >= star ? styles.starIconActive : styles.starIconInactive]}>★</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.reviewInput}
                placeholder="Name (Optional)"
                value={reviewerName}
                onChangeText={setReviewerName}
              />
              <TextInput
                style={styles.reviewInput}
                placeholder="Comment Headline"
                value={reviewHeadline}
                onChangeText={setReviewHeadline}
              />
              <TextInput
                style={[styles.reviewInput, styles.reviewTextarea]}
                placeholder="Review Description"
                multiline
                numberOfLines={4}
                value={reviewDescription}
                onChangeText={setReviewDescription}
              />
              {reviewError ? <Text style={styles.reviewErrorText}>{reviewError}</Text> : null}
              <TouchableOpacity
                style={[styles.submitReviewButton, isSubmittingReview && styles.submitReviewButtonDisabled]}
                disabled={isSubmittingReview}
                onPress={async () => {
                  if (!product?.id) return;
                  setReviewError('');
                  if (reviewRating < 1 || reviewRating > 5) {
                    setReviewError('Please select a rating (1-5).');
                    return;
                  }
                  if (!reviewDescription.trim()) {
                    setReviewError('Please enter your review description.');
                    return;
                  }
                  try {
                    setIsSubmittingReview(true);
                    const created = addProductReview(product.id, {
                      rating: reviewRating,
                      name: reviewerName,
                      headline: reviewHeadline,
                      description: reviewDescription,
                    });
                    setReviews((prev) => [created, ...prev]);
                    setReviewRating(0);
                    setReviewerName('');
                    setReviewHeadline('');
                    setReviewDescription('');
                  } catch (err: any) {
                    setReviewError(err?.message || 'Failed to submit review.');
                  } finally {
                    setIsSubmittingReview(false);
                  }
                }}
              >
                <Text style={styles.submitReviewButtonText}>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.reviewsListSection}>
              <Text style={styles.reviewsListTitle}>Reviews</Text>
              {reviews.length === 0 ? (
                <Text style={styles.emptyText}>No reviews yet. Be the first to review this product.</Text>
              ) : (
                reviews.map((r) => (
                  <View key={r.id} style={styles.reviewItem}>
                    <View style={styles.reviewItemHeader}>
                      <View style={styles.reviewItemStars}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Text key={i} style={[styles.starIconSmall, r.rating >= i ? styles.starIconActive : styles.starIconInactive]}>★</Text>
                        ))}
                      </View>
                      <Text style={styles.reviewItemMeta}>
                        {(r.name || 'Anonymous')}
                        {' • '}
                        {new Date(r.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    {r.headline ? <Text style={styles.reviewItemHeadline}>{r.headline}</Text> : null}
                    <Text style={styles.reviewItemDescription}>{r.description}</Text>
                  </View>
                ))
              )}
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
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        if (!product?.id) return;
                        const nowFav = toggleFavoriteProduct({ id: product.id, name: product.name, image: product.image, status: product.status, price: product.price });
                        setIsFavorite(nowFav);
                      }}
                    >
                      <Text style={styles.actionButtonText}>{isFavorite ? '★ Remove from favorite list' : '⭐ Add to favorite list'}</Text>
                    </TouchableOpacity>
                   
                  {!isPromotionalMaterials && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        if (!product?.id) return;
                        addCompareProduct({ id: product.id, name: product.name, image: product.image, status: product.status, price: product.price });
                        setCompareToast('Product added to the comparison page.');
                        setTimeout(() => setCompareToast(''), 2000);
                      }}
                    >
                      <Text style={styles.actionButtonText}>↔️ Compare</Text>
                    </TouchableOpacity>
                  )}
                 </View>
                 {!!compareToast && (
                   <Text style={styles.compareToast}>{compareToast}</Text>
                 )}
                 
                 <View style={styles.priceContainer}>
                   <Text style={styles.priceText}>-</Text>
                 </View>
                 
                  {isPromotionalMaterials && sizeOptions.length === 0 && typeof product?.stock === 'number' && (
                    <View style={styles.stockRow}>
                      <Text style={styles.stockLabel}>Stock Quantity: </Text>
                      <Text style={styles.stockValue}>{Math.max(0, (product.stock || 0) - quantity)}</Text>
                    </View>
                  )}

                  <Text style={styles.statusText}>{product.status}</Text>

                  {/* Textile size selection (shown only if size options exist) */}
                  {sizeOptions.length > 0 && (
                    <View style={styles.sizeSection}>
                      <Text style={styles.sizeLabel}>Sizes</Text>
                      <View style={styles.sizeButtonsWrap}>
                        {sizeOptions.map((opt) => {
                          const isDisabled = (opt?.qty ?? 0) <= 0;
                          const isSelected = selectedSize === opt.value;
                          return (
                            <TouchableOpacity
                              key={opt.value}
                              style={[
                                styles.sizeButton,
                                isSelected && styles.sizeButtonSelected,
                                isDisabled && styles.sizeButtonDisabled,
                              ]}
                              disabled={isDisabled}
                              onPress={() => setSelectedSize(opt.value)}
                            >
                              <Text
                                style={[
                                  styles.sizeButtonText,
                                  isSelected && styles.sizeButtonTextSelected,
                                  isDisabled && styles.sizeButtonTextDisabled,
                                ]}
                              >
                                {opt.value}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                      <View style={styles.stockRow}>
                        <Text style={styles.stockLabel}>Stock Quantity: </Text>
                        <Text style={styles.stockValue}>{Math.max(0, (sizeOptions.find((o) => o.value === selectedSize)?.qty ?? 0) - quantity)}</Text>
                      </View>
                    </View>
                  )}
                 
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
                      style={[styles.addToCartButton, isOutOfStock() && styles.addToCartButtonDisabled]}
                      onPress={handleAddToCart}
                      disabled={isOutOfStock()}
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

        {/* Size Guide Modal */}
        {isSizeGuideModalOpen && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Size Guide</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setIsSizeGuideModalOpen(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Image 
                source={{ uri: product?.sizeGuideImage || defaultSizeGuideUrl }} 
                style={styles.modalImage}
                resizeMode="contain"
                onError={(error) => console.log('Modal size guide loading error:', error)}
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
  compareToast: {
    marginTop: 8,
    color: '#666',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignSelf: 'flex-start',
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
  addToCartButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  // Size guide styles
  sizeGuide: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sizeGuideTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  sizeGuideImage: {
    width: '100%',
    height: 180,
    marginBottom: 8,
  },
  sizeGuideInfo: {
    fontSize: 12,
    color: '#666',
  },
  // Size selection styles
  sizeSection: {
    marginBottom: 16,
  },
  sizeLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  sizeButtonsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  sizeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  sizeButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#F0FFF3',
  },
  sizeButtonDisabled: {
    backgroundColor: '#F7F7F7',
    borderColor: '#E6E6E6',
  },
  sizeButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  sizeButtonTextSelected: {
    color: '#2E7D32',
  },
  sizeButtonTextDisabled: {
    color: '#AAAAAA',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  stockLabel: {
    fontSize: 13,
    color: '#555',
  },
  stockValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '700',
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
  certificateScroll: {
    width: '100%',
  },
  certificateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  certificateCard: {
    width: 160,
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 16,
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certificateIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F5C2C7',
  },
  certificateName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
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
  starIconActive: {
    color: '#FFD700',
  },
  starIconInactive: {
    color: '#E0E0E0',
  },
  starIconSmall: {
    fontSize: 16,
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
  submitReviewButtonDisabled: {
    opacity: 0.7,
  },
  submitReviewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewErrorText: {
    color: '#D53439',
    marginBottom: 10,
  },
  reviewsListSection: {
    marginTop: 24,
  },
  reviewsListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  reviewItem: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  reviewItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewItemStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewItemMeta: {
    color: '#666',
    fontSize: 12,
  },
  reviewItemHeadline: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reviewItemDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
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