
import React, { useState } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { login } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(username, password);
      await AsyncStorage.setItem('username', username);
      navigation.replace('Home');
    } catch (e) {
      Alert.alert('Login gagal', e.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.bg}>
      {/* Decorative background */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.container}>
        {/* Logo/Header */}
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/logo app.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.appTitle}>SIGATAN Mobile</Text>
          <Text style={styles.appDesc}>Sistem Informasi Geospasial Pertanahan</Text>
        </View>
        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Selamat Datang</Text>
          <Text style={styles.cardDesc}>Silakan masuk dengan akun Anda</Text>
          {/* Form */}
          <View style={{ marginTop: 16 }}>
            <View style={styles.inputGroup}>
              <Ionicons name="person" size={20} color="#2563EB" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Ionicons name="lock-closed" size={20} color="#2563EB" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword((v) => !v)}
                disabled={loading}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>Masuk</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.safeTextWrap}>
            <Ionicons name="shield-checkmark" size={16} color="#64748B" />
            <Text style={styles.safeText}>Login aman dan terenkripsi</Text>
          </View>
        </View>
        {/* Footer */}
        <Text style={styles.footer}>2025 andrimamboro web & App development.</Text>
        <Text style={{color: '#fff'}} >&copy; All rights reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
    zIndex: 2,
  },
  bg: {
    flex: 1,
    backgroundColor: '#C1001F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    top: -120,
    right: -120,
    width: 240,
    height: 240,
    backgroundColor: '#3B82F6',
    opacity: 0.15,
    borderRadius: 120,
    zIndex: 0,
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -120,
    left: -120,
    width: 240,
    height: 240,
    backgroundColor: '#64748B',
    opacity: 0.12,
    borderRadius: 120,
    zIndex: 0,
  },
  container: {
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: -10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    textShadowColor: '#1e293b',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  appDesc: {
    color: '#dbeafe',
    fontSize: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 2,
  },
  cardDesc: {
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 8,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 4,
  },
  loginBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  safeTextWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  safeText: {
    color: '#64748B',
    fontSize: 13,
    marginLeft: 6,
  },
  footer: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
});
