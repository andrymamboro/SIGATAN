
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

function MainLayout({ navigation, children }) {
  // Dapatkan route aktif dari navigation state
  let activeRoute = '';
  try {
    const state = navigation.getState();
    const routes = state.routes;
    const index = state.index;
    activeRoute = routes[index]?.name;
  } catch (_) {}

  return (
    <View style={styles.container}>
      {/* Background header */}
      <View style={styles.headerBg} />
      <View style={{ flex: 1 }}>{children}</View>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.replace('Home')}>
          <MaterialIcons name="home" size={30} color={activeRoute === 'Home' ? '#C1001F' : '#fff'} />
          <Text style={[styles.navLabel, activeRoute === 'Home' && styles.navLabelActive]}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.replace('DataTanahScreen')}>
          <MaterialIcons name="layers" size={28} color={activeRoute === 'DataTanahScreen' ? '#C1001F' : '#fff'} />
          <Text style={[styles.navLabel, activeRoute === 'DataTanahScreen' && styles.navLabelActive]}>Data Tanah</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.scanButton}>
          <MaterialIcons name="qr-code-scanner" size={36} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomNavItem, activeRoute === 'Maps' && styles.bottomNavItemActive]} onPress={() => navigation.replace('Maps')}>
          <MaterialIcons name="map" size={28} color={activeRoute === 'Maps' ? '#C1001F' : '#fff'} />
          <Text style={[styles.navLabel, activeRoute === 'Maps' && styles.navLabelActive]}>Peta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.replace('ProfilUser')}>
          <MaterialIcons name="person" size={28} color={activeRoute === 'ProfilUser' ? '#C1001F' : '#fff'} />
          <Text style={[styles.navLabel, activeRoute === 'ProfilUser' && styles.navLabelActive]}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default MainLayout;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#222', position: 'relative' },
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: '#C1001F',
    zIndex: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  bottomNav: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#222',
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 12,
    zIndex: 10,
    paddingHorizontal: 8,
    
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
   bottom: 15,
  },
  navLabel: { color: '#fff', fontSize: 12, marginTop: 2 },
  navLabelActive: { color: '#C1001F', fontWeight: 'bold' },
  scanButton: {
    backgroundColor: '#C1001F',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -50,
    elevation: 8,
    zIndex: 20,
    marginHorizontal: 2,
    borderWidth: 4,
    borderColor: '#fff',
  },
  bottomNavItemActive: {
    borderRadius: 12,
  },
});
