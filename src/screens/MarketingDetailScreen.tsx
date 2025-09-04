import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { MarketingMaterial } from '../data/marketingData';
import { useReportNavigation } from '../utils/navigationUtils';

// Category configuration for breadcrumbs and navigation
const CATEGORY_CONFIG = {
  ProductPhotos: {
    breadcrumb: 'Product Photos and Presentations',
    backRoute: 'ProductPhotos'
  },
  CampaignMaterials: {
    breadcrumb: 'Campaign Materials',
    backRoute: 'CampaignMaterials'
  },
  POSMaterials: {
    breadcrumb: 'POS Materials',
    backRoute: 'POSMaterials'
  },
  ShopBranding: {
    breadcrumb: 'Shop Branding',
    backRoute: 'ShopBranding'
  },
  LogoGuide: {
    breadcrumb: 'Logo Guide',
    backRoute: 'LogoGuide'
  },
  Catalogues: {
    breadcrumb: 'Catalogues, Leaflets, Posters',
    backRoute: 'Catalogues'
  },
  CarBranding: {
    breadcrumb: 'Car Branding',
    backRoute: 'CarBranding'
  },
  SocialMediaDatabase: {
    breadcrumb: 'Social Media Database',
    backRoute: 'SocialMediaDatabase'
  }
};

