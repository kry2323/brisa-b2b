import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

const DatePicker = ({ value, onChange, placeholder = "DD/MM/YYYY" }: DatePickerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const [selectedDay, setSelectedDay] = useState(() => {
    if (value) {
      const parts = value.split('/');
      return parts.length > 0 ? parseInt(parts[0]) : 1;
    }
    return 1;
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (value) {
      const parts = value.split('/');
      return parts.length > 1 ? parseInt(parts[1]) : 1;
    }
    return 1;
  });

  const [selectedYear, setSelectedYear] = useState(() => {
    if (value) {
      const parts = value.split('/');
      return parts.length > 2 ? parseInt(parts[2]) : new Date().getFullYear();
    }
    return new Date().getFullYear();
  });

  const handleConfirm = () => {
    const day = selectedDay.toString().padStart(2, '0');
    const month = selectedMonth.toString().padStart(2, '0');
    const year = selectedYear.toString();
    const dateString = `${day}/${month}/${year}`;
    onChange(dateString);
    setIsVisible(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  const getMonthName = (month: number) => {
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return monthNames[month - 1];
  };

  return (
    <>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <View style={styles.calendarIconContainer}>
          <Text style={styles.calendarIcon}>📅</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tarih Seçin</Text>
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateContainer}>
              {/* Day Selection */}
              <View style={styles.columnContainer}>
                <Text style={styles.columnTitle}>Gün</Text>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.option,
                        selectedDay === day && styles.selectedOption
                      ]}
                      onPress={() => setSelectedDay(day)}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedDay === day && styles.selectedOptionText
                      ]}>
                        {day.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Month Selection */}
              <View style={styles.columnContainer}>
                <Text style={styles.columnTitle}>Ay</Text>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                  {months.map((month) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.option,
                        selectedMonth === month && styles.selectedOption
                      ]}
                      onPress={() => setSelectedMonth(month)}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedMonth === month && styles.selectedOptionText
                      ]}>
                        {getMonthName(month)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Year Selection */}
              <View style={styles.columnContainer}>
                <Text style={styles.columnTitle}>Yıl</Text>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.option,
                        selectedYear === year && styles.selectedOption
                      ]}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedYear === year && styles.selectedOptionText
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Onayla</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 0,
    fontSize: 16,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  inputText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  placeholder: {
    color: '#999',
  },
  calendarIconContainer: {
    backgroundColor: '#F44336',
    width: 30,
    height: 30,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
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
  dateContainer: {
    flexDirection: 'row',
    padding: 20,
  },
  columnContainer: {
    flex: 1,
    alignItems: 'center',
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  scrollView: {
    maxHeight: 200,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 2,
    borderRadius: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#8D8D8D',
    marginLeft: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DatePicker;