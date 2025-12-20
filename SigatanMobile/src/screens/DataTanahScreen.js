import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, Image } from 'react-native';
import MainLayout from '../components/MainLayout';
import { supabase } from '../api/supabaseClient';
import { MaterialIcons, Feather } from '@expo/vector-icons';

export default function DataTanahScreen({ navigation }) {
  const [dataTanah, setDataTanah] = useState([]);
  const [search, setSearch] = useState('');
  const [qrModal, setQrModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchDataTanah();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchDataTanah();
    }, [])
  );

  const fetchDataTanah = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('tanah').select('*').order('created_date', { ascending: false });
    if (!error) setDataTanah(data || []);
    setLoading(false);
  };

  const filtered = dataTanah.filter(t => {
    const s = search.toLowerCase();
    return (
      t.nama_pemilik?.toLowerCase().includes(s) ||
      t.nama_penerima?.toLowerCase().includes(s) ||
      t.kelurahan?.toLowerCase().includes(s) ||
      (t.luas_meter + '').includes(s)
    );
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.pemilik}>{item.nama_pemilik}</Text>
          {item.nama_penerima ? (
            <Text style={styles.penerima}>→ {item.nama_penerima}</Text>
          ) : null}
          <Text style={styles.kelurahan}>{item.kelurahan}</Text>
          <Text style={styles.luas}>Luas: {item.luas_meter} m²</Text>
        </View>
        <View style={[styles.badge, badgeColor(item.status)]}>
          <Text style={styles.badgeText}>{item.status || 'Proses'}</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('DetailTanah', { id: item.id })}>
          <Feather name="eye" size={20} color="#1976d2" />
          <Text style={styles.actionText}>Detail</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => {
          navigation.navigate('MapViewScreen', {
            id: item.id,
            latitude: item.latitude,
            longitude: item.longitude,
            polygonCoords: item.polygon_coords
          });
        }}>
          <MaterialIcons
            name="location-on"
            size={22}
            color={
              item.status === 'Selesai'
                ? '#EAB308'
                : item.status === 'Ditolak'
                ? '#c1001f'
                : '#3b82f6'
            }
          />
          <Text style={[styles.actionText, {
            color:
              item.status === 'Selesai'
                ? '#EAB308'
                : item.status === 'Ditolak'
                ? '#c1001f'
                : '#3b82f6'
          }]}>Peta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => { setQrData(item); setQrModal(true); }}>
          <Feather name="qrcode" size={20} color="#c1001f" />
          <Text style={[styles.actionText, { color: '#c1001f' }]}>QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  function badgeColor(status) {
    if (status === 'Selesai') return { backgroundColor: '#e0f7e9' };
    if (status === 'Ditolak') return { backgroundColor: '#ffe0e0' };
    return { backgroundColor: '#fffbe0' };
  }

  return (
    <MainLayout navigation={navigation}>
      <View style={styles.header}>
        <Text style={styles.title}>Data Tanah</Text>
        <TextInput
          style={styles.search}
          placeholder="Cari nama, penerima, kelurahan, luas..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id + ''}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
        refreshing={loading}
        onRefresh={fetchDataTanah}
        ListEmptyComponent={<Text style={{ color: '#aaa', textAlign: 'center', marginTop: 32 }}>Tidak ada data tanah</Text>}
      />
      {/* Modal QR Code */}
      <Modal visible={qrModal} transparent animationType="slide" onRequestClose={() => setQrModal(false)}>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>QR Lokasi Tanah</Text>
            {qrData && (
              <>
                <Text style={styles.pemilik}>{qrData.nama_pemilik}</Text>
                {qrData.nama_penerima ? <Text style={styles.penerima}>→ {qrData.nama_penerima}</Text> : null}
                <Text style={styles.luas}>Luas: {qrData.luas_meter} m²</Text>
                <Image
                  style={styles.qrImg}
                  source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`https://www.google.com/maps?q=${qrData.latitude},${qrData.longitude}`)}` }}
                />
                <Text style={styles.qrHint}>Scan QR untuk buka lokasi di Google Maps</Text>
              </>
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setQrModal(false)}>
              <Text style={{ color: '#c1001f', fontWeight: 'bold' }}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  header: { padding: 18, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#c1001f', marginBottom: 8 },
  search: { backgroundColor: '#f5f5f5', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, fontSize: 14, marginBottom: 2 },
  card: { backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 14, marginVertical: 7, padding: 14, elevation: 1 },
  pemilik: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  penerima: { color: '#888', fontSize: 14, marginTop: 2 },
  kelurahan: { color: '#c1001f', fontSize: 13, marginTop: 2 },
  luas: { color: '#444', fontSize: 13, marginTop: 2 },
  badge: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8 },
  badgeText: { fontWeight: 'bold', fontSize: 12 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  actionBtn: { alignItems: 'center', flex: 1 },
  actionText: { fontSize: 12, marginTop: 2, color: '#222' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 320, alignItems: 'center' },
  modalTitle: { fontWeight: 'bold', fontSize: 18, color: '#c1001f', marginBottom: 8 },
  qrImg: { width: 180, height: 180, marginVertical: 12 },
  qrHint: { fontSize: 12, color: '#888', marginTop: 4, textAlign: 'center' },
  closeBtn: { marginTop: 16, padding: 8 },
});
