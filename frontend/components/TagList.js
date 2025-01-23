import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';

export default function TagList({ tags }) {
  if (!tags || tags.length === 0) return null;

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {tags.map((tag, index) => (
        <Chip
          key={index}
          style={styles.chip}
          textStyle={styles.chipText}
          mode="outlined"
        >
          {tag}
        </Chip>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    flexDirection: 'row'
  },
  chip: {
    marginRight: 8,
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd'
  },
  chipText: {
    fontSize: 12,
    color: '#666'
  }
}); 