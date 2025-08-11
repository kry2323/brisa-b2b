import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addRecentSearch, getPopularSearches, getRecentSearches, getRecentlyViewedProducts } from '../utils/storage';

interface SearchBoxProps {
  placeholder?: string;
  onSubmit: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ placeholder = 'Search products, codes…', onSubmit }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [popular, setPopular] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Array<{ id: string; name: string }>>([]);
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    addRecentSearch(trimmed);
    setRecent(getRecentSearches());
    onSubmit(trimmed);
    setIsFocused(false);
  };

  useEffect(() => {
    setRecent(getRecentSearches());
    setPopular(getPopularSearches());
    setRecentlyViewed(getRecentlyViewedProducts());
  }, [isFocused]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as string[];
    const haystack = Array.from(new Set([...popular, ...recent]));
    return haystack.filter((t) => t.toLowerCase().includes(q)).slice(0, 8);
  }, [query, popular, recent]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#757575"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          onFocus={() => setIsFocused(true)}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Ionicons name="search" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {(isFocused && !query) && (
        <View style={styles.panel}>
          <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
            {recent.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Son Aramalar</Text>
                {recent.map((item) => (
                  <TouchableOpacity key={item} style={styles.row} onPress={() => { setQuery(item); onSubmit(item); }}>
                    <Ionicons name="time-outline" size={16} color="#666" style={styles.rowIcon} />
                    <Text style={styles.rowText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popüler Aramalar</Text>
              {popular.map((item) => (
                <TouchableOpacity key={item} style={styles.row} onPress={() => { setQuery(item); onSubmit(item); }}>
                  <Ionicons name="trending-up-outline" size={16} color="#666" style={styles.rowIcon} />
                  <Text style={styles.rowText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {recentlyViewed.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Son Gezilen Ürünler</Text>
                {recentlyViewed.map((p) => (
                  <View key={p.id} style={styles.row}>
                    <Ionicons name="pricetag-outline" size={16} color="#666" style={styles.rowIcon} />
                    <Text style={styles.rowText} numberOfLines={1}>{p.name}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {(isFocused && !!query) && (
        <View style={styles.panel}>
          {suggestions.length > 0 ? (
            suggestions.map((s) => (
              <TouchableOpacity key={s} style={styles.row} onPress={() => { setQuery(s); onSubmit(s); }}>
                <Ionicons name="search-outline" size={16} color="#666" style={styles.rowIcon} />
                <Text style={styles.rowText}>{s}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={[styles.row, { justifyContent: 'center' }]}>
              <Text style={[styles.rowText, { color: '#999' }]}>Sonuç bulunamadı</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    zIndex: 101,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333333',
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#D53439',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  panel: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 56 : 58,
    left: 15,
    right: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
    paddingHorizontal: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  rowIcon: {
    marginRight: 8,
  },
  rowText: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
});

export default SearchBox;


