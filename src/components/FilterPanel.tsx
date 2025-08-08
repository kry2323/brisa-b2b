import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterCategoryProps {
  title: string;
  options: FilterOption[];
  selectedOptions: string[];
  onSelectionChange: (categoryTitle: string, selectedIds: string[]) => void;
}

const FilterCategory: React.FC<FilterCategoryProps> = ({ 
  title, 
  options, 
  selectedOptions, 
  onSelectionChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleOption = (optionId: string) => {
    let newSelectedOptions;
    if (selectedOptions.includes(optionId)) {
      newSelectedOptions = selectedOptions.filter(id => id !== optionId);
    } else {
      newSelectedOptions = [...selectedOptions, optionId];
    }
    onSelectionChange(title, newSelectedOptions);
  };

  return (
    <View style={styles.filterCategory}>
      <TouchableOpacity 
        style={styles.filterCategoryHeader} 
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.filterCategoryTitle}>{title}</Text>
        <Text style={styles.expandIcon}>{isExpanded ? '▼' : '►'}</Text>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.filterOptions}>
          {options.map((option) => (
            <TouchableOpacity 
              key={option.id} 
              style={styles.filterOption}
              onPress={() => toggleOption(option.id)}
            >
              <Checkbox
                status={selectedOptions.includes(option.id) ? 'checked' : 'unchecked'}
                onPress={() => toggleOption(option.id)}
                color="#0066CC"
              />
              <Text style={styles.filterOptionLabel}>{option.label}</Text>
              {option.count !== undefined && (
                <Text style={styles.filterOptionCount}>({option.count})</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

interface FilterPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Record<string, string[]>) => void;
  filterCategories: {
    title: string;
    options: FilterOption[];
  }[];
  initialFilters?: Record<string, string[]>;
  productType?: 'tyres' | 'promotional';
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  isVisible, 
  onClose, 
  onApplyFilters,
  filterCategories,
  initialFilters = {},
  productType = 'tyres'
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(initialFilters);

  const handleSelectionChange = (categoryTitle: string, selectedIds: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [categoryTitle]: selectedIds
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(selectedFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const emptyFilters: Record<string, string[]> = {};
    filterCategories.forEach(category => {
      emptyFilters[category.title] = [];
    });
    setSelectedFilters(emptyFilters);
  };

  if (!isVisible) return null;

  // Filter categories based on product type
  const displayedCategories = productType === 'promotional' 
    ? filterCategories.filter(cat => 
        cat.title === 'Shop by Thread' || 
        cat.title === 'Shop by Stock'
      )
    : filterCategories;

  return (
    <View style={styles.overlay}>
      <View style={styles.filterPanel}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Refine</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.filterContent}>
          {displayedCategories.map((category) => (
            <FilterCategory
              key={category.title}
              title={category.title}
              options={category.options}
              selectedOptions={selectedFilters[category.title] || []}
              onSelectionChange={handleSelectionChange}
            />
          ))}
        </ScrollView>
        
        <View style={styles.filterActions}>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearFilters}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={handleApplyFilters}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  filterPanel: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    fontSize: 20,
    color: '#666666',
  },
  filterContent: {
    padding: 16,
  },
  filterCategory: {
    marginBottom: 16,
  },
  filterCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filterCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  expandIcon: {
    fontSize: 14,
    color: '#666666',
  },
  filterOptions: {
    marginTop: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  filterOptionLabel: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 8,
  },
  filterOptionCount: {
    fontSize: 14,
    color: '#999999',
    marginLeft: 4,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  applyButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  applyButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default FilterPanel;