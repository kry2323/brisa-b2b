import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const BrisaPaymentsScreen = ({ route }: any) => {
  const { reportData } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Brisa Payments</Text>
        <Text style={styles.subtitle}>Report Details</Text>
        {reportData && (
          <View style={styles.reportInfo}>
            <Text style={styles.infoText}>Report ID: {reportData.id}</Text>
            <Text style={styles.infoText}>Title: {reportData.title}</Text>
            <Text style={styles.infoText}>URL: {reportData.url}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  reportInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
});

export default BrisaPaymentsScreen;