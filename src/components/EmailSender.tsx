import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../utils/translations';

interface EmailSenderProps {
  visible: boolean;
  onClose: () => void;
  data: any[];
  visibleColumns: { key: string; label: string; visible: boolean }[];
  reportName: string;
}

const EmailSender: React.FC<EmailSenderProps> = ({
  visible,
  onClose,
  data,
  visibleColumns,
  reportName,
}) => {
  const [emailAddresses, setEmailAddresses] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmails = (emails: string): boolean => {
    if (!emails.trim()) {
      return false;
    }

    const emailList = emails.split(/[,;\s]+/).filter(email => email.trim() !== '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Check if all emails are valid
    const allValid = emailList.every(email => emailRegex.test(email.trim()));
    
    if (!allValid) {
      Alert.alert(t('common.error'), t('components.emailSender.validationError'));
      return false;
    }
    
    if (emailList.length === 0) {
      Alert.alert(t('common.error'), t('components.emailSender.emptyEmailError'));
      return false;
    }
    
    return true;
  };

  const sendEmail = async () => {
    if (!validateEmails(emailAddresses)) {
      return;
    }

    setIsLoading(true);

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
      const fileName = `${reportName}_${new Date().toISOString().split('T')[0]}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}.xlsx`;
      
      // Write the file
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // In a real app, you would send this file to a server that would email it
      // For this mock implementation, we'll simulate a successful email send
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Split emails and format for display
      const emailList = emailAddresses.split(/[,;\s]+/).filter(email => email.trim() !== '');
      const formattedEmails = emailList.join(', ');
      
      Alert.alert(
        t('common.success'),
        t('components.emailSender.successMessage', { emails: formattedEmails }),
        [{ text: t('common.ok'), onPress: onClose }]
      );
    } catch (error) {
      console.error('Email sending error:', error);
      Alert.alert(t('common.error'), t('components.emailSender.errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{t('components.emailSender.title')}</Text>
          
          <Text style={styles.label}>
            {t('components.emailSender.emailAddresses')}
          </Text>
          <TextInput
            style={styles.input}
            value={emailAddresses}
            onChangeText={setEmailAddresses}
            placeholder={t('components.emailSender.placeholder')}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={sendEmail}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.sendButtonText}>{t('common.send')}</Text>
              )}
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
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'MuseoSans-Bold',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'MuseoSans-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#FFF',
    fontFamily: 'MuseoSans-Regular',
    minHeight: 80,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#8D8D8D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
  },
});

export default EmailSender;