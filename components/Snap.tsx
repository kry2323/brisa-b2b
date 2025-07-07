import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Snap = () => {
  const dashboardItems = [
    { id: 1, title: 'Hazır Lastikler', value: '0', icon: '🔴' },
    { id: 2, title: 'Hazır Olmayan\nLastikler', value: '0', icon: '🔴' },
    { id: 3, title: 'Yıldan Bugüne\nSatışlar', value: '0', icon: '📈' },
    { id: 4, title: 'Aydan Bugüne\nSatışlar', value: '0', icon: '📊' },
    { id: 5, title: 'Çeyrekten Bugüne\nSatışlar', value: '0', icon: '🔴' },
    { id: 6, title: 'Yoldaki Lastikler', value: '0', icon: '🚚' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Snap</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Bakiye</Text>
          <View style={styles.balanceValue}>
            <Text style={styles.balanceText}>2,706.23</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.dashboardContainer}>
        <View style={styles.dashboardGrid}>
          {dashboardItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.dashboardItem}>
              <View style={styles.itemContent}>
                <Text style={styles.itemValue}>{item.value}</Text>
                <Text style={styles.itemTitle}>{item.title}</Text>
              </View>
              <View style={styles.itemIcon}>
                <Text style={styles.iconText}>{item.icon}</Text>
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
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#383838',
    marginBottom: 4,
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
    width: '50%',
    height: 72,
    backgroundColor: '#626262',
    borderRadius: 4,
    marginBottom: 15,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    overflow: 'hidden',
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
  },
  itemTitle: {
    fontSize: 11,
    color: '#FFFFFF',
    lineHeight: 13,
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
  },
});

export default Snap; 