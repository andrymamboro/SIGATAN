import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MainLayout from '../components/MainLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getCurrentUser } from '../api/client';

function ProfilUser({ navigation }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      if (!u) {
        navigation.replace('Login');
      } else {
        setUser(u);
      }
    })();
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  };

  return (
    <MainLayout navigation={navigation}>
      <View style={styles.headerRed}>
        <Text style={styles.headerTitle}>Profil Pengguna</Text>
      </View>
      <View style={styles.profileCard}>
        {user && (
          <>
            <Text style={styles.profileName}>{user.full_name ? user.full_name.toUpperCase() : user.userName?.toUpperCase() || ''}</Text>
            <Text style={styles.profileRole}>{user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : ''}</Text>
            <View style={styles.officeCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="location-on" size={22} color="#ffe066" style={{ marginRight: 8 }} />
                <View>
                  <Text style={styles.officeTitle}>{user.kecamatan}</Text>
                  <Text style={styles.officeAddress}>{user.kelurahan}</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
      <ScrollView style={styles.scrollSection} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Section Menu */}
        <View style={styles.sectionMenu}>
          <MenuItem icon={<Ionicons name="document-text-outline" size={22} color="#fff" />} label="Kebijakan Privasi" />
          <MenuItem icon={<Ionicons name="star-outline" size={22} color="#fff" />} label="Beri Kami Nilai" rightText="App version 6.0.3" />
        </View>
        <View style={styles.sectionMenu}>
          <Text style={styles.sectionTitle}>Pengaturan</Text>
          <MenuItem icon={<Ionicons name="settings-outline" size={22} color="#fff" />} label="Pengaturan" />
        </View>
        <View style={styles.sectionMenu}>
          <Text style={styles.sectionTitle}>Akun</Text>
          <MenuItem icon={<Ionicons name="person-outline" size={22} color="#fff" />} label="Akun dan Keamanan" />
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logout}>Keluar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

function MenuItem({ icon, label, rightText }) {
  return (
    <View style={styles.menuItem}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>{icon}<Text style={styles.menuLabel}>{label}</Text></View>
      {rightText && <Text style={styles.menuRight}>{rightText}</Text>}
      <MaterialIcons name="chevron-right" size={22} color="#fff" style={{ marginLeft: 8 }} />
    </View>
  );
}

export default ProfilUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b80013',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerRed: {
    backgroundColor: '#b80013',
    paddingTop: 36,
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  profileCard: {
    backgroundColor: '#b80013',
    borderRadius: 16,
    marginHorizontal: 18,
    marginTop: -32,
    marginBottom: 18,
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    // elevation: 2, // shadow dihilangkan
  },
  profileName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 1,
  },
  profileRole: {
    color: '#f3cfcf',
    fontSize: 15,
    marginTop: 2,
    marginBottom: 8,
  },
  officeCard: {
    backgroundColor: '#d32f2f',
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    marginBottom: 8,
    // elevation: 2, // shadow dihilangkan
  },
  officeTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  officeAddress: {
    color: '#ffe0e0',
    fontSize: 13,
    marginTop: 2,
  },
  scrollSection: {
    flex: 1,
    backgroundColor: '#232323',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 18,
    paddingHorizontal: 0,
  },
  sectionMenu: {
    backgroundColor: '#232323',
    borderRadius: 16,
    marginHorizontal: 18,
    marginBottom: 18,
    paddingVertical: 8,
    paddingHorizontal: 0,
    elevation: 1,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 18,
    marginTop: 8,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuLabel: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 12,
  },
  menuRight: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.7,
    marginRight: 8,
  },
  logout: {
    color: '#ffb4b4',
    fontSize: 15,
    marginLeft: 18,
    marginTop: 10,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 32,
  },
});
