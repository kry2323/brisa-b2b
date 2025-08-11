import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Marketing = () => {
  const navigation = useNavigation();
  const categories = [
    { id: 1, title: 'Ürün Fotoğrafları,\nSunumlar', icon: '🖼️' },
    { id: 2, title: 'Kampanya\nMateryalleri', icon: '📢' },
    { id: 3, title: 'Pos Materyalleri', icon: '🏪' },
    { id: 4, title: 'Mağaza&Araç\nBrandlama', icon: '🚗' },
    { id: 5, title: 'Logo Guidelines', icon: '📐' },
    { id: 6, title: 'Kataloglar, Broşürler,\nPosterler', icon: '📄' },
    { id: 7, title: 'Videolar', icon: '🎬' },
    { id: 8, title: 'Sosyal Medya\nVeritabanı', icon: '📱' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>▶️</Text>
        </View>
        <Text style={styles.headerTitle}>MarketingLibrary</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#757575"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity 
            key={category.id} 
            style={styles.categoryItem}
            onPress={() => {
              if (category.id === 7) { // Videos category
                navigation.navigate('VideoLibrary' as never);
              }
            }}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryTitle}>{category.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerIconText: {
    fontSize: 24,
    color: '#666',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B2B2B',
    fontFamily: 'MuseoSans-Bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 15,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontFamily: 'MuseoSans-Regular',
  },
  searchButton: {
    padding: 5,
  },
  searchIcon: {
    fontSize: 16,
    color: '#757575',
  },
  categoriesContainer: {
    backgroundColor: '#D53439',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  categoryItem: {
    width: '50%',
    height: 111,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BA2E32',
    backgroundColor: '#D53439',
    paddingHorizontal: 15,
  },
  categoryIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
    fontFamily: 'MuseoSans-Medium',
  },
});

export default Marketing; 