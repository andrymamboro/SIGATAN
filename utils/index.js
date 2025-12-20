// Utility functions untuk aplikasi pertanahan

export function createPageUrl(pageName) {
  return `/${pageName.toLowerCase()}`;
}

export function formatDate(date) {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatCurrency(amount) {
  if (!amount) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

export function getStatusColor(status) {
  const colors = {
    'Proses': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Selesai': 'bg-green-100 text-green-700 border-green-200',
    'Ditolak': 'bg-red-100 text-red-700 border-red-200',
    'Pending': 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
}

export function truncateText(text, maxLength = 50) {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function calculateArea(coordinates) {
  // Hitung luas berdasarkan koordinat polygon
  // Simplified version - should use proper geospatial calculation
  if (!coordinates || coordinates.length < 3) return 0;
  // Return area in square meters
  return 0; // Placeholder
}

export function validateCoordinates(lat, lng) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  if (isNaN(latitude) || isNaN(longitude)) return false;
  if (latitude < -90 || latitude > 90) return false;
  if (longitude < -180 || longitude > 180) return false;
  
  return true;
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
