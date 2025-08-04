import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';

interface RowDetailModalProps {
  visible: boolean;
  onClose: () => void;
  rowData: any;
  columns: any[];
}

const RowDetailModal = ({ visible, onClose, rowData, columns }: RowDetailModalProps) => {
  if (!rowData) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {rowData.customerOrder || rowData.invoice || 'Order'} Detay
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.detailList}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {columns.map((column) => (
              <View key={column.key} style={styles.detailItem}>
                <Text style={styles.detailLabel}>{column.label}:</Text>
                <Text style={styles.detailValue}>
                  {rowData[column.key] || 'N/A'}
                </Text>
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.closeDetailButton} onPress={onClose}>
              <Text style={styles.closeDetailButtonText}>Close</Text>
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
    maxWidth: 500,
    maxHeight: '85%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  detailList: {
    padding: 20,
    flex: 1,
    paddingBottom: 40,
  },
  detailItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    width: '40%',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFFFFF',
  },
  closeDetailButton: {
    backgroundColor: '#8D8D8D',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeDetailButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RowDetailModal; 