import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Linking } from 'react-native';
import MainLayout from '../components/MainLayout';
import { supabase } from '../api/supabaseClient';
import { MaterialIcons, Feather } from '@expo/vector-icons';

export default function DetailTanahScreen({ route, navigation }) {
  const { id } = route.params || {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const { data } = await supabase.from('tanah').select('*').eq('id', id).single();
      setData(data || null);
      setLoading(false);
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <MainLayout navigation={navigation}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#c1001f" />
        </View>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout navigation={navigation}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#c1001f', fontWeight: 'bold', fontSize: 18 }}>Data tidak ditemukan</Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout navigation={navigation}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 120 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <MaterialIcons name="arrow-back" size={24} color="#c1001f" />
          <Text style={{ color: '#c1001f', fontWeight: 'bold', marginLeft: 6 }}>Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detail Data Tanah</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, badgeColor(data.status)]}>
            <Text style={styles.badgeText}>{data.status || 'Proses'}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Pemilik</Text>
          <Info label="Nama Lengkap" value={data.nama_pemilik} />
          <Info label="NIK" value={data.nik_pemilik} />
          <Info label="Umur" value={data.umur_pemilik ? `${data.umur_pemilik} Tahun` : '-'} />
          <Info label="Pekerjaan" value={data.pekerjaan_pemilik} />
          <Info label="Alamat" value={data.alamat_pemilik} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Tanah</Text>
          <Info label="Lokasi" value={data.lokasi} />
          <Info label="Kecamatan" value={data.kecamatan} />
          <Info label="Kelurahan" value={data.kelurahan} />
          <Info label="Luas (m²)" value={data.luas_meter ? `${data.luas_meter} m²` : '-'} />
          <Info label="Asal Usul" value={data.asal_usul} />
          <Info label="Batas Utara" value={data.batas_utara} />
          <Info label="Batas Timur" value={data.batas_timur} />
          <Info label="Batas Selatan" value={data.batas_selatan} />
          <Info label="Batas Barat" value={data.batas_barat} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Penerima / Transaksi</Text>
          <Info label="Nama Penerima" value={data.nama_penerima} />
          <Info label="NIK" value={data.nik_penerima} />
          <Info label="Umur" value={data.umur_penerima ? `${data.umur_penerima} Tahun` : '-'} />
          <Info label="Pekerjaan" value={data.pekerjaan_penerima} />
          <Info label="Alamat" value={data.alamat_penerima} />
          <Info label="Atas Nama" value={data.atas_nama} />
          <Info label="Jenis Transaksi" value={data.transaksi} />
          <Info label="Harga" value={data.harga ? `Rp${data.harga.toLocaleString('id-ID')}` : '-'} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Dokumen</Text>
          <Info label="Nomor SKPT" value={data.nomor_skpt} />
          <Info label="Tanggal SKPT" value={data.tanggal_skpt} />
          <Info label="Nomor Penyerahan" value={data.nomor_penyerahan} />
          <Info label="Tanggal Penyerahan" value={data.tanggal_penyerahan} />
        </View>
        {data.latitude && data.longitude && (
          <TouchableOpacity style={styles.mapBtn} onPress={() => Linking.openURL(`https://www.google.com/maps?q=${data.latitude},${data.longitude}`)}>
            <Feather name="map-pin" size={18} color="#388e3c" />
            <Text style={{ color: '#388e3c', fontWeight: 'bold', marginLeft: 6 }}>Lihat di Google Maps</Text>
          </TouchableOpacity>
        )}
        {data.latitude && data.longitude && (
          <View style={styles.qrSection}>
            <Text style={styles.sectionTitle}>QR Lokasi Tanah</Text>
            <Image
              style={styles.qrImg}
              source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`https://www.google.com/maps?q=${data.latitude},${data.longitude}`)}` }}
            />
            <Text style={styles.qrHint}>Scan QR untuk buka lokasi di Google Maps</Text>
          </View>
        )}
      </ScrollView>
    </MainLayout>
  );
}

function Info({ label, value }) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 4, alignItems: 'flex-start' }}>
      <Text style={{ color: '#888', width: 120, fontSize: 13 }}>{label}</Text>
      <Text
        style={{ color: '#222', fontWeight: 'bold', fontSize: 13, flex: 1, flexWrap: 'wrap' }}
        numberOfLines={0}
        ellipsizeMode="tail"
      >
        {value || '-'}
      </Text>
    </View>
  );
}

function badgeColor(status) {
  if (status === 'Selesai') return { backgroundColor: '#e0f7e9' };
  if (status === 'Ditolak') return { backgroundColor: '#ffe0e0' };
  return { backgroundColor: '#fffbe0' };
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: 'bold', color: '#c1001f', marginBottom: 8 },
  badgeRow: { flexDirection: 'row', marginBottom: 12 },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  badgeText: { fontWeight: 'bold', fontSize: 12 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 14 },
  sectionTitle: { fontWeight: 'bold', color: '#c1001f', marginBottom: 8, fontSize: 15 },
  mapBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 18 },
  qrSection: { alignItems: 'center', marginTop: 18, marginBottom: 24 },
  qrImg: { width: 180, height: 180, marginVertical: 12 },
  qrHint: { fontSize: 12, color: '#888', marginTop: 4, textAlign: 'center' },
});
