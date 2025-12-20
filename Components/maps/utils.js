// Utility: Mendapatkan warna background/fill polygon/polyline berdasarkan status
// Catatan: Semua warna fill di bawah menggunakan alpha/transparansi (rgba) agar background polygon/polyline tidak menutupi peta sepenuhnya.
export function getPolygonFillColor(status) {
  // Untuk 'no color' (benar-benar transparan), gunakan status 'no-color' atau 'none'
  if (status === 'no-color' || status === 'none') return 'rgba(0,0,0,0)'; // transparan penuh
  if (status === 'Selesai') return 'rgba(251,146,60,0.18)'; // orange-400
  if (status === 'Ditolak') return 'rgba(193,0,31,0.18)';
  if (status === 'Hijau') return 'rgba(34,197,94,0.18)';
  if (status === 'Ungu') return 'rgba(162,28,175,0.15)';
  return 'rgba(59,130,246,0.18)'; // default biru
}
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

export function getPolygonColors(status, isSelected) {
  let color = (status === 'Selesai' ? '#EAB308' : status === 'Ditolak' ? '#ef4444' : '#3b82f6');
  let borderColor = '#f97316';
  if (isSelected) {
    color = '#fff';
    borderColor = '#EAB308';
  }
  return { color, borderColor };
}
// Utility for custom circle marker icon (status color, white border, responsive size)
import L from 'leaflet';
export function createCircleIcon(status, zoom = 13) {
  // Ukuran marker
  const size = 16;
  // Ambil warna status
  const color = STATUS_COLOR_LEGEND[status]?.color || '#3b82f6';
  return L.divIcon({
    className: 'custom-marker-status',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.18);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2], // tengah-tengah lingkaran
    popupAnchor: [0, -size / 2],
  });
}

