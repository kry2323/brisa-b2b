import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';

interface Filter {
  type: string[];
  tags: string[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: Filter;
  onTypeFilter: (type: string) => void;
  onTagFilter: (tag: string) => void;
  availableTypes: string[];
  availableTags: string[];
  onNavigateToCategory: (category: string) => void;
  activeCategory: string;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onTypeFilter,
  onTagFilter,
  availableTypes,
  availableTags,
  onNavigateToCategory,
  activeCategory
}) => {
  const categories = [
    { id: 'ProductPhotos', title: 'Product Photos, Presentations', icon: '📷' },
    { id: 'CampaignMaterials', title: 'Campaign Materials', icon: '🎯' },
    { id: 'POSMaterials', title: 'Pos Materials', icon: '🏪' },
    { id: 'ShopBranding', title: 'Shop&Car Branding', icon: '🚗' },
    { id: 'LogoGuide', title: 'Logo Guidelines', icon: '🏷️' },
    { id: 'Catalogues', title: 'Catalogues, Leaflets, Posters', icon: '📚' },
    { id: 'VideoLibrary', title: 'Videos', icon: '🎥' },
    { id: 'CarBranding', title: 'Car Branding', icon: '🚙' },
    { id: 'SocialMediaDatabase', title: 'Social Media Database', icon: '📱' }
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={onClose}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Modal Body */}
          <ScrollView style={styles.modalBody}>
            {/* Filter by Type */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Filter by Type</Text>
              <View style={styles.filterContent}>
                {availableTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.filterItem}
                    onPress={() => onTypeFilter(type)}
                  >
                    <View style={[
                      styles.checkbox,
                      filters.type.includes(type) && styles.checkboxChecked
                    ]}>
                      {filters.type.includes(type) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.filterLabel}>
                      {type === 'IMAGE' ? 'Images' : type === 'VIDEO' ? 'Videos' : 'Documents'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filter by Tags */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Filter by Tags</Text>
              <View style={styles.filterContent}>
                {availableTags.slice(0, 20).map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.filterItem}
                    onPress={() => onTagFilter(tag)}
                  >
                    <View style={[
                      styles.checkbox,
                      filters.tags.includes(tag) && styles.checkboxChecked
                    ]}>
                      {filters.tags.includes(tag) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.filterLabel}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Categories */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Categories</Text>
              <View style={styles.categoriesContainer}>
                {categories.map((category) => (
                  <TouchableOpacity 
                    key={category.id}
                    style={[
                      styles.categoryCard,
                      activeCategory === category.id && styles.categoryCardActive
                    ]}
                    onPress={() => {
                      onClose();
                      onNavigateToCategory(category.id);
                    }}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.categoryText,
                      activeCategory === category.id && styles.categoryTextActive
                    ]}>
                      {category.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={onClose}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'MuseoSans-Bold',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  applyButton: {
    backgroundColor: '#D53439',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
  },
  // Filter Section Styles
  filterSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
    overflow: 'hidden',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    fontFamily: 'MuseoSans-Bold',
  },
  filterContent: {
    padding: 15,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterLabel: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'MuseoSans-Regular',
  },
  categoriesContainer: {
    gap: 10,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryCardActive: {
    backgroundColor: '#D53439',
    borderColor: '#D53439',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'MuseoSans-Regular',
    flex: 1,
  },
  categoryTextActive: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'MuseoSans-Regular',
    flex: 1,
  },
});

export default FilterModal;
