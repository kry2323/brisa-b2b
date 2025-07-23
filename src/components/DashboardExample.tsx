import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

const DashboardExample = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('hafta');

  const periods = [
    { key: 'gun', label: 'Gün' },
    { key: 'hafta', label: 'Hafta' },
    { key: 'ay', label: 'Ay' },
    { key: 'yil', label: 'Yıl' },
  ];

  const metrics = [
    { title: 'Toplam Satış', value: '₺125,430', change: '+12.5%', positive: true },
    { title: 'Yeni Müşteri', value: '1,234', change: '+8.2%', positive: true },
    { title: 'Ortalama Sipariş', value: '₺89.50', change: '-2.1%', positive: false },
    { title: 'Dönüşüm Oranı', value: '3.2%', change: '+0.8%', positive: true },
  ];

  const recentOrders = [
    { id: '#1234', customer: 'Ahmet Yılmaz', amount: '₺1,250', status: 'Tamamlandı' },
    { id: '#1235', customer: 'Fatma Demir', amount: '₺890', status: 'Hazırlanıyor' },
    { id: '#1236', customer: 'Mehmet Kaya', amount: '₺2,100', status: 'Kargoda' },
    { id: '#1237', customer: 'Ayşe Özkan', amount: '₺750', status: 'Tamamlandı' },
  ];

  const handleMetricPress = (title: string) => {
    Alert.alert('Metrik Detayı', `${title} detaylarını görüntüle`);
  };

  const handleOrderPress = (order: any) => {
    Alert.alert('Sipariş Detayı', `${order.id} - ${order.customer}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Merhaba, Admin!</Text>
          <Text style={styles.date}>Bugün, 15 Aralık 2024</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <View style={styles.periodContainer}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodButton,
              selectedPeriod === period.key && styles.activePeriodButton
            ]}
            onPress={() => setSelectedPeriod(period.key)}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === period.key && styles.activePeriodText
            ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Metrics Grid */}
      <View style={styles.metricsContainer}>
        {metrics.map((metric, index) => (
          <TouchableOpacity
            key={index}
            style={styles.metricCard}
            onPress={() => handleMetricPress(metric.title)}
          >
            <Text style={styles.metricTitle}>{metric.title}</Text>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <View style={styles.metricChange}>
              <Text style={[
                styles.changeText,
                metric.positive ? styles.positiveChange : styles.negativeChange
              ]}>
                {metric.change}
              </Text>
              <Text style={styles.changeLabel}>geçen dönem</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart Section */}
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Satış Grafiği</Text>
          <TouchableOpacity style={styles.chartButton}>
            <Text style={styles.chartButtonText}>Detaylar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.chartBars}>
            {[65, 80, 45, 90, 75, 60, 85].map((height, index) => (
              <View key={index} style={styles.chartBarContainer}>
                <View style={[styles.chartBar, { height: height }]} />
                <Text style={styles.chartLabel}>{['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][index]}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.ordersSection}>
        <View style={styles.ordersHeader}>
          <Text style={styles.ordersTitle}>Son Siparişler</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ordersList}>
          {recentOrders.map((order, index) => (
            <TouchableOpacity
              key={index}
              style={styles.orderItem}
              onPress={() => handleOrderPress(order)}
            >
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderCustomer}>{order.customer}</Text>
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.orderAmount}>{order.amount}</Text>
                <View style={[
                  styles.statusBadge,
                  order.status === 'Tamamlandı' ? styles.statusCompleted :
                  order.status === 'Hazırlanıyor' ? styles.statusPending :
                  styles.statusShipping
                ]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.actionsTitle}>Hızlı İşlemler</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>📦</Text>
            </View>
            <Text style={styles.actionText}>Yeni Sipariş</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>👥</Text>
            </View>
            <Text style={styles.actionText}>Müşteri Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>📊</Text>
            </View>
            <Text style={styles.actionText}>Rapor Oluştur</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>⚙️</Text>
            </View>
            <Text style={styles.actionText}>Ayarlar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  periodContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriodButton: {
    backgroundColor: '#007AFF',
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activePeriodText: {
    color: '#fff',
    fontWeight: '600',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  positiveChange: {
    color: '#34C759',
  },
  negativeChange: {
    color: '#FF3B30',
  },
  changeLabel: {
    fontSize: 10,
    color: '#999',
  },
  chartSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  chartButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  chartContainer: {
    height: 120,
    justifyContent: 'flex-end',
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 20,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 10,
    color: '#666',
  },
  ordersSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ordersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllButton: {
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  ordersList: {
    gap: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderCustomer: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  orderDetails: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#E8F5E8',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusShipping: {
    backgroundColor: '#E3F2FD',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  actionsSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionButton: {
    alignItems: 'center',
    width: (width - 72) / 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default DashboardExample;