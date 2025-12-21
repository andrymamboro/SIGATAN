import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout({ navigation, children }) {
  return (
    <View style={styles.container}>
      {/* Content */}
      <View style={styles.content}>{children}</View>
      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="home" style={styles.bottomNavIcon} size={26} color="#fff" />
          <Text style={styles.bottomNavLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('ScanQRCode')}>
          <Ionicons name="qr-code" style={styles.bottomNavIcon} size={26} color="#fff" />
          <Text style={styles.bottomNavLabel}>Scan QR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('ProfilUser')}>
          <Ionicons name="person" style={styles.bottomNavIcon} size={26} color="#fff" />
          <Text style={styles.bottomNavLabel}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavIcon: {
    fontSize: 26,
    color: '#fff',
    marginBottom: 2,
  },
  bottomNavLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
