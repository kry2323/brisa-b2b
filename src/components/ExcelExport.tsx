import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { t } from '../utils/translations';

interface ExcelExportProps {
  data: any[];
  visibleColumns: { key: string; label: string; visible: boolean }[];
  fileName?: string;
  buttonStyle?: object;
  buttonTextStyle?: object;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
}

const ExcelExport: React.FC<ExcelExportProps> = ({
  data,
  visibleColumns,
  fileName = 'report',
  buttonStyle,
  buttonTextStyle,
  buttonText = t('components.excelExport.buttonText'),
  buttonIcon,
}) => {
  const exportToExcel = async () => {
    try {
      // Filter only visible columns
      const filteredColumns = visibleColumns.filter(col => col.visible);
      
      // Create worksheet with only visible columns
      const worksheet = XLSX.utils.json_to_sheet(
        data.map(item => {
          const filteredItem: Record<string, any> = {};
          filteredColumns.forEach(col => {
            filteredItem[col.label] = item[col.key];
          });
          return filteredItem;
        })
      );
      
      // Create workbook and add the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
      
      // Generate Excel file
      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      
      // Create a temporary file path
      const fileUri = `${FileSystem.documentDirectory}${fileName}.xlsx`;
      
      // Write the file
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Share the file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: t('components.excelExport.downloadDialog'),
        UTI: 'com.microsoft.excel.xlsx',
      });
      
      Alert.alert(t('common.success'), t('components.excelExport.successMessage'));
    } catch (error) {
      console.error('Excel export error:', error);
      Alert.alert(t('common.error'), t('components.excelExport.errorMessage'));
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={exportToExcel}
    >
      {buttonIcon}
      <Text style={[styles.buttonText, buttonTextStyle]}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
  },
});

export default ExcelExport;