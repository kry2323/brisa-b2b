import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const Banner = () => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.scrollView}
      >
        <View style={[styles.bannerItem, styles.firstBanner]}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>NEW EU TYRE</Text>
            <Text style={styles.bannerTitle}>LABELLING REGULATION</Text>
            <Text style={styles.bannerSubtitle}>IS ENTERING INTO</Text>
            <Text style={styles.bannerSubtitle}>FORCE ON</Text>
            <Text style={styles.bannerDate}>MAY 1ST 2021</Text>
            <Text style={styles.bannerNote}>Please check document for</Text>
            <Text style={styles.bannerNote}>details and obligations</Text>
            <Text style={styles.bannerNote}>suppliers and distributors have</Text>
          </View>
          
          <View style={styles.documentSection}>
            <View style={styles.documentPreview}>
              <Text style={styles.documentText}>📄</Text>
              <TouchableOpacity style={styles.downloadButton}>
                <Text style={styles.downloadText}>CLICK TO DOWNLOAD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={[styles.bannerItem, { backgroundColor: '#34A853' }]}>
          <Text style={styles.bannerText}>İndir ve Kullan</Text>
        </View>
      </ScrollView>
      
      <View style={styles.indicator}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 5,
    overflow: 'hidden',
  },
  scrollView: {
    height: 225,
  },
  bannerItem: {
    width: width - 30,
    height: 225,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  firstBanner: {
    backgroundColor: '#1a1a2e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontStyle: 'italic',
    marginTop: 2,
  },
  bannerDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 8,
  },
  bannerNote: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 12,
  },
  documentSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  documentPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    minWidth: 120,
  },
  documentText: {
    fontSize: 40,
    marginBottom: 10,
  },
  downloadButton: {
    backgroundColor: '#D53439',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  downloadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
  },
});

export default Banner; 