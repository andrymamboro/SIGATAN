// authUser.js - Helper untuk login dan gabung data user Supabase Auth + tabel users
import { supabase } from './db';

/**
 * Ambil user login (gabungan Supabase Auth dan tabel users)
 * @returns {Promise<object|null>} user gabungan atau null jika tidak login
 */
export async function getCurrentUser() {
  // Ambil user dari Supabase Auth
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  // Cari user di tabel users berdasarkan auth_id, uid, atau email
  let userApp = null;

  // 1. Cari berdasarkan auth_id
  let { data } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authUser.id)
    .single();
  userApp = data;

  // 2. Jika tidak ketemu, cari berdasarkan uid
  if (!userApp) {
    let { data } = await supabase
      .from('users')
      .select('*')
      .eq('uid', authUser.id)
      .single();
    userApp = data;
    // Jika ketemu, update auth_id
    if (userApp && !userApp.auth_id) {
      await supabase
        .from('users')
        .update({ auth_id: authUser.id })
        .eq('id', userApp.id);
    }
  }

  // 3. Jika tidak ketemu, cari berdasarkan email
  if (!userApp && authUser.email) {
    let { data } = await supabase
      .from('users')
      .select('*')
      .eq('email', authUser.email)
      .single();
    userApp = data;
    // Jika ketemu, update uid dan auth_id
    if (userApp) {
      await supabase
        .from('users')
        .update({ uid: authUser.id, auth_id: authUser.id })
        .eq('id', userApp.id);
    }
  }

  // Gabungkan data Auth dan Users jika ditemukan
  return userApp ? { ...authUser, ...userApp } : null;
}

// Contoh penggunaan:
// import { getCurrentUser } from '@/api/authUser';
// const user = await getCurrentUser();
