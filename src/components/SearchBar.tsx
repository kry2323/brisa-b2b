import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

interface SearchBarProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  onFilterPress: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  onSearchChange,
  onFilterPress
}) => {
  return (
    <View style={styles.searchFilterBar}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={onSearchChange}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={onFilterPress}
      >
        <Text style={styles.filterButtonText}>Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 20,
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    paddingLeft: 40,
    paddingRight: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'MuseoSans-Regular',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    fontSize: 16,
    color: '#666',
  },
  filterButton: {
    backgroundColor: '#D53439',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
  },
});

export default SearchBar;
