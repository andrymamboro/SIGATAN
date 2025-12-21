import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { supabase } from '../api/supabaseClient';
import { getCurrentUser } from '../api/client';
import MainLayout from '../components/MainLayout';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

function HomeScreen({ navigation }) {
  const [banner, setBanner] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchBanner = async () => {
      const { data } = await supabase
        .from('banners')
        .select('*')
        .eq('active', true)
        .single();
      setBanner(data);
    };
    fetchBanner();
    (async () => {
      const u = await getCurrentUser();
      setUser(u);
    })();
  }, []);

  return (
    <MainLayout navigation={navigation}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../assets/images/logo app.png')} style={styles.logo} resizeMode="contain" />
          <View>
            <Text style={styles.appName}>SIGATAN</Text>
            <Text style={styles.appSub}>Sistem Informasi Geospasial Pertanahan</Text>
            <Text style={styles.appSub}>Kecamatan Palu Utara</Text>
          </View>
        </View>
        <Ionicons name="notifications-outline" size={26} color="#fff" />
      </View>
      {/* User Badge */}
      {user && (
        <View style={styles.userCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user.full_name ? user.full_name.toUpperCase() : user.username?.toUpperCase() || '-'}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'User'}</Text>
          </View>
        </View>
      )}
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Banner */}
        {banner && banner.image_url ? (
          <Image source={{ uri: banner.image_url }} style={styles.banner} />
        ) : (
            <View style={styles.banner} />
        )}

        {/* Tab Menu */}
        <View style={styles.tabMenu}>
          <TouchableOpacity style={styles.tabActive}><Text style={styles.tabActiveText}>Layanan</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Informasi</Text></TouchableOpacity>
        </View>

        {/* Menu Ikon Utama */}
        <View style={styles.menuRow}>
          <MenuIcon icon="location-pin" label="Cari Bidang" color="#FFB6B6" />
          <MenuIcon icon="gps-fixed" label="Swaplotting" color="#FFD6B6" />
          <MenuIcon icon="people" label="Cari Berkas" color="#B6E0FF" />
          <MenuIcon icon="schedule" label="Antrian Online" color="#E0B6FF" />
          <MenuIcon icon="info" label="Info Layanan" color="#FFE0B6" />
        </View>

        {/* Laci */}
        <Text style={styles.sectionTitle}>Laci</Text>
        <View style={styles.menuRow}>
          <MenuIcon icon="description" label="Sertipikatku" color="#B6D6FF" />
          <MenuIcon icon="assignment" label="Aktaku" color="#FFE0B6" />
          <MenuIcon icon="work" label="Tasku" color="#B6FFD6" />
        </View>
      </ScrollView>
    </MainLayout>
  );
}

function MenuIcon({ icon, label, color }) {
  return (
    <View style={styles.menuIconWrap}>
      <View style={[styles.menuIconCircle, { backgroundColor: color }]}> 
        <MaterialIcons name={icon} size={28} color="#fff" />
      </View>
      <Text style={styles.menuIconLabel}>{label}</Text>
    </View>
  );
}



export default HomeScreen;

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: 'rgba(222,255,255,0.3)',
    marginHorizontal: 18,
    marginTop: 0,
    marginBottom: 8,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  badge: {
    backgroundColor: 'rgba(193,0,31,0.7)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 10,
  },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  header: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 36,
    paddingBottom: 18,
    paddingHorizontal: 18,
    zIndex: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 48, height: 48, marginRight: 10, borderRadius: 24, backgroundColor: '#fff' },
  appName: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  appSub: { color: '#fff', fontSize: 12, opacity: 0.8 },
  banner: {
    width: '90%',
    height: 120,
    alignSelf: 'center',
    borderRadius: 18,
    marginVertical: 10,
    backgroundColor: '#eee',
  },
  tabMenu: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  tabActive: {
    backgroundColor: '#C1001F',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 6,
    marginRight: 8,
  },
  tabActiveText: { color: '#fff', fontWeight: 'bold', fontSize: 10 },
  tab: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 6,
  },
  tabText: { color: '#fff', fontSize: 10 },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  menuIconWrap: { alignItems: 'center', width: 70 },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    elevation: 2,
  },
  menuIconLabel: { color: '#fff', fontSize: 10, textAlign: 'center' },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 18,
    marginTop: 18,
    marginBottom: 4,
  },
});