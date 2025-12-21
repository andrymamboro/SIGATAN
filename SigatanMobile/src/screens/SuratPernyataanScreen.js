import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainLayout from '../components/MainLayout';

const SuratPernyataanScreen = ({ route, navigation }) => {
  const { data } = route.params || {};
  return (
    <MainLayout navigation={navigation} title="Surat Pernyataan Tanah">
      <View style={styles.container}>
        <Text style={styles.title}>Surat Pernyataan Tanah</Text>
        <Text style={styles.desc}>Template surat pernyataan tanah akan ditampilkan di sini.</Text>
        {/* TODO: Render data tanah dan format surat sesuai kebutuhan */}
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#c1001f',
  },
  desc: {
    fontSize: 16,
    color: '#333',
  },
});

export default function SuratPernyataanScreen() { return null; }
