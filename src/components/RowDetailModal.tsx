import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

interface RowDetailModalProps {
  visible: boolean;
  onClose: () => void;
  rowData: any;
  columns: any[];
}

const RowDetailModal = ({ visible, onClose, rowData, columns }: RowDetailModalProps) => {
  const [isExportOptionsOpen, setIsExportOptionsOpen] = useState(false);
  const scrollRef = useRef<any>(null);
  const viewShotRef = useRef<ViewShot | null>(null);

  const saveToDownloadsAndroid = async (
    localUri: string,
    fileName: string,
    mimeType: string
  ) => {
    try {
      // Ask user to pick a folder (choose Downloads to make it visible in the Files app)
      // Android only; other platforms will fall back to share sheet
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!FileSystem.StorageAccessFramework) {
        throw new Error('StorageAccessFramework not available');
      }
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        Alert.alert('İzin verilmedi', 'Kaydetmek için bir klasör seçmelisiniz.');
        return;
      }
      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        fileName,
        mimeType
      );
      const base64 = await FileSystem.readAsStringAsync(localUri, { encoding: FileSystem.EncodingType.Base64 });
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
      Alert.alert('Kaydedildi', 'Dosya seçtiğiniz klasöre kaydedildi.');
    } catch (err: any) {
      Alert.alert('Hata', err?.message || 'Dosya kaydedilirken bir hata oluştu');
    }
  };

  if (!rowData) return null;

  return (
    <>
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView 
            ref={scrollRef}
            style={styles.detailList}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <ViewShot
              ref={viewShotRef}
              options={{ format: 'jpg', quality: 0.95, result: 'tmpfile', backgroundColor: '#FFFFFF' }}
              style={styles.captureContainer}
              collapsable={false}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {rowData.customerOrder || rowData.invoice || 'Order'} Detay
                </Text>
                <View style={styles.headerActions}>
                  <TouchableOpacity
                    onPress={() => setIsExportOptionsOpen(true)}
                    style={styles.exportButton}
                    accessibilityLabel="Export or Share"
                    accessibilityHint="Detayları dışa aktar veya paylaş"
                  >
                    <Ionicons name="download-outline" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            {columns.map((column) => {
              const value = rowData[column.key] || 'N/A';
              const copyText = `${column.label}: ${value}`;
              const handleCopy = async () => {
                await Clipboard.setStringAsync(copyText);
                Alert.alert('Kopyalandı', 'Satır panoya kopyalandı.');
              };
              return (
                <TouchableOpacity
                  key={column.key}
                  style={styles.detailItem}
                  activeOpacity={0.7}
                  onLongPress={handleCopy}
                >
                  <Text style={styles.detailLabel} selectable>{column.label}:</Text>
                  <Text style={styles.detailValue} selectable>
                    {value}
                  </Text>
                </TouchableOpacity>
              );
            })}
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.closeDetailButton} onPress={onClose}>
                  <Text style={styles.closeDetailButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </ViewShot>
          </ScrollView>
        </View>
      </View>
    </Modal>

    {/* Export Options Modal */}
    <Modal
      visible={isExportOptionsOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsExportOptionsOpen(false)}
    >
      <View style={styles.exportOverlay}>
        <TouchableOpacity style={styles.exportBackdrop} onPress={() => setIsExportOptionsOpen(false)} />
        <View style={styles.exportSheet}>
          <Text style={styles.exportTitle}>Dışa Aktar / Paylaş</Text>
          <TouchableOpacity
            style={styles.exportAction}
            onPress={async () => {
              try {
                const uriTmp: string = await viewShotRef.current?.capture?.();
                const fileName = `RowDetail-${Date.now()}.jpg`;
                if (Platform.OS === 'android') {
                  await saveToDownloadsAndroid(uriTmp, fileName, 'image/jpeg');
                } else {
                  const canShare = await Sharing.isAvailableAsync();
                  if (!canShare) {
                    Alert.alert('Paylaşım kullanılamıyor', 'Bu platformda direkt indirme desteklenmiyor, lütfen paylaşımı kullanın.');
                  } else {
                    await Sharing.shareAsync(uriTmp);
                  }
                }
              } catch (e: any) {
                Alert.alert('Hata', e?.message || 'JPEG kaydedilirken hata oluştu');
              } finally {
                setIsExportOptionsOpen(false);
              }
            }}
          >
            <Text style={styles.exportActionText}>JPEG olarak indir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exportAction}
            onPress={async () => {
              try {
                const uriTmp: string = await viewShotRef.current?.capture?.();
                const canShare = await Sharing.isAvailableAsync();
                if (!canShare) {
                  Alert.alert('Paylaşım kullanılamıyor', 'Bu cihazda paylaşım desteklenmiyor');
                } else {
                  await Sharing.shareAsync(uriTmp);
                }
              } catch (e: any) {
                Alert.alert('Hata', e?.message || 'JPEG paylaşılırken hata oluştu');
              } finally {
                setIsExportOptionsOpen(false);
              }
            }}
          >
            <Text style={styles.exportActionText}>JPEG olarak paylaş</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exportAction}
            onPress={async () => {
              try {
                const rowsHtml = columns
                  .map((c: any) => {
                    const v = (rowData[c.key] ?? 'N/A') as string;
                    return `<tr><td>${c.label}</td><td>${String(v)}</td></tr>`;
                  })
                  .join('');
                const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><style>
                  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 24px; }
                  h1 { font-size: 18px; margin: 0 0 16px; }
                  table { width: 100%; border-collapse: collapse; }
                  td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
                  td:first-child { font-weight: 600; width: 40%; }
                </style></head><body>
                <h1>${rowData.customerOrder || rowData.invoice || 'Order'} Detay</h1>
                <table>${rowsHtml}</table>
                </body></html>`;
                const { uri } = await Print.printToFileAsync({ html });
                const fileName = `RowDetail-${Date.now()}.pdf`;
                if (Platform.OS === 'android') {
                  await saveToDownloadsAndroid(uri, fileName, 'application/pdf');
                } else {
                  const canShare = await Sharing.isAvailableAsync();
                  if (!canShare) {
                    Alert.alert('Paylaşım kullanılamıyor', 'Bu platformda direkt indirme desteklenmiyor, lütfen paylaşımı kullanın.');
                  } else {
                    await Sharing.shareAsync(uri);
                  }
                }
              } catch (e: any) {
                Alert.alert('Hata', e?.message || 'PDF kaydedilirken hata oluştu');
              } finally {
                setIsExportOptionsOpen(false);
              }
            }}
          >
            <Text style={styles.exportActionText}>PDF olarak indir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exportAction}
            onPress={async () => {
              try {
                const rowsHtml = columns
                  .map((c: any) => {
                    const v = (rowData[c.key] ?? 'N/A') as string;
                    return `<tr><td>${c.label}</td><td>${String(v)}</td></tr>`;
                  })
                  .join('');
                const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><style>
                  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 24px; }
                  h1 { font-size: 18px; margin: 0 0 16px; }
                  table { width: 100%; border-collapse: collapse; }
                  td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
                  td:first-child { font-weight: 600; width: 40%; }
                </style></head><body>
                <h1>${rowData.customerOrder || rowData.invoice || 'Order'} Detay</h1>
                <table>${rowsHtml}</table>
                </body></html>`;
                const { uri } = await Print.printToFileAsync({ html });
                const canShare = await Sharing.isAvailableAsync();
                if (!canShare) {
                  Alert.alert('Paylaşım kullanılamıyor', 'Bu cihazda paylaşım desteklenmiyor');
                } else {
                  await Sharing.shareAsync(uri);
                }
              } catch (e: any) {
                Alert.alert('Hata', e?.message || 'PDF paylaşılırken hata oluştu');
              } finally {
                setIsExportOptionsOpen(false);
              }
            }}
          >
            <Text style={styles.exportActionText}>PDF olarak paylaş</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.exportAction, styles.exportCancel]} onPress={() => setIsExportOptionsOpen(false)}>
            <Text style={styles.exportCancelText}>Vazgeç</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  captureContainer: {
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 0,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  exportButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#D53439',
    marginRight: 6,
  },
  detailList: {
    paddingTop: 12,
    paddingHorizontal: 12,
    flex: 1,
    paddingBottom: 24,
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
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
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
  exportOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  exportBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  exportSheet: {
    width: '92%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    fontFamily: 'MuseoSans-Bold',
  },
  exportAction: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  exportActionText: {
    fontSize: 15,
    color: '#383838',
    fontFamily: 'MuseoSans-Medium',
  },
  exportCancel: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    marginTop: 4,
  },
  exportCancelText: {
    fontSize: 15,
    color: '#FF3B30',
    fontFamily: 'MuseoSans-Bold',
  },
});

export default RowDetailModal; 