import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DayHeader({ date, isToday }) {
  const formattedDate = isToday 
    ? "Aujourd'hui" 
    : format(new Date(date), 'EEEE d MMMM', { locale: fr });

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formattedDate}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize'
  },
  line: {
    height: 2,
    width: 40,
    backgroundColor: '#FF6154',
    marginTop: 8
  }
}); 