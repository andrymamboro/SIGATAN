import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TambahUser() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fitur Tambah User akan tersedia di sini.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  text: {
    fontSize: 18,
    color: '#2563EB',
    fontWeight: 'bold',
  },
});
