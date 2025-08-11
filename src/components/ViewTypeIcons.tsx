import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ViewTypeIconProps {
  color: string;
  size?: number;
}

export const ListViewIcon: React.FC<ViewTypeIconProps> = ({ color, size = 20 }) => {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, { color, fontSize: size }]}>☰</Text>
    </View>
  );
};

export const GridViewIcon: React.FC<ViewTypeIconProps> = ({ color, size = 20 }) => {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, { color, fontSize: size }]}>▦</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: 'bold',
  },
});