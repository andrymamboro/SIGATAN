// Hitung umur dari tanggal lahir (string) sampai tahun tertentu (tahun penguasaan langsung)
// birthDateString: bisa "04 Mei 1980", "1980-05-04", dst
// tahunTarget: number/int, misal 2020
export function getUmurSampaiTahun(birthDateString, tahunTarget) {
  if (!birthDateString || !tahunTarget) return null;
  let str = birthDateString.trim();
  if (str.includes(',')) str = str.split(',').pop().trim();
  const bulanIndo = [
    'januari','februari','maret','april','mei','juni','juli','agustus','september','oktober','november','desember'
  ];
  let birthDate = null;
  const regexIndo = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/;
  const match = str.match(regexIndo);
  if (match) {
    let [_, d, bulan, y] = match;
    bulan = bulan.toLowerCase();
    const mIdx = bulanIndo.indexOf(bulan);
    if (mIdx >= 0) {
      birthDate = new Date(Number(y), mIdx, Number(d));
    }
  }
  if (!birthDate || isNaN(birthDate.getTime())) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      birthDate = new Date(str);
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
      const [d, m, y] = str.split('-').map(Number);
      birthDate = new Date(y, m - 1, d);
    } else {
      birthDate = new Date(str);
    }
  }
  if (!birthDate || isNaN(birthDate.getTime())) return null;
  let age = tahunTarget - birthDate.getFullYear();
  // Jika belum ulang tahun di tahun target, kurangi 1
  const now = new Date();
  const bulanIni = (tahunTarget === now.getFullYear()) ? now.getMonth() : 11;
  const tanggalIni = (tahunTarget === now.getFullYear()) ? now.getDate() : 31;
  if (bulanIni < birthDate.getMonth() || (bulanIni === birthDate.getMonth() && tanggalIni < birthDate.getDate())) {
    age--;
  }
  return age;
}
// Kalkulator umur: hitung umur dari tanggal lahir (format: YYYY-MM-DD)
// Contoh: getAgeFromDate('1990-12-29')


// Mendukung format: 'Palu, 04 Mei 1980', '04 Mei 1980', '1980-05-04', '04-05-1980', dst
export function getAgeFromDate(dateString) {
  if (!dateString) return null;
  const today = new Date();
  let str = dateString.trim();
  // Hilangkan lokasi jika ada koma
  if (str.includes(',')) str = str.split(',').pop().trim();
  // Cek format DD MMMM YYYY (Indonesia)
  const bulanIndo = [
    'januari','februari','maret','april','mei','juni','juli','agustus','september','oktober','november','desember'
  ];
  let birthDate = null;
  // Format: 04 Mei 1980
  const regexIndo = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/;
  const match = str.match(regexIndo);
  if (match) {
    let [_, d, bulan, y] = match;
    bulan = bulan.toLowerCase();
    const mIdx = bulanIndo.indexOf(bulan);
    if (mIdx >= 0) {
      birthDate = new Date(Number(y), mIdx, Number(d));
    }
  }
  // Format: YYYY-MM-DD atau DD-MM-YYYY
  if (!birthDate || isNaN(birthDate.getTime())) {
    // Coba parse ISO atau DD-MM-YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      birthDate = new Date(str);
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
      const [d, m, y] = str.split('-').map(Number);
      birthDate = new Date(y, m - 1, d);
    } else {
      // Fallback: native Date
      birthDate = new Date(str);
    }
  }
  if (!birthDate || isNaN(birthDate.getTime())) return null;
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Format hasil umur: "34 tahun" atau "-" jika tidak valid
export function formatUmur(dateString) {
  const age = getAgeFromDate(dateString);
  return age !== null && age >= 0 ? `${age} tahun` : '-';
}
