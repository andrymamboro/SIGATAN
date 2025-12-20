# Aplikasi Pertanahan

Sistem Manajemen Data Pertanahan berbasis web menggunakan React, TypeScript, dan Vite.

## 🚀 Fitur Utama

- **Dashboard Interaktif** - Statistik dan visualisasi data tanah
- **Manajemen Data Tanah** - CRUD lengkap untuk data pertanahan
- **Peta Interaktif** - Visualisasi lokasi tanah dengan Leaflet
- **Manajemen Pejabat** - Kelola data pejabat terkait
- **Sistem Laporan** - Generate dokumen administrasi (Surat Permohonan, SKPT, Berita Acara, dll)
- **Autentikasi & Otorisasi** - Role-based access control (Admin & User)
- **Multi-wilayah** - Support untuk multiple kecamatan dan kelurahan

## 📁 Struktur Proyek

```
app_pertanahan/
├── api/                      # API client
│   └── andrimamboroClient.js       # andrimamboro API wrapper
├── Components/
│   ├── dashboard/            # Dashboard components
│   ├── forms/                # Form components
│   ├── layout/               # Layout components (Sidebar)
│   ├── maps/                 # Map components (Leaflet)
│   ├── reports/              # Report templates
│   ├── ui/                   # Shadcn UI components
│   └── utils/                # Utility components
├── Entities/                 # Database entities (.db files)
├── Pages/                    # Page components
│   ├── Dashboard.tsx
│   ├── DataTanah.tsx
│   ├── DetailTanah.tsx
│   ├── PetaTanah.tsx
│   ├── Pejabat.tsx
│   ├── Laporan.tsx
│   ├── ManajemenUser.tsx
│   └── Login.tsx
├── lib/                      # Utilities
│   └── utils.js              # cn() helper
├── utils/                    # Helper functions
│   └── index.js
├── App.jsx                   # Main app component
├── Layout.js                 # Layout wrapper
├── main.jsx                  # Entry point
├── index.html                # HTML template
├── index.css                 # Global styles
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## 🛠️ Teknologi Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript + JavaScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui + Radix UI
- **State Management:** TanStack Query (React Query)
- **Routing:** React Router DOM
- **Maps:** Leaflet + React Leaflet
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** Sonner
- **PDF Generation:** jsPDF + html2canvas
- **Date Handling:** date-fns

## 📦 Instalasi

### Prerequisites

- Node.js >= 16.x
- npm atau yarn

### Langkah Instalasi

1. Clone repository
```bash
git clone <repository-url>
cd app_pertanahan
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
```

Edit `.env` dan sesuaikan dengan konfigurasi Anda:
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Aplikasi Pertanahan
```

4. Jalankan development server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 🏗️ Build untuk Production

```bash
npm run build
```

Output akan ada di folder `dist/`

## 📝 Penggunaan

### Login
- Username: `admin`
- Password: `admin123`

### Menu Utama
1. **Dashboard** - Overview statistik dan peta
2. **Peta Tanah** - Visualisasi semua lokasi tanah
3. **Data Tanah** - Kelola data tanah (CRUD)
4. **Pejabat** - Kelola data pejabat
5. **Laporan** - Generate dokumen administrasi
6. **Manajemen User** - Kelola user sistem (Admin only)

### Workflow Data Tanah
1. Tambah data tanah melalui form
2. Pilih lokasi di peta interaktif
3. Isi data pemilik, ukuran, dan dokumen
4. Simpan dan lihat di daftar/peta
5. Generate laporan sesuai kebutuhan

## 🔧 Konfigurasi

### Path Aliases
Path aliases sudah dikonfigurasi di `vite.config.js` dan `tsconfig.json`:
- `@/*` → Root directory
- `@/components/*` → `Components/`
- `@/pages/*` → `Pages/`
- `@/api/*` → `api/`
- `@/lib/*` → `lib/`
- `@/utils/*` → `utils/`

### Tailwind CSS
Konfigurasi Tailwind ada di `tailwind.config.js`. Theme variables di `index.css`.

## 📱 Responsive Design
Aplikasi fully responsive untuk:
- Desktop (1920px+)
- Laptop (1280px - 1920px)
- Tablet (768px - 1280px)
- Mobile (< 768px)

## 🎨 Tema & Styling
- Light mode (default)
- Custom color palette (Blue primary)
- Smooth animations
- Modern shadows & borders

## 📄 License
MIT License

## 👥 Tim Pengembang
Aplikasi Pertanahan Development Team

## 🐛 Bug Reports & Feature Requests
Silakan buat issue di repository ini.

## 📞 Kontak
Untuk informasi lebih lanjut, hubungi tim developer.
