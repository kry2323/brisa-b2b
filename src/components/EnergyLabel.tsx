import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Simple static Energy Label representation rendered locally
// This avoids remote images and works offline.
const EnergyLabel: React.FC<{ width?: number } > = ({ width = 110 }) => {
  const aspectRatio = 110 / 160;
  const height = width / aspectRatio;

  const grades = [
    { letter: 'A', color: '#39B54A' },
    { letter: 'B', color: '#7AC943' },
    { letter: 'C', color: '#D9E021' },
    { letter: 'D', color: '#FBB03B' },
    { letter: 'E', color: '#F7931E' },
    { letter: 'F', color: '#F15A24' },
    { letter: 'G', color: '#C1272D' },
  ];

  return (
    <View style={[styles.container, { width, height }]}> 
      {/* Top rows */}
      <View style={styles.topRow}>
        {/* Left fuel efficiency block with bars */}
        <View style={styles.leftBlock}>
          <View style={styles.iconPlaceholder} />
          <View style={styles.barsContainer}>
            {grades.map((g, idx) => (
              <View key={g.letter} style={styles.barRow}>
                <View style={[styles.gradeTag, { backgroundColor: g.color }]}>
                  <Text style={styles.gradeText}>{g.letter}</Text>
                </View>
                <View style={styles.barLine} />
              </View>
            ))}
          </View>
        </View>

        {/* Right wet grip block (letters with dotted lines) */}
        <View style={styles.rightBlock}>
          <View style={styles.iconPlaceholder} />
          <View style={styles.lettersContainer}>
            {grades.map(g => (
              <View style={styles.letterRow} key={`right-${g.letter}`}>
                <Text style={styles.letterText}>{g.letter}</Text>
                <View style={styles.dotLine} />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Bottom noise block */}
      <View style={styles.bottomRow}>
        <View style={styles.noiseIcon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: '#1E90FF',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    overflow: 'hidden',
    padding: 4,
  },
  topRow: {
    flexDirection: 'row',
    flex: 1,
    gap: 4,
  },
  leftBlock: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#1E90FF',
    borderRadius: 6,
    padding: 4,
  },
  rightBlock: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#1E90FF',
    borderRadius: 6,
    padding: 4,
  },
  iconPlaceholder: {
    height: 14,
    marginBottom: 4,
    backgroundColor: '#E6F0FF',
    borderRadius: 3,
  },
  barsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gradeTag: {
    width: 18,
    height: 10,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    color: '#fff',
    fontSize: 7,
    fontWeight: '800',
  },
  barLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#DDD',
    borderRadius: 2,
  },
  lettersContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  letterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  letterText: {
    fontSize: 8,
    color: '#333',
    fontWeight: '700',
    width: 8,
  },
  dotLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  bottomRow: {
    marginTop: 4,
    borderWidth: 2,
    borderColor: '#1E90FF',
    borderRadius: 6,
    height: 34,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  noiseIcon: {
    width: 22,
    height: 22,
    backgroundColor: '#E6F0FF',
    borderRadius: 11,
  },
});

export default EnergyLabel;


