import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Snap = () => {
  const dashboardItems = [
    { id: 1, title: 'Ready Tyres', value: '0', icon: 'checkmark-circle' },
    { id: 2, title: 'Not Ready Tyres', value: '0', icon: 'close-circle' },
    { id: 3, title: 'Year to Date\nSales', value: '0', icon: 'stats-chart' },
    { id: 4, title: 'Month to Date\nSales', value: '0', icon: 'calendar' },
    { id: 5, title: 'Quarter to Date\nSales', value: '0', icon: 'bar-chart' },
    { id: 6, title: 'Tyres on the Way', value: '0', icon: 'car' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Snapshot simgesi – mevcutta görsel olmadığından emoji kullanıyoruz */}
          <Text style={styles.snapshotEmoji}>📸</Text>
          <Text style={styles.headerTitle}>Snapshot</Text>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <View style={styles.balanceValue}>
            <Text style={styles.balanceText}>2,706.23</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.dashboardContainer}>
        <View style={styles.dashboardGrid}>
          {dashboardItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.dashboardItem,
                index % 2 === 0 ? styles.itemLeft : styles.itemRight,
              ]}
            >
              <View style={styles.itemContent}>
                <Text style={styles.itemValue}>{item.value}</Text>
                <Text style={styles.itemTitle}>{item.title}</Text>
              </View>
              <View style={styles.itemIcon}>
                <Ionicons name={item.icon as any} size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.shipmentStatus}>
          <Text style={styles.shipmentTitle}>Monthly Shipment Status</Text>
          
          <View style={styles.shipmentItem}>
            <View style={styles.shipmentBar}>
              <View style={[styles.shipmentProgress, { backgroundColor: '#D53439' }]}>
                <Text style={styles.shipmentIcon}>🚚</Text>
                <Text style={styles.shipmentText}>Ready Tyres</Text>
              </View>
              <View style={styles.shipmentPercentage}>
                <Text style={styles.percentageText}>% 0</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.shipmentItem}>
            <View style={styles.shipmentBar}>
              <View style={[styles.shipmentProgress, { backgroundColor: '#FFFFFF' }]}>
                <Text style={styles.shipmentIcon}>🚚</Text>
                <Text style={[styles.shipmentText, { color: '#D53439' }]}>Monthly Shipped</Text>
              </View>
              <View style={styles.shipmentPercentage}>
                <Text style={styles.percentageText}>% 0</Text>
              </View>
            </View>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B2B2B',
    fontFamily: 'MuseoSans-Bold',
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#383838',
    marginBottom: 4,
    fontFamily: 'MuseoSans-Regular',
  },
  balanceValue: {
    backgroundColor: '#8D8D8D',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  balanceText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
  },
  dashboardContainer: {
    backgroundColor: '#8D8D8D',
    paddingHorizontal: 15,
    paddingVertical: 18,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  dashboardItem: {
    width: '48%',
    height: 72,
    backgroundColor: '#626262',
    borderRadius: 4,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  itemLeft: {
    marginRight: '4%',
  },
  itemRight: {
    marginRight: 0,
  },
  itemContent: {
    flex: 1,
    paddingLeft: 15,
  },
  itemValue: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'MuseoSans-Bold',
  },
  itemTitle: {
    fontSize: 11,
    color: '#FFFFFF',
    lineHeight: 13,
    fontFamily: 'MuseoSans-Regular',
  },
  itemIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#383838',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  shipmentStatus: {
    backgroundColor: '#626262',
    borderRadius: 4,
    padding: 15,
  },
  shipmentTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'MuseoSans-Bold',
  },
  shipmentItem: {
    marginBottom: 15,
  },
  shipmentBar: {
    flexDirection: 'row',
    height: 43,
    borderRadius: 0,
    overflow: 'hidden',
  },
  shipmentProgress: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  shipmentIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  shipmentText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    fontFamily: 'MuseoSans-Medium',
  },
  shipmentPercentage: {
    width: 75,
    backgroundColor: '#A4292D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  snapshotEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
});

export default Snap; 