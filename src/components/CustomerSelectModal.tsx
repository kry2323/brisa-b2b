import React, { useMemo, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import ColumnVisibilityModal from './ColumnVisibilityModal';
import ExcelExport from './ExcelExport';
import { CUSTOMERS } from '../utils/customers';

export interface CustomerItem {
  code: string;
  name: string;
}

interface CustomerSelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (customer: CustomerItem) => void;
  customers?: CustomerItem[]; // optional override list
}

const DEFAULT_CUSTOMERS: CustomerItem[] = CUSTOMERS;

const CustomerSelectModal = ({ visible, onClose, onSelect, customers = DEFAULT_CUSTOMERS }: CustomerSelectModalProps) => {
  const [query, setQuery] = useState('');
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [columns, setColumns] = useState([
    { key: 'code', label: 'Customer', visible: true },
    { key: 'name', label: 'Title', visible: true },
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
  }, [customers, query]);

  const visibleCols = useMemo(() => columns.filter(c => c.visible), [columns]);
  const handleColumnToggle = (key: string) => {
    setColumns(prev => prev.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
  };

  return (
    <Modal transparent visible={visible} statusBarTranslucent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Customers</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.toolbar}>
            <View style={styles.searchWrap}>
              <TextInput
                placeholder="Filter"
                value={query}
                onChangeText={setQuery}
                style={styles.search}
              />
            </View>
          </View>

          {/* Actions row */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.columnBtn} onPress={() => setIsColumnModalOpen(true)}>
              <Text style={styles.columnBtnText}>Column Visibility</Text>
            </TouchableOpacity>
            <ExcelExport
              data={filtered.map(c => ({ code: c.code, name: c.name }))}
              visibleColumns={columns}
              fileName={`Customers_${new Date().toISOString().split('T')[0]}`}
              buttonText="Download Excel"
              buttonStyle={styles.exportBtn}
            />
          </View>

          <View style={styles.tableHeader}>
            {visibleCols.map(col => (
              <View
                key={col.key}
                style={[
                  styles.thCell,
                  col.key === 'code' ? { width: 120, backgroundColor: '#FFFFFF' } : { flex: 1, backgroundColor: '#FFFFFF' },
                ]}
              >
                <Text style={styles.th}>{col.label}</Text>
              </View>
            ))}
            <View style={[styles.thCell, { width: 90, backgroundColor: '#FFFFFF' }]}>
              <Text style={styles.th} />
            </View>
          </View>

          <ScrollView style={styles.body}>
            {filtered.map((c) => (
              <View key={`${c.code}-${c.name}`} style={styles.row}>
                {visibleCols.map(col => (
                  col.key === 'code' ? (
                    <Text key={col.key} style={[styles.td, { width: 120 }]} numberOfLines={1}>{c.code}</Text>
                  ) : (
                    <Text key={col.key} style={[styles.td, { flex: 1 }]} numberOfLines={1}>{c.name}</Text>
                  )
                ))}
                <TouchableOpacity style={styles.selectBtn} onPress={() => { onSelect(c); onClose(); }}>
                  <Text style={styles.selectText}>Select</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <ColumnVisibilityModal
        visible={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        columns={columns}
        onColumnToggle={handleColumnToggle}
        maxVisibleColumns={null}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '92%',
    maxWidth: 760,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  close: {
    fontSize: 20,
    color: '#333',
  },
  toolbar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    flexDirection: 'row',
    gap: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  columnBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DA3C42',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  columnBtnText: {
    color: '#DA3C42',
    fontWeight: 'bold',
    fontSize: 14,
  },
  exportBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  searchWrap: {
    flex: 1,
  },
  search: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
  },
  tableHeader: {
    flexDirection: 'row',
  },
  thCell: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  th: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  body: {
    maxHeight: 520,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  td: {
    fontSize: 12,
    color: '#333',
    marginRight: 8,
  },
  selectBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    width: 80,
    alignItems: 'center',
  },
  selectText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default CustomerSelectModal;


