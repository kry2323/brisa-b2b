import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import EnergyLabel from '../components/EnergyLabel';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import FilterPanel from '../components/FilterPanel';
import { ListViewIcon, GridViewIcon } from '../components/ViewTypeIcons';

const ProductListingScreen = ({ route, navigation }: any) => {
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Name (Ascending)');
  const [viewType, setViewType] = useState('list'); // 'list' or 'grid'
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({});
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isEnergyLabelZoomOpen, setIsEnergyLabelZoomOpen] = useState(false);
  
  // Determine if we're in promotional materials section
  const isPromotionalMaterials = (
    route.params?.category === 'promotional-materials' ||
    (typeof route.params?.categoryUrl === 'string' && (
      route.params.categoryUrl.includes('Promotional-Materials-Order') ||
      route.params.categoryUrl.includes('CIS_PMO')
    ))
  );
  
  // Filter categories based on product type
  const filterCategories = [
    {
      title: 'Shop by Section Width',
      options: [
        { id: '155', label: '155', count: 1 },
        { id: '165', label: '165', count: 1 },
        { id: '215', label: '215', count: 1 },
      ]
    },
    {
      title: 'Shop by Aspect Ratio',
      options: [
        { id: '2', label: '2', count: 2 },
        { id: '60', label: '60', count: 1 },
      ]
    },
    {
      title: 'Shop by Rim Diameter',
      options: [
        { id: '13', label: '13', count: 2 },
        { id: '17', label: '17', count: 1 },
      ]
    },
    {
      title: 'Shop by Thread',
      options: [
        { id: 'LC/R', label: 'LC/R', count: 1 },
        { id: 'TRANSWAY', label: 'TRANSWAY', count: 1 },
      ]
    },
    {
      title: 'Shop by Season',
      options: [
        { id: 'SUMMER', label: 'SUMMER', count: 3 },
      ]
    },
    {
      title: 'Shop by Stock',
      options: [
        { id: 'in-stock', label: 'In Stock', count: 12 },
        { id: 'out-of-stock', label: 'Out of Stock', count: 2 },
      ]
    },
  ];

  // Örnek ürün verileri
  const [products, setProducts] = useState([
    { 
      id: '212909', 
      name: '145/80R13 75T SNOWAYS 3', 
      image: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
      images: [
        'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158'
      ],
      status: 'In Stock',
      price: '€25.14',
      season: 'winter',
      brand: 'Lassa',
      brandLogo: '/medias/lassa-logo-mini.png?context=bWFzdGVyfGltYWdlc3w3MzV8aW1hZ2UvcG5nfGFETmpMMmhtTVM4NE9USXdNVFV6TURrMk1qSXlMMnhoYzNOaExXeHZaMjh0YldsdWFTNXdibWN8Mzg3NDdjMTIxYzQxODQzYWNiMzdlMGVkMDI5NmEwMjYyODI1MGQ5ZDVlYTI1ZWEyYmQzMjNlOGEzNTg1YTA1ZQ'
    },
    { 
      id: '270219', 
      name: '11.2-24 8PR TR70', 
      image: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/390x390/N08_1.jpg',
      images: [
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_1.jpg',
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_2.jpg'
      ],
      status: 'Ready for ordering. Price TBD',
      price: '€32.50',
      season: 'summer',
      brand: 'Lassa'
    },
    { 
      id: '280040', 
      name: '165/65R14 79T DRIVEWAYS', 
      image: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/390x390/N08_1.jpg',
      images: [
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_1.jpg',
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_2.jpg'
      ],
      status: 'Ready for ordering. Price TBD',
      price: '€28.75',
      season: 'summer',
      brand: 'Lassa'
    },
    { 
      id: '280042', 
      name: '225/60R17 99V COMPETUS H/P', 
      image: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/390x390/N08_1.jpg',
      images: [
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_1.jpg',
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_2.jpg'
      ],
      status: 'Ready for ordering. Price TBD'
    },
    { 
      id: '280041', 
      name: '155/70R13 75T GREENWAYS', 
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
      id: '280043', 
      name: '215/55R16 93V DRIVEWAYS', 
      image: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/390x390/N08_1.jpg',
      images: [
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_1.jpg',
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_2.jpg'
      ],
      status: 'Ready for ordering. Price TBD'
    },
    { 
      id: '280044', 
      name: '195/65R15 91H TRANSWAY A/T', 
      image: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/390x390/N08_1.jpg',
      images: [
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_1.jpg',
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_2.jpg'
      ],
      status: 'Ready for ordering. Price TBD'
    },
    { 
      id: '280045', 
      name: '185/75R16 104/102R LC/R', 
      image: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/390x390/N08_1.jpg',
      images: [
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_1.jpg',
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_2.jpg'
      ],
      status: 'Ready for ordering. Price TBD'
    },
    { 
      id: '280046', 
      name: '205/55R16 91V SUMMER DRIVEWAYS', 
      image: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/390x390/N08_1.jpg',
      images: [
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_1.jpg',
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_2.jpg'
      ],
      status: 'Ready for ordering. Price TBD'
    },
    { 
      id: '280047', 
      name: '225/45R17 94W SUMMER COMPETUS', 
      image: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/390x390/N08_1.jpg',
      images: [
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_1.jpg',
        'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/N08_2.jpg'
      ],
      status: 'Ready for ordering. Price TBD'
    },
    { 
      id: '280048', 
      name: '175/65R14 82T SUMMER GREENWAYS', 
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

  // Filtreleme işlevi
  const handleApplyFilters = (filters: Record<string, string[]>) => {
    setAppliedFilters(filters);
    console.log('Applied filters:', filters);
  };

  // Ürünleri filtreleme
  useEffect(() => {
    if (Object.values(appliedFilters).every(values => values.length === 0)) {
      setFilteredProducts([...products]);
      console.log('No filters applied, showing all products:', products.length);
      return;
    }

    // Filtre kategorilerini ve seçilen değerleri topla
    const activeFilters = Object.entries(appliedFilters)
      .filter(([_, selectedValues]) => selectedValues.length > 0);
    
    // Başlangıçta boş bir sonuç listesi oluştur
    let result: typeof products = [];
    
    // Her bir filtre kategorisi için filtreleme yap ve sonuçları birleştir (OR mantığı)
    activeFilters.forEach(([category, selectedValues]) => {
      // Bu kategori için filtreleme sonuçlarını al
      const filteredByCategory = products.filter(product => {
        const productName = product.name.toLowerCase();
        
        // Kategori bazında filtreleme mantığı
        switch(category) {
          case 'Shop by Section Width':
            return selectedValues.some(value => productName.includes(value.toLowerCase()));
          
          case 'Shop by Aspect Ratio':
            return selectedValues.some(value => productName.includes(`/${value}`) || productName.includes(`-${value}`));
          
          case 'Shop by Rim Diameter':
            return selectedValues.some(value => productName.includes(`r${value}`) || productName.includes(`-${value}`));
          
          case 'Shop by Thread':
            return selectedValues.some(value => productName.includes(value.toLowerCase()));
          
          case 'Shop by Season':
            return selectedValues.some(value => productName.includes(value.toLowerCase()));
          
          case 'Shop by Stock':
            // Stok durumuna göre filtreleme
            if (selectedValues.includes('in-stock')) {
              // Örnek olarak, tüm ürünlerin %70'i stokta varsayalım
              // Gerçek uygulamada bu bir API'den gelecektir
              const inStockProductIds = ['280035', '270219', '280040', '280042', '280041', '280036', '280037', '280044', '280045', '280046', '280047', '280048'];
              return inStockProductIds.includes(product.id);
            } else if (selectedValues.includes('out-of-stock')) {
              // Geri kalan ürünler stokta yok varsayalım
              const outOfStockProductIds = ['280043', '280038'];
              return outOfStockProductIds.includes(product.id);
            }
            return false;
          
          default:
            return false;
        }
      });
      
      // Sonuç listesini güncelle - bu kategoriye uyan ürünleri ekle (OR mantığı)
      // Tekrarlanan ürünleri önlemek için Set kullanıyoruz
      result = Array.from(new Set([...result, ...filteredByCategory]));
    });
    
    // Filtreleme bilgilerini logla
    activeFilters.forEach(([category, selectedValues]) => {
      console.log(`Filtering by ${category} with values:`, selectedValues);
    });
    
    setFilteredProducts(result);
    console.log('Filtered products:', result.length);
  }, [products, appliedFilters]);

  const handleOpenProductModal = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDetailsFromModal = () => {
    if (selectedProduct) {
      const productToNavigate = selectedProduct;
      setIsProductModalOpen(false);
      setSelectedProduct(null);
      navigation.navigate('ProductDetail', { product: productToNavigate, isPromotionalMaterials });
    }
  };

  // Local static energy label will be rendered by EnergyLabel component

  const renderEnergyIcons = (product: any) => {
    const fuel = product?.fuel ?? '-';
    const sound = product?.sound ?? '-';
    const rain = product?.rain ?? '-';
    return (
      <>
        <View style={styles.energyIconBox}>
          <MaterialCommunityIcons name="gas-station" size={16} color="#666" />
          <Text style={styles.energyIconValue}>{fuel}</Text>
        </View>
        <View style={styles.energyIconBox}>
          <MaterialCommunityIcons name="volume-high" size={16} color="#666" />
          <Text style={styles.energyIconValue}>{sound}</Text>
        </View>
        <View style={styles.energyIconBox}>
          <MaterialCommunityIcons name="weather-pouring" size={16} color="#666" />
          <Text style={styles.energyIconValue}>{rain}</Text>
        </View>
      </>
    );
  };

  const navigateToProductDetail = (product: any) => {
    navigation.navigate('ProductDetail', { product, isPromotionalMaterials });
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
            <TouchableOpacity>
              <Text style={styles.breadcrumbItem}>All Categories</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}>{'>'}</Text>
            <Text style={styles.breadcrumbItemActive}>PASSENGER CAR</Text>
          </View>
          
          <View style={styles.paginationTag}>
            <View style={styles.sorting}>
              <View style={styles.sortingRight}>
                <TouchableOpacity 
                  style={styles.refineButton}
                  onPress={() => setIsFilterPanelVisible(true)}
                >
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
                    <ListViewIcon color={viewType === 'list' ? '#0066CC' : '#666666'} />
                  </TouchableOpacity>
                  
                  <View style={styles.viewTypeSeparator} />
                  
                  <TouchableOpacity 
                    style={[styles.viewTypeButton, viewType === 'grid' && styles.viewTypeButtonActive]}
                    onPress={() => setViewType('grid')}
                  >
                    <GridViewIcon color={viewType === 'grid' ? '#0066CC' : '#666666'} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <View style={styles.sortingResult}>
              <Text style={styles.sortingResultText}>{filteredProducts.length > 0 ? filteredProducts.length : products.length} products found</Text>
            </View>
        </View>
        
        {/* Applied Filters Section */}
        {Object.entries(appliedFilters).some(([_, values]) => values.length > 0) && (
          <View style={styles.appliedFiltersContainer}>
            <View style={styles.appliedFiltersHeader}>
              <Text style={styles.appliedFiltersTitle}>Applied Filters</Text>
              <TouchableOpacity 
                style={styles.clearAllFiltersButton}
                onPress={() => {
                  // Clear all filters
                  const emptyFilters: Record<string, string[]> = {};
                  filterCategories.forEach(category => {
                    emptyFilters[category.title] = [];
                  });
                  setAppliedFilters(emptyFilters);
                }}
              >
                <Text style={styles.clearAllFiltersText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.appliedFiltersScroll}>
              {Object.entries(appliedFilters).map(([category, selectedValues]) => 
                selectedValues.map((value, index) => {
                  // Find the label for the selected value
                  const filterCategory = filterCategories.find(cat => cat.title === category);
                  const option = filterCategory?.options.find(opt => opt.id === value);
                  const label = option?.label || value;
                  
                  return selectedValues.length > 0 ? (
                    <View key={`${category}-${value}-${index}`} style={styles.appliedFilterTag}>
                      <Text style={styles.appliedFilterText}>{label}</Text>
                      <TouchableOpacity 
                        style={styles.appliedFilterRemoveButton}
                        onPress={() => {
                          // Remove this filter
                          const newFilters = {...appliedFilters};
                          newFilters[category] = newFilters[category].filter(v => v !== value);
                          setAppliedFilters(newFilters);
                        }}
                      >
                        <Text style={styles.appliedFilterRemove}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null;
                })
              )}
            </ScrollView>
          </View>
        )}
        
        {viewType === 'list' ? (
          <View style={styles.tableContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.tableHeader}>
                <View style={[styles.tableHeaderCell, styles.cellImage]}>
                  <Text style={styles.tableHeaderText}>PRODUCT IMAGE</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.cellCode]}>
                  <Text style={styles.tableHeaderText}>PRODUCT CODE</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.cellDescription]}>
                  <Text style={styles.tableHeaderText}>PRODUCT DESCRIPTION</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.cellPrice]}>
                  <Text style={styles.tableHeaderText}>PRICE</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.cellQty]}>
                  <Text style={styles.tableHeaderText}>QUANTITY</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.cellAction]}>
                  <Text style={styles.tableHeaderText}>ACTION</Text>
                </View>
              </View>
            </ScrollView>
            
            {(filteredProducts.length > 0 ? filteredProducts : products).map((product) => (
              <TouchableOpacity key={product.id} style={styles.tableRow} activeOpacity={0.85} onPress={() => navigateToProductDetail(product)}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.tableRowInner}>
                <View style={[styles.tableCell, styles.cellImage]}>
                  <View style={styles.brandLogoContainer}>
                    {product.brand === 'Lassa' && (
                      <Image 
                        source={require('../../assets/lassa-logo.png')} 
                        style={styles.brandLogo}
                        resizeMode="contain"
                      />
                    )}
                  </View>
                  <View style={styles.imageWithButtonList}>
                    <TouchableOpacity style={styles.productImageWrapTable} onPress={() => handleOpenProductModal(product)}>
                      <Image 
                        source={{ uri: product.image }} 
                        style={styles.productImage}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <View style={styles.imageActionsBelow}>
                      <TouchableOpacity style={styles.searchIconButton} onPress={() => handleOpenProductModal(product)}>
                        <MaterialCommunityIcons name="magnify" size={16} color="#0066CC" />
                        <Text style={styles.searchIconText}>İncele</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                <View style={[styles.tableCell, styles.cellCode]}>
                  <Text style={styles.productIdTable}>{product.id}</Text>
                </View>
                
                <View style={[styles.tableCell, styles.tableCellDescription, styles.cellDescription]}>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.productNameTable}>{product.name}</Text>
                  {product.season && (
                    <Text style={styles.seasonEmoji}>
                      {product.season === 'winter' ? '❄️' : product.season === 'summer' ? '☀️' : '🔄'}
                    </Text>
                  )}
                </View>
                
                <View style={[styles.tableCell, styles.cellPrice]}>
                  <Text style={styles.priceText}>{product.price || '€'}</Text>
                </View>
                
                <View style={[styles.tableCell, styles.cellQty]}>
                  <View style={styles.quantitySelector}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(product.id, -1)}
                      disabled={quantities[product.id] <= 1}
                    >
                      <Text style={[styles.quantityButtonText, quantities[product.id] <= 1 ? styles.quantityButtonTextDisabled : null]}>-</Text>
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
                      maxLength={5}
                    />
                    
                    <TouchableOpacity 
                      style={[styles.quantityButton, styles.incrementButton]}
                      onPress={() => handleQuantityChange(product.id, 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={[styles.tableCell, styles.cellAction]}>
                  <TouchableOpacity 
                    style={styles.addToCartButton}
                    onPress={() => handleAddToCart(product.id)}
                  >
                    <Text style={styles.addToCartButtonText}>Add to Bag</Text>
                  </TouchableOpacity>
                </View>
                </View>
                </ScrollView>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.productGrid}>
            <View style={styles.productRow}>
              {(filteredProducts.length > 0 ? filteredProducts : products).map((product) => (
                <View key={product.id} style={styles.productCard}>
                  <TouchableOpacity 
                    style={styles.productLink}
                    activeOpacity={0.85}
                    onPress={() => navigateToProductDetail(product)}
                  >
                    <View style={styles.productInfoGrid}>
                      <View style={styles.gridHeaderRow}>
                        <View style={styles.productTitleBlock}>
                          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.productNameGrid}>{product.name}</Text>
                          <View style={styles.productIdRow}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.productIdGrid}>{product.id}</Text>
                            {product.season && (
                              <Text style={styles.seasonEmojiSmall}>
                                {product.season === 'winter' ? '❄️' : product.season === 'summer' ? '☀️' : '🔄'}
                              </Text>
                            )}
                          </View>
                        </View>
                        <Text style={styles.priceTextGrid}>{product.price || '€'}</Text>
                      </View>
                      <View style={styles.productToolbar}>
                        {renderEnergyIcons(product)}
                      </View>
                      {/* season icon only shown once in header; removed duplicate below */}
                      <View style={styles.productStatusGrid}>
                        <Text style={styles.productStatusTextGrid}>{product.status}</Text>
                      </View>
                    </View>
                    <View style={styles.productRightColumn}>
                      <TouchableOpacity style={styles.productImageWrapRight} onPress={() => handleOpenProductModal(product)}>
                        <Image 
                          source={{ uri: product.image }} 
                          style={styles.productImage}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <View style={styles.imageActionsBelowGrid}>
                        <TouchableOpacity style={styles.searchIconButton} onPress={() => handleOpenProductModal(product)}>
                          <MaterialCommunityIcons name="magnify" size={18} color="#0066CC" />
                          <Text style={styles.searchIconText}>İncele</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.productActionRow}>
                    <View style={styles.quantitySelectorGrid}>
                      <TouchableOpacity 
                        style={styles.quantityButtonGrid}
                        onPress={() => handleQuantityChange(product.id, -1)}
                        disabled={quantities[product.id] <= 1}
                      >
                        <Text style={[styles.quantityButtonTextGrid, quantities[product.id] <= 1 ? styles.quantityButtonTextDisabled : null]}>-</Text>
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
                        maxLength={5}
                      />
                      
                      <TouchableOpacity 
                        style={styles.quantityButtonGrid}
                        onPress={() => handleQuantityChange(product.id, 1)}
                      >
                        <Text style={styles.quantityButtonTextGrid}>+</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                      style={[styles.addToCartButton, { flex: 1 }]}
                      onPress={() => handleAddToCart(product.id)}
                    >
                      <Text style={styles.addToCartButtonText}>Add to Bag</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        </View>
        <Footer />
      </ScrollView>
      <BottomNavigation 
        isReportsModalOpen={isReportsModalOpen} 
        setIsReportsModalOpen={setIsReportsModalOpen}
        onNavigateToReport={handleNavigateToReport}
      />
      
      <Modal
        transparent
        visible={isProductModalOpen}
        animationType="fade"
        onRequestClose={handleCloseProductModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCloseProductModal} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              {/* Top: Tyre image */}
              <View style={styles.modalTopImageRow}>
                {selectedProduct?.image ? (
                  <Image source={{ uri: selectedProduct.image }} style={styles.modalTopProductImage} resizeMode="contain" />
                ) : null}
              </View>

              {/* Middle: Product info */}
              <View style={styles.modalInfoBlock}>
                <Text style={styles.modalProductName} numberOfLines={2} ellipsizeMode="tail">{selectedProduct?.name}</Text>
                {!!selectedProduct?.id && (
                  <Text style={styles.modalProductId}>{selectedProduct?.id}</Text>
                )}
                {/* Energy icons above price */}
                <View style={styles.modalEnergyIconsRow}>
                  {selectedProduct ? renderEnergyIcons(selectedProduct) : null}
                </View>
                <View style={styles.modalMetaRow}>
                  {selectedProduct?.season ? (
                    <Text style={styles.modalSeasonIcon}>
                      {selectedProduct.season === 'winter' ? '❄️' : selectedProduct.season === 'summer' ? '☀️' : '🔄'}
                    </Text>
                  ) : null}
                  <Text style={styles.modalPrice}>{selectedProduct?.price || '€'}</Text>
                </View>
              </View>

              {/* Bottom: Energy label */}
              <View style={styles.modalBottomLabelRow}>
                <TouchableOpacity onPress={() => setIsEnergyLabelZoomOpen(true)} activeOpacity={0.85}>
                  <EnergyLabel width={140} />
                </TouchableOpacity>
                <View style={styles.modalBottomLabelActions}>
                  <TouchableOpacity style={styles.modalExamineButton} onPress={() => setIsEnergyLabelZoomOpen(true)}>
                    <MaterialCommunityIcons name="magnify" size={16} color="#0066CC" />
                    <Text style={styles.modalExamineText}>İncele</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalDetailsButton} onPress={handleDetailsFromModal}>
                <Text style={styles.modalDetailsButtonText}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Energy Label Zoom Modal */}
      <Modal
        transparent
        visible={isEnergyLabelZoomOpen}
        animationType="fade"
        onRequestClose={() => setIsEnergyLabelZoomOpen(false)}
      >
        <View style={styles.zoomOverlay}>
          <View style={styles.zoomContainer}>
            <View style={styles.zoomHeader}>
              <Text style={styles.zoomTitle}>Energy Label</Text>
              <TouchableOpacity onPress={() => setIsEnergyLabelZoomOpen(false)} style={styles.zoomCloseButton}>
                <Text style={styles.zoomCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.zoomBody}>
              <EnergyLabel width={320} />
            </View>
          </View>
        </View>
      </Modal>
      
      <FilterPanel 
        isVisible={isFilterPanelVisible}
        onClose={() => setIsFilterPanelVisible(false)}
        onApplyFilters={handleApplyFilters}
        filterCategories={filterCategories}
        initialFilters={appliedFilters}
        productType={isPromotionalMaterials ? 'promotional' : 'tyres'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  productList: {
    flexDirection: 'column',
  },
  productListItem: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  productLinkList: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
    paddingVertical: 6,
  },
  productImageWrapList: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  productInfoList: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  productInfoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  priceTextRight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  listActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 6,
    gap: 10,
  },
  quantitySelectorList: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  addToCartButtonList: {
    backgroundColor: '#4CAF50',
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 12,
    width: '100%',
    minHeight: 500,
  },
  tableContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellImage: { minWidth: 110 },
  cellCode: { minWidth: 110 },
  cellDescription: { minWidth: 220 },
  cellPrice: { minWidth: 90 },
  cellQty: { minWidth: 150 },
  cellAction: { minWidth: 160 },
  tableHeaderCell: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  tableHeaderDescription: {
    flex: 2,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  tableCellDescription: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImageWrapTable: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  imageWithButtonList: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  productNameTable: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
    flexShrink: 1,
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  productIdTable: {
    fontSize: 14,
    color: '#666',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  seasonEmoji: {
    fontSize: 16,
    marginLeft: 5,
  },
  appliedFiltersContainer: {
    marginTop: 10,
    marginBottom: 15,
    padding: 0,
    backgroundColor: '#f5f5f5',
  },
  appliedFiltersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  appliedFiltersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  appliedFiltersScroll: {
    flexDirection: 'row',
    padding: 10,
  },
  appliedFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  appliedFilterText: {
    fontSize: 14,
    color: '#333333',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  appliedFilterRemoveButton: {
    padding: 8,
    backgroundColor: '#cccccc',
  },
  appliedFilterRemove: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  clearAllFiltersButton: {
    backgroundColor: '#e53935',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  clearAllFiltersText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
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
    paddingHorizontal: 6,
  },
  productRow: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    width: '100%',
    marginTop: 10,
    backgroundColor: '#fafafa',
  },
  productList: {
    flexDirection: 'column',
  },
  productCard: {
    width: '100%',
    maxWidth: 800,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productListItem: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 110,
    paddingVertical: 8,
    paddingHorizontal: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  productLink: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  productLinkList: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
  },
  productImageWrap: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
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
    width: '70%',
    paddingHorizontal: 10,
  },
  productInfoGrid: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  gridHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  productTitleBlock: {
    flex: 1,
  },
  productIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  productImageWrapRight: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  productRightColumn: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    width: '100%',
    flexShrink: 1,
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  productNameGrid: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    width: '100%',
    flexWrap: 'wrap',
    textAlign: 'left',
    minHeight: 0,
  },
  productId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    width: '100%',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  productNameWrapper: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 3,
    overflow: 'hidden',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  productIdWrapper: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 3,
    overflow: 'hidden',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
  },
  productIdGrid: {
    fontSize: 12,
    color: '#777',
    marginBottom: 0,
    textAlign: 'left',
    width: '100%',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  seasonEmojiSmall: {
    fontSize: 14,
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
    width: '100%',
    flexWrap: 'wrap',
  },
  productToolbar: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    marginBottom: 6,
    backgroundColor: '#F2F2F2',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  toolbarIcon: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#F2F2F2',
    borderWidth: 1,
    borderColor: '#E6E6E6',
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
  brandLogoContainer: {
    width: 40,
    height: 20,
    marginRight: 8,
    marginBottom: 4,
  },
  brandLogoContainerGrid: {
    width: 40,
    height: 20,
    marginRight: 4,
    marginBottom: 2,
  },
  brandLogo: {
    width: '100%',
    height: '100%',
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  priceTextGrid: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
    textAlign: 'right',
  },
  infoIconGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 6,
    marginBottom: 3,
    width: 'auto',
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
    fontSize: 16,
    color: '#666',
  },
  infoIconValueGrid: {
    fontSize: 9,
    color: '#666',
  },
  energyIconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  energyIconValue: {
    marginLeft: 6,
    fontSize: 12,
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
    width: '100%',
    alignItems: 'flex-start',
  },
  productStatusText: {
    fontSize: 11,
    color: '#666',
  },
  productStatusTextGrid: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'left',
    marginBottom: 10,
  },
  productActionRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
    height: 36,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    marginBottom: 0,
    maxWidth: 150,
  },
  quantitySelectorGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    height: 36,
    overflow: 'hidden',
    minWidth: 110,
  },
  quantityButtonGrid: {
    width: 36,
    height: 36,
    backgroundColor: '#F7FBF8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#E6E6E6',
  },
  quantityButtonTextGrid: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '700',
  },
  quantityButton: {
    width: 30,
    height: 40,
    backgroundColor: '#f0f8f1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  quantityButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  quantityInput: {
    flex: 1,
    height: 40,
    textAlign: 'center',
    borderWidth: 0,
    color: '#333333',
    fontWeight: '500',
    fontSize: 14,
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    maxWidth: undefined,
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  quantityButtonTextDisabled: {
    color: '#cccccc',
  },
  incrementButton: {
    backgroundColor: '#ffffff',
  },
  imageActionsBelow: {
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  imageActionsBelowGrid: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  searchIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F2F7FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6E6FF',
  },
  searchIconText: {
    color: '#0066CC',
    fontSize: 12,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '95%',
    maxWidth: 560,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    paddingRight: 10,
  },
  modalCloseButton: {
    padding: 6,
  },
  modalCloseText: {
    fontSize: 18,
    color: '#666',
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  modalTopImageRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTopProductImage: {
    width: '100%',
    height: 160,
  },
  modalInfoBlock: {
    marginBottom: 12,
  },
  modalProductName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  modalProductId: {
    marginTop: 2,
    fontSize: 13,
    color: '#888',
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    marginBottom: 12,
  },
  modalSeasonIcon: {
    fontSize: 18,
  },
  modalPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
  },
  modalBottomLabelRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 6,
  },
  modalBottomLabelActions: {
    marginTop: 8,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  modalExamineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F2F7FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D6E6FF',
  },
  modalExamineText: {
    color: '#0066CC',
    fontSize: 13,
    fontWeight: '700',
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  modalDetailsButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalDetailsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalEnergyIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  // Zoom modal styles
  zoomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  zoomContainer: {
    width: '95%',
    maxWidth: 560,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  zoomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  zoomTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  zoomCloseButton: {
    padding: 6,
  },
  zoomCloseText: {
    fontSize: 18,
    color: '#666',
  },
  zoomBody: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 20,
  },
});

export default ProductListingScreen;