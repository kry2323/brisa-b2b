import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';

interface ShowDropdownProps {
  value: number;
  onValueChange: (value: number) => void;
  options?: number[];
}

const ShowDropdown = ({ value, onValueChange, options = [10, 25, 50, 100, 200, 500, -1] }: ShowDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.dropdownButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.dropdownText}>{value === -1 ? 'Show All' : `${value} Show`}</Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>
      
      {isOpen && (
        <>
          <TouchableOpacity 
            style={styles.overlay}
            onPress={() => setIsOpen(false)}
          />
          <View style={styles.dropdownContent}>
            <ScrollView>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.dropdownItem,
                    value === option && styles.dropdownItemSelected
                  ]}
                  onPress={() => {
                    onValueChange(option);
                    setIsOpen(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    value === option && styles.dropdownItemTextSelected
                  ]}>
                    {option === -1 ? 'Show All' : `${option} Show`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 100,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DDD',
    maxHeight: 200,
    minWidth: 120,
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemSelected: {
    backgroundColor: '#8D8D8D',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownItemTextSelected: {
    color: '#FFFFFF',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
});

export default ShowDropdown; 