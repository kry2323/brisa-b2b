import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import ShowDropdown from './ShowDropdown';

interface Column {
  key: string;
  label: string;
  visible: boolean;
}

interface ColumnVisibilityModalProps {
  visible: boolean;
  onClose: () => void;
  columns: Column[];
  onColumnToggle: (key: string) => void;
  showValue?: number;
  onShowValueChange?: (value: number) => void;
}

const ColumnVisibilityModal = ({ 
  visible, 
  onClose, 
  columns, 
  onColumnToggle, 
  showValue = 100, 
  onShowValueChange 
}: ColumnVisibilityModalProps) => {
  
  // Count visible columns
  const visibleColumnsCount = columns.filter(col => col.visible).length;
  
  // Handle column toggle with limit
  const handleColumnToggle = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column) return;
    
    if (!column.visible && visibleColumnsCount >= 4) {
      Alert.alert(
        'Maksimum Sütun Limiti',
        'En fazla 4 sütun seçebilirsiniz. Detaylı bilgi için tablo satırlarına tıklayabilirsiniz.',
        [{ text: 'Tamam', style: 'default' }]
      );
      return;
    }
    
    onColumnToggle(key);
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Full-width header like in the screenshot */}
          <View style={styles.fullWidthHeader}>
            <Text style={styles.fullWidthHeaderText}>Column Visibility</Text>
          </View>
          
          {/* Show dropdown like in the screenshot */}
          <View style={styles.dropdownContainer}>
            <ShowDropdown 
              value={showValue}
              onValueChange={onShowValueChange || (() => {})}
            />
          </View>
          
          {/* Info message */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              En fazla 4 sütun seçebilirsiniz. Detaylı bilgi için tablo satırlarına tıklayın.
            </Text>
            <Text style={styles.selectionCount}>
              Seçili: {visibleColumnsCount}/4
            </Text>
          </View>
          
          <ScrollView style={styles.columnList}>
            {columns.map((column) => (
              <TouchableOpacity
                key={column.key}
                style={styles.columnItem}
                onPress={() => handleColumnToggle(column.key)}
              >
                <View style={styles.checkboxContainer}>
                  <View style={[styles.checkbox, column.visible && styles.checkboxChecked]}>
                    {column.visible && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.columnLabel}>{column.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  fullWidthHeader: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    alignItems: 'center',
  },
  fullWidthHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dropdownContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  selectionCount: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  columnList: {
    padding: 20,
  },
  columnItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  columnLabel: {
    fontSize: 16,
    color: '#333',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  applyButton: {
    backgroundColor: '#8D8D8D',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ColumnVisibilityModal; 