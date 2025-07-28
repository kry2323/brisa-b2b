import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OrderOperations = () => {
  const navigation = useNavigation();
  
  const handleCreateOrder = () => {
    navigation.navigate('ProductListing');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>🛒</Text>
        </View>
        <Text style={styles.headerTitle}>OrderOperations</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCreateOrder}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonIcon}>⊕</Text>
            <Text style={styles.buttonText}>Create Order</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonIcon}>⊕</Text>
            <Text style={styles.buttonText}>Upload Order</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonIcon}>?</Text>
            <Text style={styles.buttonText}>Get Help</Text>
          </View>
        </TouchableOpacity>
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
  },
  buttonContainer: {
    backgroundColor: '#D53439',
    paddingHorizontal: 20,
    paddingVertical: 19,
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 15,
    color: '#383838',
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 16,
    color: '#383838',
    fontWeight: '500',
  },
});

export default OrderOperations;