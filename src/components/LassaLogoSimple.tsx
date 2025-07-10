import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LassaLogoSimpleProps {
  width?: number;
  height?: number;
}

const LassaLogoSimple: React.FC<LassaLogoSimpleProps> = ({ 
  width = 120, 
  height = 40 
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <View style={styles.logoBox}>
        <View style={styles.lassaSection}>
          <Text style={styles.lassaText}>LASSA</Text>
          <View style={styles.underline} />
        </View>
        <View style={styles.cisSection}>
          <Text style={styles.cisText}>CIS</Text>
          <Text style={styles.cisSubtext}>CUSTOMER</Text>
          <Text style={styles.cisSubtext}>INFO SYSTEM</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(213, 52, 57, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lassaSection: {
    marginRight: 12,
    alignItems: 'center',
  },
  lassaText: {
    color: '#D53439',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  underline: {
    width: 50,
    height: 2,
    backgroundColor: '#D53439',
    marginTop: 2,
  },
  cisSection: {
    alignItems: 'center',
  },
  cisText: {
    color: '#D53439',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cisSubtext: {
    color: '#D53439',
    fontSize: 6,
    fontWeight: '500',
    opacity: 0.8,
    lineHeight: 7,
  },
});

export default LassaLogoSimple; 