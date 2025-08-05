import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Reports = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.reportCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>📊</Text>
          <Text style={styles.cardTitle}>Mali Raporlar</Text>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.viewLink}>Linkleri Görüntüle</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.reportCard}>
        <View style={[styles.cardHeader, { backgroundColor: '#D53439' }]}>
          <Text style={styles.cardIcon}>📈</Text>
          <Text style={[styles.cardTitle, { color: '#FFFFFF' }]}>Sipariş ve Satış Raporları</Text>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.viewLink}>Linkleri Görüntüle</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: 20,
    gap: 20,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
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
  cardHeader: {
    backgroundColor: '#383838',
    paddingHorizontal: 20,
    paddingVertical: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
    fontFamily: 'MuseoSans-Bold',
  },
  cardFooter: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'flex-end',
  },
  viewLink: {
    fontSize: 14,
    color: '#383838',
    fontWeight: '500',
    fontFamily: 'MuseoSans-Medium',
  },
});

export default Reports; 