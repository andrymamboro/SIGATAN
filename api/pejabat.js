// api/pejabat.js
// Mendapatkan data pejabat berdasarkan kecamatan & kelurahan
import { supabase } from './db';

export async function getPejabatByWilayah(kecamatan, kelurahan) {
  // Ambil semua pejabat aktif di kecamatan/kelurahan
  let query = supabase
    .from('pejabat')
    .select('*')
    .eq('kecamatan', kecamatan)
    .eq('aktif', true);
  if (kelurahan) query = query.eq('kelurahan', kelurahan);
  const { data, error } = await query;
  if (error) throw error;
  // Mapping jabatan ke key form
  const map = {
    'PPATK Kecamatan': 'camat',
    'Camat': 'camat',
    'Lurah': 'lurah',
    'Kasi Pemerintahan': 'kasi_pemerintahan',
    'Staf Administrasi Kecamatan': 'administrasi_kecamatan',
  };
  const result = {};
  data.forEach((p) => {
    const key = map[p.jabatan];
    if (key) {
      result[`nama_${key}`] = p.nama;
      result[`nip_${key}`] = p.nip;
      result[`jabatan_${key}`] = p.jabatan;
    }
  });
  return result;
}
