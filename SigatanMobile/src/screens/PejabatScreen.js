
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../api/supabaseClient';
import MainLayout from '../components/MainLayout';

export default function PejabatScreen({ navigation }) {
  const [pejabat, setPejabat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPejabat = async () => {
      const { data, error } = await supabase.from('pejabat').select('*');
      if (!error && data) setPejabat(data);
      setLoading(false);
    };
    fetchPejabat();
  }, []);

  if (loading) {
    return (
      <MainLayout navigation={navigation}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout navigation={navigation}>
      <View style={styles.container}>
        <Text style={styles.title}>Daftar Pejabat</Text>
        <FlatList
          data={pejabat}
          keyExtractor={item => item.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.nama}</Text>
              <Text style={styles.jabatan}>{item.jabatan}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Tidak ada data pejabat.</Text>}
        />
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  jabatan: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 32,
  },
});
