import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AppLayout from '../components/AppLayout';
import { getCurrentUser } from '../api/client';

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      setUser(u);
    })();
  }, []);

  return (
    <AppLayout navigation={navigation}>
      <View style={styles.headerBg}>
        <Image source={require('../../assets/images/logo app.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>SIGATAN</Text>
        <Text style={styles.subtitle}>Sistem Informasi Geospasial Pertanahan</Text>
      </View>
      <View style={styles.inner}>
        {/* Ganti ilustrasi berikut dengan file PNG ilustrasi dashboard jika ada */}
        {/* <Image source={require('../../assets/dashboard-illustration.png')} style={styles.illustration} resizeMode="contain" /> */}
        <View style={styles.card}>
          <Text style={styles.welcome}>Selamat datang{user && user.full_name ? `, ${user.full_name}` : ''}!</Text>
          <Text style={styles.info}>Akses fitur aplikasi melalui menu di bawah.</Text>
        </View>

        {/* Menu utama dashboard */}
        <View style={styles.menuContainer}>
          <MenuButton
            label="Data Tanah"
            icon="📄"
            onPress={() => navigation.navigate('DataTanah')}
            color="#2563EB"
          />
          <MenuButton
            label="Peta Tanah"
            icon="🗺️"
            onPress={() => navigation.navigate('PetaTanah')}
            color="#059669"
          />
          <MenuButton
            label="Pejabat"
            icon="👤"
            onPress={() => navigation.navigate('Pejabat')}
            color="#F59E42"
          />
          <MenuButton
            label="User Manajemen"
            icon="🛡️"
            onPress={() => navigation.navigate('Login')}
            color="#6366F1"
          />
        </View>
      </View>
    </AppLayout>
  );
}

function MenuButton({ label, onPress, color, icon }) {
  return (
    <View style={{ width: '100%', maxWidth: 320, alignSelf: 'center', marginBottom: 12 }}>
      <View
        style={{
          backgroundColor: color,
          borderRadius: 12,
          elevation: 2,
          shadowColor: color,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 18,
        }}
      >
        <Text style={{ fontSize: 24, marginRight: 16, color: '#fff', width: 32, textAlign: 'left' }}>{icon}</Text>
        <Text
          onPress={onPress}
          style={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 17,
            flex: 1,
            textAlign: 'left',
          }}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBg: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    paddingVertical: 40,
    backgroundColor: '#2563eb',
    marginBottom: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 18,
    textAlign: 'center',
  },
  illustration: {
    width: 220,
    height: 140,
    marginBottom: 24,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
    borderRadius: 18,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
    maxWidth: 340,
  },
  menuContainer: {
    marginTop: 28,
    width: '100%',
    maxWidth: 340,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 6,
    textAlign: 'center',
  },
  info: {
    color: '#64748B',
    fontSize: 15,
    textAlign: 'center',
  },
});