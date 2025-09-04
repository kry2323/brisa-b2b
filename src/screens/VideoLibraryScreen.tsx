import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getVideoLibraryData, getAllTags, VideoItem } from '../utils/mockData';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { useReportNavigation } from '../utils/navigationUtils';

const VideoLibraryScreen = () => {
  const navigation = useNavigation();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoItem[]>([]);
  const [selectedType, setSelectedType] = useState<'VIDEO' | 'IMAGE' | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [allTags] = useState<string[]>(getAllTags());
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Use centralized report navigation
  const handleNavigateToReport = useReportNavigation(navigation);

  useEffect(() => {
    const data = getVideoLibraryData();
    setVideos(data);
    setFilteredVideos(data);
  }, []);

  useEffect(() => {
    const filtered = getVideoLibraryData({
      type: selectedType || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      search: searchQuery || undefined,
    });
    setFilteredVideos(filtered);
  }, [selectedType, selectedTags, searchQuery]);

  const handleVideoPress = (video: VideoItem) => {
    navigation.navigate('VideoDetail' as never, {
      videoId: video.id,
      videoUrl: video.videoUrl,
      title: video.title,
    } as never);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleType = (type: 'VIDEO' | 'IMAGE') => {
    setSelectedType(prev => prev === type ? null : type);
  };

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedTags([]);
    setSearchQuery('');
  };


  const renderVideoCard = ({ item }: { item: VideoItem }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => handleVideoPress(item)}
    >
      <View style={styles.videoThumbnail}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.thumbnailImage}
        />
        <View style={styles.playOverlay}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
        <View style={styles.videoBadge}>
          <Text style={styles.videoBadgeText}>🎥</Text>
        </View>
      </View>
      
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.videoDate}>{item.date}</Text>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => handleVideoPress(item)}
        >
          <Text style={styles.playButtonText}>▶ Play</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filters</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Type Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Filter by Type</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedType === 'IMAGE' && styles.filterOptionSelected
                ]}
                onPress={() => toggleType('IMAGE')}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedType === 'IMAGE' && styles.filterOptionTextSelected
                ]}>
                  📷 Images
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedType === 'VIDEO' && styles.filterOptionSelected
                ]}
                onPress={() => toggleType('VIDEO')}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedType === 'VIDEO' && styles.filterOptionTextSelected
                ]}>
                  🎥 Videos
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tags Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Filter by Tags</Text>
            <View style={styles.tagsContainer}>
              {allTags.map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagOption,
                    selectedTags.includes(tag) && styles.tagOptionSelected
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[
                    styles.tagOptionText,
                    selectedTags.includes(tag) && styles.tagOptionTextSelected
                  ]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={clearFilters}
          >
            <Text style={styles.clearFiltersText}>Clear All Filters</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Video Library</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search videos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredVideos.length} result{filteredVideos.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Video Grid */}
      <FlatList
        data={filteredVideos}
        renderItem={renderVideoCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.videoGrid}
        showsVerticalScrollIndicator={false}
      />

      <Footer />

      {renderFilterModal()}

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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
    color: '#383838',
  },
  filterButton: {
    backgroundColor: '#383838',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'MuseoSans-Medium',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'MuseoSans-Regular',
  },
  searchIcon: {
    fontSize: 18,
    color: '#999',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'MuseoSans-Regular',
  },
  videoGrid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  videoCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoThumbnail: {
    position: 'relative',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  videoBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  videoBadgeText: {
    color: '#fff',
    fontSize: 12,
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'MuseoSans-Medium',
    color: '#383838',
    marginBottom: 4,
  },
  videoDate: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'MuseoSans-Regular',
    marginBottom: 8,
  },
  playButton: {
    backgroundColor: '#383838',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'MuseoSans-Medium',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
    color: '#383838',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'MuseoSans-Medium',
    color: '#383838',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    alignItems: 'center',
  },
  filterOptionSelected: {
    backgroundColor: '#383838',
    borderColor: '#383838',
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: 'MuseoSans-Regular',
    color: '#383838',
  },
  filterOptionTextSelected: {
    color: '#fff',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 16,
  },
  tagOptionSelected: {
    backgroundColor: '#383838',
    borderColor: '#383838',
  },
  tagOptionText: {
    fontSize: 12,
    fontFamily: 'MuseoSans-Regular',
    color: '#383838',
  },
  tagOptionTextSelected: {
    color: '#fff',
  },
  clearFiltersButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'MuseoSans-Medium',
    color: '#383838',
  },
});

export default VideoLibraryScreen;
