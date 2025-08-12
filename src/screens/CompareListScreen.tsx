import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { getCompareProducts, removeCompareProduct, addToCart, type CompareProduct } from '../utils/storage';
import EnergyLabel from '../components/EnergyLabel';

const CompareListScreen = ({ navigation }: any) => {
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isXL = width >= 1200;
  const firstColWidth = isXL ? 360 : isLandscape ? 300 : 200;
  const colBaseWidth = isXL ? 320 : isLandscape ? 260 : 205;
  const computedColWidth = Math.max(
    colBaseWidth,
    Math.floor((width - firstColWidth - 40) / Math.max(1, products.length))
  );

  useEffect(() => {
    setProducts(getCompareProducts());
  }, []);

  const handleRemove = (productId: string) => {
    removeCompareProduct(productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAddToBag = (productId: string) => {
    addToCart(productId, 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} nestedScrollEnabled>
        <View style={styles.content}>
          <View style={styles.breadcrumb}>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
              <Text style={styles.breadcrumbItem}>Home</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}>{'>'}</Text>
            <Text style={styles.breadcrumbItemActive}>Compare products</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.table}
            nestedScrollEnabled
            scrollEnabled
            directionalLockEnabled
            overScrollMode="always"
            contentContainerStyle={{ minWidth: Math.max(width, firstColWidth + computedColWidth * Math.max(1, products.length)), flexGrow: 1 }}
          >
            <View style={[styles.tableInner, { minWidth: width }] }>
              {/* Header row with thumbnails and remove */}
              <View style={[styles.row, { width: '100%' }]}>
                <View style={[styles.cell, styles.firstCol, { minWidth: firstColWidth, flexBasis: firstColWidth, flexShrink: 0, flexGrow: 0 }]}>
                  <Text style={styles.headerText}>Compare products</Text>
                  <Text style={styles.subHeaderText}>Selected Products ({products.length})</Text>
                </View>
                {products.map((p, idx) => (
                  <View key={`head-${p.id}`} style={[styles.cardCol, idx > 0 && styles.productColBorder, { minWidth: computedColWidth, flexBasis: computedColWidth, flexGrow: 1, flexShrink: 0 }]}>
                    <TouchableOpacity onPress={() => handleRemove(p.id)} style={styles.removeBtn}>
                      <Ionicons name="close" size={16} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: p })}>
                      {p.image ? (
                        <Image source={{ uri: p.image }} style={[styles.thumb, { width: Math.min(160, computedColWidth - 60), height: Math.min(160, computedColWidth - 60) }]} resizeMode="contain" />
                      ) : null}
                      <Text numberOfLines={2} style={styles.productName}>{p.name}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Price */}
              <View style={[styles.row, styles.rowAlt, { width: '100%' }]}> 
                <View style={[styles.cell, styles.firstCol, styles.firstColAlt, { minWidth: firstColWidth, flexBasis: firstColWidth, flexShrink: 0, flexGrow: 0 }]}><Text style={styles.rowTitle}>PRICE</Text></View>
                {products.map((p, idx) => (
                  <View key={`price-${p.id}`} style={[styles.cell, idx > 0 && styles.productColBorder, { minWidth: computedColWidth, flexBasis: computedColWidth, flexGrow: 1, flexShrink: 0 }]}><Text style={styles.valueTextCentered}>{p.price || '€'}</Text></View>
                ))}
              </View>

              {/* Pattern */}
              <View style={[styles.row, { width: '100%' }]}> 
                <View style={[styles.cell, styles.firstCol, { minWidth: firstColWidth, flexBasis: firstColWidth, flexShrink: 0, flexGrow: 0 }]}><Text style={styles.rowTitle}>PATTERN</Text></View>
                {products.map((p, idx) => (
                  <View key={`pattern-${p.id}`} style={[styles.cell, idx > 0 && styles.productColBorder, { minWidth: computedColWidth, flexBasis: computedColWidth, flexGrow: 1, flexShrink: 0 }]}><Text style={styles.valueTextCentered}>{(p as any).pattern || '-'}</Text></View>
                ))}
              </View>

              {/* Speed rating */}
              <View style={[styles.row, styles.rowAlt, { width: '100%' }]}> 
                <View style={[styles.cell, styles.firstCol, styles.firstColAlt, { minWidth: firstColWidth, flexBasis: firstColWidth, flexShrink: 0, flexGrow: 0 }]}><Text style={styles.rowTitle}>SPEED RATING</Text></View>
                {products.map((p, idx) => (
                  <View key={`speed-${p.id}`} style={[styles.cell, idx > 0 && styles.productColBorder, { minWidth: computedColWidth, flexBasis: computedColWidth, flexGrow: 1, flexShrink: 0 }]}><Text style={styles.valueTextCentered}>{(p as any).speedRating || '-'}</Text></View>
                ))}
              </View>

              {/* Wet grip */}
              <View style={[styles.row, { width: '100%' }]}> 
                <View style={[styles.cell, styles.firstCol, { minWidth: firstColWidth, flexBasis: firstColWidth, flexShrink: 0, flexGrow: 0 }]}><Text style={styles.rowTitle}>WET GRIP</Text></View>
                {products.map((p, idx) => (
                  <View key={`wet-${p.id}`} style={[styles.cell, idx > 0 && styles.productColBorder, { minWidth: computedColWidth, flexBasis: computedColWidth, flexGrow: 1, flexShrink: 0 }]}><Text style={styles.valueTextCentered}>{(p as any).wetGrip || '-'}</Text></View>
                ))}
              </View>

              {/* Season */}
              <View style={[styles.row, styles.rowAlt, { width: '100%' }]}> 
                <View style={[styles.cell, styles.firstCol, styles.firstColAlt, { minWidth: firstColWidth, flexBasis: firstColWidth, flexShrink: 0, flexGrow: 0 }]}><Text style={styles.rowTitle}>SEASON</Text></View>
                {products.map((p, idx) => (
                  <View key={`season-${p.id}`} style={[styles.cell, idx > 0 && styles.productColBorder, { minWidth: computedColWidth, flexBasis: computedColWidth, flexGrow: 1, flexShrink: 0 }]}><Text style={styles.valueTextCentered}>{(p as any).season ? String((p as any).season).toUpperCase() : '-'}</Text></View>
                ))}
              </View>

              {/* Thread depth */}
              <View style={[styles.row, { width: '100%' }]}> 
                <View style={[styles.cell, styles.firstCol, { minWidth: firstColWidth, flexBasis: firstColWidth, flexShrink: 0, flexGrow: 0 }]}><Text style={styles.rowTitle}>THREAD DEPTH</Text></View>
                {products.map((p, idx) => (
                  <View key={`depth-${p.id}`} style={[styles.cell, idx > 0 && styles.productColBorder, { minWidth: computedColWidth, flexBasis: computedColWidth, flexGrow: 1, flexShrink: 0 }]}><Text style={styles.valueTextCentered}>{(p as any).threadDepth || '-'}</Text></View>
                ))}
              </View>

              {/* Label (Energy) */}
              <View style={[styles.row, styles.rowAlt, { width: '100%' }]}> 
                <View style={[styles.cell, styles.firstCol, styles.firstColAlt, { minWidth: firstColWidth, flexBasis: firstColWidth, flexShrink: 0, flexGrow: 0 }]}><Text style={styles.rowTitle}>LABEL</Text></View>
                {products.map((p, idx) => (
                  <View key={`label-${p.id}`} style={[styles.cell, idx > 0 && styles.productColBorder, { minWidth: computedColWidth, flexBasis: computedColWidth, flexGrow: 1, flexShrink: 0, alignItems: 'center' }]}>
                    <EnergyLabel width={140} />
                  </View>
                ))}
              </View>

              {/* Add to Bag with qty */}
              <View style={[styles.row, { width: '100%' }]}> 
                <View style={[styles.cell, styles.firstCol, { minWidth: firstColWidth, flexBasis: firstColWidth, flexShrink: 0, flexGrow: 0 }]}><Text style={styles.rowTitle}>ACTION</Text></View>
                {products.map((p, idx) => (
                  <View key={`act-${p.id}`} style={[styles.cell, styles.actionCell, idx > 0 && styles.productColBorder, { minWidth: computedColWidth, flexBasis: computedColWidth, flexGrow: 1, flexShrink: 0 }]}>
                    <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToBag(p.id)}>
                      <Text style={styles.addBtnText}>Add to Bag</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
        <Footer />
      </ScrollView>
      <BottomNavigation 
        isReportsModalOpen={isReportsModalOpen}
        setIsReportsModalOpen={setIsReportsModalOpen}
        onNavigateToReport={() => setIsReportsModalOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  scrollView: { flex: 1 },
  content: { padding: 12 },
  breadcrumb: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  breadcrumbItem: { fontSize: 16, color: '#0066CC' },
  breadcrumbItemActive: { fontSize: 16, color: '#333' },
  breadcrumbSeparator: { fontSize: 16, color: '#666', marginHorizontal: 8 },
  table: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 6 },
  tableInner: { flexDirection: 'column', minWidth: 480 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEE', flexWrap: 'nowrap' },
  rowAlt: { backgroundColor: '#F7F7F7' },
  firstCol: { minWidth: 180, backgroundColor: '#F7F7F7' },
  firstColAlt: { backgroundColor: '#EFEFEF' },
  cell: { padding: 12, minWidth: 140, justifyContent: 'center' },
  headerText: { fontSize: 16, fontWeight: '700', color: '#333' },
  subHeaderText: { fontSize: 12, color: '#666', marginTop: 4 },
  cardCol: { minWidth: 205, padding: 12, alignItems: 'center', justifyContent: 'flex-start' },
  removeBtn: { alignSelf: 'flex-end', padding: 0, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#DDD', width: 28, height: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
  removeBtnText: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 28, fontWeight: '700' },
  thumb: { width: 120, height: 120 },
  productName: { marginTop: 8, fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' },
  rowTitle: { fontSize: 12, color: '#555', fontWeight: '700' },
  valueText: { fontSize: 14, color: '#333', fontWeight: '600' },
  valueTextCentered: { fontSize: 14, color: '#333', fontWeight: '600', textAlign: 'center' },
  actionCell: { alignItems: 'center' },
  productColBorder: { borderLeftWidth: 1, borderLeftColor: '#E6E6E6' },
  addBtn: { backgroundColor: '#4CAF50', height: 40, borderRadius: 6, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  addBtnText: { color: '#fff', fontWeight: '700' },
});

export default CompareListScreen;


