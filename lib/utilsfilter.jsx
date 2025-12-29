export function getKelurahanOptions(wilayahList, filterKecamatan, user) {
  if (!user) return [];

  if (user.role === 'super_admin') {
    // Semua kelurahan
    return [...new Set(wilayahList.map(w => w.kelurahan))];
  }
  if (user.role === 'admin_kecamatan') {
    // Semua kelurahan di kecamatan admin
    return [...new Set(wilayahList.filter(w => w.kecamatan === user.kecamatan).map(w => w.kelurahan))];
  }
  if (user.role === 'admin_kelurahan') {
    // Hanya kelurahan admin
    return [...new Set(wilayahList.filter(w => w.kelurahan === user.kelurahan).map(w => w.kelurahan))];
  }
  if (user.role === 'member' || user.role === 'user') {
    // Semua kelurahan (atau bisa disesuaikan)
    return [...new Set(wilayahList.map(w => w.kelurahan))];
  }
  return [];
}

export function getKecamatanOptions(wilayahList, user) {
  if (!user) return [];
  if (user.role === 'super_admin') {
    // Semua kecamatan
    return [...new Set(wilayahList.map(w => w.kecamatan))];
  }
  if (user.role === 'admin_kecamatan') {
    // Hanya kecamatan admin
    return [user.kecamatan];
  }
  if (user.role === 'admin_kelurahan') {
    // Hanya kecamatan dari kelurahan admin
    const kecamatan = wilayahList.find(w => w.kelurahan === user.kelurahan)?.kecamatan;
    return kecamatan ? [kecamatan] : [];
  }
  if (user.role === 'member' || user.role === 'user') {
    // Semua kecamatan (atau bisa disesuaikan)
    return [...new Set(wilayahList.map(w => w.kecamatan))];
  }
  return [];
}


export function filterTanah(list, searchTerm, kecamatan, kelurahan, status) {
  return list.filter(tanah => {
    // Filter nama pemilik (jika searchTerm diisi)
    if (searchTerm && searchTerm !== 'all' && !tanah.nama_pemilik?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Filter kecamatan (jika diisi dan bukan 'all')
    if (kecamatan && kecamatan !== 'all' && tanah.kecamatan !== kecamatan) {
      return false;
    }
    // Filter kelurahan (jika diisi dan bukan 'all')
    if (kelurahan && kelurahan !== 'all' && tanah.kelurahan !== kelurahan) {
      return false;
    }
    // Filter status (jika diisi dan bukan 'all')
    if (status && status !== 'all' && tanah.status !== status) {
      return false;
    }
    return true;
  });
}