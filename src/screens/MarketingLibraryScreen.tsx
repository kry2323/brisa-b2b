import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import FilterModal from '../components/FilterModal';
import SearchBar from '../components/SearchBar';
import { MARKETING_CATEGORIES, MarketingMaterial, Filter } from '../data/marketingData';
import { useReportNavigation } from '../utils/navigationUtils';


const MarketingLibraryScreen = ({ navigation, route }: any) => {
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<Filter>({
    type: [],
    tags: []
  });

  // Use centralized report navigation
  const handleNavigateToReport = useReportNavigation(navigation);

  // Get category from route params or default to ProductPhotos
  const category = route?.params?.category || 'ProductPhotos';
  const categoryConfig = MARKETING_CATEGORIES[category as keyof typeof MARKETING_CATEGORIES];
  const materials = categoryConfig.materials;

  // Filter materials based on current filters and search
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filters.type.length === 0 || filters.type.includes(material.type);
    const matchesTags = filters.tags.length === 0 || filters.tags.some(tag => 
      material.tags.includes(tag)
    );
    
    return matchesSearch && matchesType && matchesTags;
  });

  const handleTypeFilter = (type: string) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(type) 
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type]
    }));
  };

  const handleTagFilter = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleNavigateToCategory = (targetCategory: string) => {
    navigation.navigate('MarketingLibrary', { category: targetCategory });
  };

  const handleMaterialPress = (material: MarketingMaterial) => {
    // Navigate to unified detail screen
    navigation.navigate('MarketingDetail', { 
      material: material,
      category: category
    });
  };

  const handleDownload = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('Download failed:', error);
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
            <Text style={styles.breadcrumbItemActive}>{categoryConfig.breadcrumb}</Text>
          </View>

          {/* Search and Filter Bar */}
          <SearchBar
            searchText={searchText}
            onSearchChange={setSearchText}
            onFilterPress={() => setIsFilterModalOpen(true)}
          />

          {/* Results Header */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsText}>
              {filteredMaterials.length} result found for "{categoryConfig.title}".
            </Text>
          </View>

          {/* Materials Grid */}
          <View style={styles.materialsGrid}>
            {filteredMaterials.map((material) => (
              <TouchableOpacity 
                key={material.id} 
                style={styles.materialCard}
                onPress={() => handleMaterialPress(material)}
              >
                <View style={styles.materialImageContainer}>
                  <View style={styles.materialPlaceholder}>
                    <Text style={styles.materialPlaceholderText}>
                      {material.type === 'PHOTO' ? 'image' : material.type === 'PRESENTATION' ? 'PDF' : material.type}
                    </Text>
                    <Text style={styles.materialIcon}>
                      {material.type === 'PHOTO' ? '🏔️☀️' : 
                       material.type === 'PRESENTATION' ? '📄' :
                       material.type === 'VIDEO' ? '🎥' : '📄'}
                    </Text>
                  </View>
                  <View style={styles.materialBadge}>
                    <Text style={styles.badgeIcon}>
                      {material.type === 'PHOTO' ? '🖼️' : 
                       material.type === 'PRESENTATION' ? '📊' :
                       material.type === 'VIDEO' ? '🎬' : '📄'}
                    </Text>
                  </View>
                </View>
                <View style={styles.materialInfo}>
                  <Text style={styles.materialTitle}>{material.name}</Text>
                  <Text style={styles.materialDate}>{material.date}</Text>
                  <View style={styles.materialActions}>
                    {material.downloadUrl && (
                      <TouchableOpacity 
                        style={styles.downloadButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDownload(material.downloadUrl!);
                        }}
                      >
                        <Text style={styles.downloadButtonText}>
                          ⬇️ {(material as any).size || 'Download'}
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                      style={styles.playButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        if (material.type === 'PHOTO') {
                          handleMaterialPress(material);
                        } else if (material.downloadUrl) {
                          handleDownload(material.downloadUrl);
                        }
                      }}
                    >
                      <Text style={styles.playButtonText}>
                        {material.type === 'PHOTO' ? 'View' : 'View'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Footer />
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onTypeFilter={handleTypeFilter}
        onTagFilter={handleTagFilter}
        availableTypes={categoryConfig.availableTypes}
        availableTags={categoryConfig.availableTags}
        onNavigateToCategory={handleNavigateToCategory}
        activeCategory={category}
      />

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
  resultsHeader: {
    marginBottom: 20,
  },
  resultsText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'MuseoSans-Regular',
  },
  materialsGrid: {
    gap: 20,
  },
  materialCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    marginBottom: 20,
  },
  materialImageContainer: {
    position: 'relative',
    height: 200,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  materialPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  materialPlaceholderText: {
    fontSize: 14,
    color: '#0066CC',
    marginBottom: 8,
  },
  materialIcon: {
    fontSize: 24,
  },
  materialBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 40,
    height: 40,
    backgroundColor: '#D53439',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 20,
    color: '#fff',
  },
  materialInfo: {
    padding: 20,
  },
  materialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'MuseoSans-Bold',
  },
  materialDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontFamily: 'MuseoSans-Regular',
  },
  materialActions: {
    flexDirection: 'row',
    gap: 12,
  },
  downloadButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'MuseoSans-Medium',
  },
  playButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  playButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'MuseoSans-Medium',
  },
});

export default MarketingLibraryScreen;
