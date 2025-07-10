import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface LassaLogoProps {
  width?: number;
  height?: number;
}

const LassaLogo: React.FC<LassaLogoProps> = ({ 
  width = 120, 
  height = 40 
}) => {
  const [showFallback, setShowFallback] = useState(false);

  // 3 saniye sonra fallback göster
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showFallback) {
    return (
      <View style={[styles.container, { width, height }]}>
        <Text style={styles.fallbackText}>LASSA</Text>
        <Text style={styles.fallbackSubtext}>CIS</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={{ uri: 'https://b2bcis.brisa-online.com/b2b/_ui/shared/images/template/lassa-cis-logo.svg' }}
        style={[styles.logo, { width, height }]}
        resizeMode="contain"
        onError={() => setShowFallback(true)}
        onLoad={() => setShowFallback(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  logo: {
    // Logo'nun orijinal görünümünü koru
  },
  fallbackText: {
    color: '#D53439',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  fallbackSubtext: {
    color: '#D53439',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default LassaLogo; 