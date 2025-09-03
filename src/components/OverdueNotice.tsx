import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface OverdueNoticeProps {
  count: number;
  onPress: () => void;
}

const OverdueNotice: React.FC<OverdueNoticeProps> = ({ count, onPress }) => {
  if (!count || count <= 0) return null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View style={styles.container}>
        <Text style={styles.icon}>⏰</Text>
        <View style={styles.texts}>
          <Text style={styles.title}>Overdue Report</Text>
          <Text style={styles.subtitle}>{count} records found. Tap for details.</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 12,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#F5C2C7',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
    color: '#D53439',
  },
  texts: {
    flex: 1,
  },
  title: {
    color: '#D53439',
    fontSize: 14,
    fontWeight: '700',
  },
  subtitle: {
    color: '#A94442',
    fontSize: 12,
    marginTop: 2,
  },
});

export default OverdueNotice;


