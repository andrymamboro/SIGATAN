// Utility: Mendapatkan warna background/fill polygon/polyline berdasarkan status
// Catatan: Semua warna fill di bawah menggunakan alpha/transparansi (rgba) agar background polygon/polyline tidak menutupi peta sepenuhnya.

// Contoh: fillColor={getPolygonFillColor(tanah.status)}
// Utility: Daftar warna untuk keterangan/legend status marker & polygon
export const STATUS_COLOR_LEGEND = {
  Proses:   { color: '#3b82f6', label: 'Biru' },
  Selesai:  { color: '#EAB308', label: 'Kuning' },
  Ditolak:  { color: '#ef4444', label: 'Merah' },
  Hijau:    { color: '#22c55e', label: 'Hijau' },
  Orange:   { color: '#f97316', label: 'Orange' },
  Putih:    { color: '#ffffff', label: 'Putih' },
  Ungu:     { color: '#a21caf', label: 'Ungu' },
};

// Contoh penggunaan:
// STATUS_COLOR_LEGEND['Selesai'].color // => '#EAB308'
// STATUS_COLOR_LEGEND['Selesai'].label // => 'Kuning'


// Warna status untuk marker & polygon:
// Proses   : #3b82f6 (biru)
// Selesai  : #EAB308 (kuning)
// Ditolak  : #ef4444 (merah)
// Hijau    : #22c55e (green)
// Orange   : #f97316 (orange)
// Putih    : #ffffff (white)
// Ungu     : #a21caf (purple)
// Border polygon saat selected: #EAB308 (kuning)
// Warna garis drawing polyline/polygon: #2563eb (biru-tua)

// Utility to get color for drawing polyline/polygon (garis saat menggambar)
export function getDrawingLineColor() {    
  return '#2563eb'; // biru-tua
}

// Utility to get polygon color and border color based on status and selection
export function getSelectedPolygonColor() {
  return '#f97316'; // orange (atau ganti sesuai kebutuhan highlight)
}

// utils.js
export function getColors(status, isSelected) {
  if (status === 'Selesai') return { color: 'transparent', borderColor: '#EAB308' };
  if (status === 'Ditolak') return { color: 'transparent', borderColor: '#b91c1c' };
  if (status === 'Proses') return { color: 'transparent', borderColor: '#1d4ed8' };
  // Tambahkan status lain jika ada
  return { color: 'transparent', borderColor: '#1d4ed8' }; // default biru
}

export function getPolygonFillColor(status) {
   if (status === 'Selesai') return { color: '#22c55e', borderColor: '#16a34a' };
  if (status === 'Ditolak') return { color: '#ef4444', borderColor: '#b91c1c' };
  if (status === 'Proses') return { color: '#3b82f6', borderColor: '#1d4ed8' };
  // Tambahkan status lain jika ada
  return { color: '#3b82f6', borderColor: '#1d4ed8' }; // default biru
}

// Utility for custom circle marker icon (status color, white border, responsive size)

// import L from 'leaflet';

// export function createCircleIcon(status, size = 16) {
//   if (typeof window === 'undefined' || typeof document === 'undefined' || !L?.divIcon) {
//     // Bisa return null, atau fallback ke icon default Leaflet
//     return undefined;
//   }
//   // Ambil warna dari legend, fallback ke biru jika status tidak ada
//   const color = STATUS_COLOR_LEGEND[status]?.color || '#3b82f6';
//   return L.divIcon({
//     html: `<div style="
//       background:${color};
//       border:2px solid #fff;
//       width:${size}px;height:${size}px;
//       border-radius:50%;
//       box-shadow:0 0 4px #0002;
//       "></div>`,
//     className: '',
//     iconSize: [size, size],
//     iconAnchor: [size / 2, size / 2],
//     popupAnchor: [0, -size / 2]
//   });