const MarketingDetailScreen = ({ route, navigation }: any) => {
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  
  // Use centralized report navigation
  const handleNavigateToReport = useReportNavigation(navigation);
  
  // Get material data from route params
  const material: MarketingMaterial = route.params?.material || route.params?.photo || route.params?.campaign || route.params?.posmaterial || route.params?.shopbranding || route.params?.logoguide || route.params?.catalogue || route.params?.carbranding || route.params?.socialmediadatabase || {
    id: 'DEFAULT001',
    name: 'Default Material',
    image: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
    date: 'Jan 01, 2024',
    description: 'Default material description',
    downloadUrl: 'https://example.com',
    size: '1 MB',
    tags: ['default'],
    type: 'DOCUMENT',
    category: 'ProductPhotos'
  };

  // Get category from material or route params
  const category = material.category || route.params?.category || 'ProductPhotos';
  const categoryConfig = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];

  // Related materials (mock data - in real app this would come from API)
  const relatedMaterials: MarketingMaterial[] = [
    {
      id: 'REL001',
      name: 'Related Material 1',
      image: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
      date: 'Jan 02, 2024',
      description: 'Related material description',
      downloadUrl: 'https://example.com',
      size: '2 MB',
      tags: ['related'],
      type: 'DOCUMENT',
      category: category
    },
    {
      id: 'REL002',
      name: 'Related Material 2',
      image: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
      date: 'Jan 03, 2024',
      description: 'Another related material',
      downloadUrl: 'https://example.com',
      size: '3 MB',
      tags: ['related'],
      type: 'IMAGE',
      category: category
    }
  ];

  const handleDownload = async () => {
    if (material.downloadUrl) {
      try {
        await Linking.openURL(material.downloadUrl);
      } catch (error) {
        console.log('Download failed:', error);
      }
    }
  };

  const handleMaterialPress = (selectedMaterial: MarketingMaterial) => {
    navigation.navigate('MarketingDetail', { 
      material: selectedMaterial,
      category: category
    });
  };

  const handleBackPress = () => {
    navigation.navigate('MarketingLibrary', { category: category });
  };


  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PHOTO':
        return '🖼️';
      case 'PRESENTATION':
        return '📊';
      case 'VIDEO':
        return '🎬';
      case 'IMAGE':
        return '🖼️';
      case 'DOCUMENT':
        return '📄';
      default:
        return '📄';
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'PHOTO':
        return 'Photo';
      case 'PRESENTATION':
        return 'Presentation';
      case 'VIDEO':
        return 'Video';
      case 'IMAGE':
        return 'Image';
      case 'DOCUMENT':
        return 'Document';
      default:
        return 'Material';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Breadcrumb */}
          <View style={styles.breadcrumb}>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
              <Text style={styles.breadcrumbItem}>Home</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}>{'>'}</Text>
            <TouchableOpacity>
              <Text style={styles.breadcrumbItem}>Marketing Library</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}>{'>'}</Text>
            <TouchableOpacity onPress={handleBackPress}>
              <Text style={styles.breadcrumbItem}>{categoryConfig.breadcrumb}</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}>{'>'}</Text>
            <Text style={styles.breadcrumbItemActive}>{material.name}</Text>
          </View>

          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Main Material Card */}
            <View style={styles.materialCard}>
              <View style={styles.materialImageContainer}>
                <View style={styles.materialPlaceholder}>
                  <Text style={styles.materialPlaceholderText}>
                    {getTypeDisplayName(material.type)}
                  </Text>
                  <Text style={styles.materialIcon}>
                    {getTypeIcon(material.type)}
                  </Text>
                </View>
                <View style={styles.materialBadge}>
                  <Text style={styles.badgeIcon}>
                    {getTypeIcon(material.type)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.materialInfo}>
                <Text style={styles.materialTitle}>{material.name}</Text>
                <Text style={styles.materialDate}>{material.date}</Text>
                
                {material.description && (
                  <Text style={styles.materialDescription}>{material.description}</Text>
                )}
                
                {material.tags && material.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {material.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
                
                <View style={styles.materialActions}>
                  {material.downloadUrl && (
                    <TouchableOpacity 
                      style={styles.downloadButton}
                      onPress={handleDownload}
                    >
                      <Text style={styles.downloadButtonText}>
                        ⬇️ {material.size || 'Download'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={handleDownload}
                  >
                    <Text style={styles.viewButtonText}>
                      👁️ View
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Related Materials Section */}
            {relatedMaterials.length > 0 && (
              <View style={styles.relatedSection}>
                <Text style={styles.relatedTitle}>Related Materials</Text>
                <View style={styles.relatedGrid}>
                  {relatedMaterials.map((relatedMaterial) => (
                    <TouchableOpacity 
                      key={relatedMaterial.id} 
                      style={styles.relatedCard}
                      onPress={() => handleMaterialPress(relatedMaterial)}
                    >
                      <View style={styles.relatedImageContainer}>
                        <View style={styles.relatedPlaceholder}>
                          <Text style={styles.relatedIcon}>
                            {getTypeIcon(relatedMaterial.type)}
                          </Text>
                        </View>
                        <View style={styles.relatedBadge}>
                          <Text style={styles.relatedBadgeIcon}>
                            {getTypeIcon(relatedMaterial.type)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.relatedInfo}>
                        <Text style={styles.relatedName}>{relatedMaterial.name}</Text>
                        <Text style={styles.relatedDate}>{relatedMaterial.date}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
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
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 0,
  },
  breadcrumbItem: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'MuseoSans-Regular',
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
    fontFamily: 'MuseoSans-Regular',
  },
  breadcrumbItemActive: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
  },
  backButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    fontFamily: 'MuseoSans-Medium',
  },
  mainContent: {
    flex: 1,
  },
  materialCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    marginBottom: 30,
  },
  materialImageContainer: {
    position: 'relative',
    height: 250,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  materialPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  materialPlaceholderText: {
    fontSize: 16,
    color: '#0066CC',
    marginBottom: 8,
    fontFamily: 'MuseoSans-Medium',
  },
  materialIcon: {
    fontSize: 32,
  },
  materialBadge: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    width: 50,
    height: 50,
    backgroundColor: '#D53439',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 24,
    color: '#fff',
  },
  materialInfo: {
    padding: 25,
  },
  materialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    fontFamily: 'MuseoSans-Bold',
  },
  materialDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontFamily: 'MuseoSans-Regular',
  },
  materialDescription: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 20,
    fontFamily: 'MuseoSans-Regular',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 25,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'MuseoSans-Regular',
  },
  materialActions: {
    flexDirection: 'row',
    gap: 15,
  },
  downloadButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'MuseoSans-Medium',
  },
  viewButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 6,
  },
  viewButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'MuseoSans-Medium',
  },
  relatedSection: {
    marginTop: 20,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    fontFamily: 'MuseoSans-Bold',
  },
  relatedGrid: {
    gap: 15,
  },
  relatedCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  relatedImageContainer: {
    position: 'relative',
    height: 120,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  relatedPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedIcon: {
    fontSize: 20,
  },
  relatedBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 30,
    height: 30,
    backgroundColor: '#D53439',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  relatedBadgeIcon: {
    fontSize: 16,
    color: '#fff',
  },
  relatedInfo: {
    padding: 15,
  },
  relatedName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'MuseoSans-Bold',
  },
  relatedDate: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'MuseoSans-Regular',
  },
});

export default MarketingDetailScreen;
