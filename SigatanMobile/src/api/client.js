import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabaseClient';

export const login = async (username, password) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();
  if (error || !data) throw new Error('Username atau password salah');
  await AsyncStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const logout = async () => {
  await AsyncStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
