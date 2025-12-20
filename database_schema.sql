-- ============================================
-- SQL Schema untuk Aplikasi Pertanahan
-- Database: SQLite / PostgreSQL / MySQL
-- ============================================

-- ============================================
-- Tabel: tanah
-- Deskripsi: Menyimpan data tanah dan kepemilikan
-- ============================================
CREATE TABLE IF NOT EXISTS tanah (
    id SERIAL PRIMARY KEY,
    nama_pemilik VARCHAR(255) NOT NULL,
    nik_pemilik VARCHAR(16) NOT NULL,
    umur_pemilik INTEGER,
    pekerjaan_pemilik VARCHAR(100),
    alamat_pemilik TEXT,
    
    -- Data Lokasi Tanah
    kecamatan VARCHAR(100) NOT NULL,
    kelurahan VARCHAR(100) NOT NULL,
    lokasi TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_type VARCHAR(20) DEFAULT 'marker', -- 'marker' atau 'polygon'
    polygon_coords TEXT, -- JSON string untuk koordinat polygon
    
    -- Data Ukuran Tanah
    luas_perkalian VARCHAR(50), -- Format: "20 x 15"
    luas_meter DECIMAL(10, 2), -- Luas dalam m²
    luas_terbilang VARCHAR(255), -- Terbilang luas
    
    -- Batas-batas Tanah
    batas_utara VARCHAR(255),
    batas_timur VARCHAR(255),
    batas_selatan VARCHAR(255),
    batas_barat VARCHAR(255),
    
    -- Data Kepemilikan
    asal_usul VARCHAR(255), -- Warisan, Pembelian, dll
    
    -- Data Penerima/Transaksi (jika ada)
    nama_penerima VARCHAR(255),
    nik_penerima VARCHAR(16),
    umur_penerima INTEGER,
    pekerjaan_penerima VARCHAR(100),
    alamat_penerima TEXT,
    atas_nama VARCHAR(255),
    transaksi VARCHAR(50), -- Jual Beli, Hibah, Waris, dll
    harga DECIMAL(15, 2),
    harga_terbilang TEXT,
    
    -- Data Dokumen
    nomor_skpt VARCHAR(100),
    tanggal_skpt DATE,
    nomor_penyerahan VARCHAR(100),
    tanggal_penyerahan DATE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'Proses', -- 'Proses', 'Selesai', 'Ditolak'
    
    -- Metadata
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Index untuk pencarian
DROP INDEX IF EXISTS idx_tanah_kecamatan;
CREATE INDEX CONCURRENTLY idx_tanah_kecamatan ON tanah (kecamatan);
DROP INDEX IF EXISTS idx_tanah_kelurahan;
CREATE INDEX CONCURRENTLY idx_tanah_kelurahan ON tanah (kelurahan);
DROP INDEX IF EXISTS idx_tanah_status;
CREATE INDEX CONCURRENTLY idx_tanah_status ON tanah (status);
DROP INDEX IF EXISTS idx_tanah_nik_pemilik;
CREATE INDEX CONCURRENTLY idx_tanah_nik_pemilik ON tanah (nik_pemilik);
DROP INDEX IF EXISTS idx_tanah_created_date;
CREATE INDEX CONCURRENTLY idx_tanah_created_date ON tanah (created_date);
-- ============================================
-- Tabel: pejabat
-- Deskripsi: Menyimpan data pejabat penandatangan
-- ============================================
CREATE TABLE IF NOT EXISTS pejabat (
    id SERIAL PRIMARY KEY,
    kecamatan VARCHAR(100) NOT NULL,
    kelurahan VARCHAR(100),
    
    -- Data Pejabat
    nama VARCHAR(255) NOT NULL,
    nip VARCHAR(50),
    jabatan VARCHAR(100) NOT NULL, -- 'PPATK Kecamatan', 'Lurah', 'Kasi Pemerintahan', 'Staf Administrasi Kecamatan'
    selaku VARCHAR(100), -- Keterangan tambahan
    
    -- Status
    aktif BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk pencarian
CREATE INDEX idx_pejabat_kecamatan ON pejabat(kecamatan);
CREATE INDEX idx_pejabat_kelurahan ON pejabat(kelurahan);
CREATE INDEX idx_pejabat_jabatan ON pejabat(jabatan);
CREATE INDEX idx_pejabat_aktif ON pejabat(aktif);

-- ============================================
-- Tabel: wilayah
-- Deskripsi: Menyimpan data kecamatan dan kelurahan
-- ============================================
CREATE TABLE IF NOT EXISTS wilayah (
    id SERIAL PRIMARY KEY,
    kecamatan VARCHAR(100) NOT NULL,
    kelurahan VARCHAR(100) NOT NULL,
    
    -- Data Tambahan (opsional)
    kode_wilayah VARCHAR(20),
    luas_wilayah DECIMAL(10, 2), -- dalam km²
    jumlah_penduduk INTEGER,
    
    -- Status
    aktif BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint
    UNIQUE(kecamatan, kelurahan)
);

-- Index untuk pencarian
CREATE INDEX idx_wilayah_kecamatan ON wilayah(kecamatan);
CREATE INDEX idx_wilayah_kelurahan ON wilayah(kelurahan);
CREATE INDEX idx_wilayah_aktif ON wilayah(aktif);

-- ============================================
-- Tabel: users
-- Deskripsi: Menyimpan data pengguna sistem
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Hash password
    
    -- Data Profil
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    no_hp VARCHAR(20),
    
    -- Role & Akses
    role VARCHAR(20) DEFAULT 'user', -- 'admin' atau 'user'
    kecamatan VARCHAR(100), -- Akses wilayah untuk user
    kelurahan VARCHAR(100), -- Akses wilayah untuk user
    
    -- Status
    aktif BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    last_login TIMESTAMP,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tambah kolom auth_id untuk relasi ke Supabase Auth
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE;

-- Index untuk pencarian
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_kecamatan ON users(kecamatan);
CREATE INDEX idx_users_aktif ON users(aktif);

-- ============================================
-- Data Sample untuk Testing
-- ============================================

-- Insert sample wilayah
INSERT INTO wilayah (kecamatan, kelurahan) VALUES
('Kecamatan Pusat', 'Kelurahan Merdeka'),
('Kecamatan Pusat', 'Kelurahan Sejahtera'),
('Kecamatan Timur', 'Kelurahan Makmur'),
('Kecamatan Timur', 'Kelurahan Sentosa'),
('Kecamatan Barat', 'Kelurahan Bahagia'),
('Kecamatan Barat', 'Kelurahan Damai');

-- Insert sample admin user (password: admin123 - harus di-hash di aplikasi)
INSERT INTO users (username, password, full_name, role, aktif) VALUES
('admin', 'admin123', 'Administrator', 'admin', TRUE);

-- Insert sample user (password: user123 - harus di-hash di aplikasi)
INSERT INTO users (username, password, full_name, role, kecamatan, kelurahan, aktif) VALUES
('user1', 'user123', 'User Kelurahan', 'user', 'Kecamatan Pusat', 'Kelurahan Merdeka', TRUE);

-- Insert sample pejabat
INSERT INTO pejabat (kecamatan, kelurahan, nama, nip, jabatan, selaku, aktif) VALUES
('Kecamatan Pusat', NULL, 'Dr. Ahmad Yani, S.Sos', '196512311988031001', 'PPATK Kecamatan', 'PPATK Kecamatan Pusat', TRUE),
('Kecamatan Pusat', 'Kelurahan Merdeka', 'Ir. Budi Santoso', '197203151994031001', 'Lurah', 'Lurah Kelurahan Merdeka', TRUE),
('Kecamatan Pusat', 'Kelurahan Merdeka', 'Siti Nurjanah, S.IP', '198505102005012001', 'Kasi Pemerintahan', 'Kepala Seksi Pemerintahan', TRUE),
('Kecamatan Pusat', 'Kelurahan Merdeka', 'Dedi Kurniawan', '199001152010011001', 'Staf Administrasi Kecamatan', 'Staf Administrasi Pertanahan', TRUE);

-- Insert sample tanah
INSERT INTO tanah (
    nama_pemilik, nik_pemilik, umur_pemilik, pekerjaan_pemilik, alamat_pemilik,
    kecamatan, kelurahan, lokasi, latitude, longitude,
    luas_perkalian, luas_meter, luas_terbilang,
    batas_utara, batas_timur, batas_selatan, batas_barat,
    asal_usul, status
) VALUES (
    'Andi Wijaya', '3201012345678901', 45, 'Wiraswasta', 'Jl. Merdeka No. 123',
    'Kecamatan Pusat', 'Kelurahan Merdeka', 'Jl. Merdeka No. 123, RT 01/RW 05',
    -6.2088, 106.8456,
    '20 x 15', 300, 'tiga ratus',
    'Jalan Raya', 'Tanah Kosong', 'Sungai Kecil', 'Rumah Bpk. Samsul',
    'Warisan Orang Tua', 'Proses'
);

-- ============================================
-- Views untuk Laporan
-- ============================================

-- View: Data Tanah dengan informasi wilayah
DROP VIEW IF EXISTS v_tanah_lengkap;
CREATE VIEW  v_tanah_lengkap AS
SELECT 
    t.*,
    w.kode_wilayah
FROM tanah t
LEFT JOIN wilayah w ON t.kecamatan = w.kecamatan AND t.kelurahan = w.kelurahan;

-- View: Statistik per Kecamatan
DROP VIEW IF EXISTS v_statistik_kecamatan;
CREATE VIEW  v_statistik_kecamatan AS
SELECT 
    kecamatan,
    COUNT(*) as total_tanah,
    SUM(CASE WHEN status = 'Proses' THEN 1 ELSE 0 END) as proses,
    SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as selesai,
    SUM(CASE WHEN status = 'Ditolak' THEN 1 ELSE 0 END) as ditolak,
    SUM(luas_meter) as total_luas
FROM tanah
GROUP BY kecamatan;

-- View: Statistik per Kelurahan
DROP VIEW IF EXISTS v_statistik_kelurahan;
CREATE VIEW  v_statistik_kelurahan AS
SELECT 
    kecamatan,
    kelurahan,
    COUNT(*) as total_tanah,
    SUM(CASE WHEN status = 'Proses' THEN 1 ELSE 0 END) as proses,
    SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as selesai,
    SUM(CASE WHEN status = 'Ditolak' THEN 1 ELSE 0 END) as ditolak,
    SUM(luas_meter) as total_luas
FROM tanah
GROUP BY kecamatan, kelurahan;

-- ============================================
-- Triggers untuk Update Timestamp (MySQL/MariaDB)
-- ============================================



CREATE OR REPLACE FUNCTION update_updated_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Untuk tabel tanah
DROP TRIGGER IF EXISTS tanah_update_timestamp ON tanah;
CREATE TRIGGER tanah_update_timestamp
BEFORE UPDATE ON tanah
FOR EACH ROW
EXECUTE FUNCTION update_updated_date();

-- Untuk tabel pejabat
DROP TRIGGER IF EXISTS pejabat_update_timestamp ON pejabat;
CREATE TRIGGER pejabat_update_timestamp
BEFORE UPDATE ON pejabat
FOR EACH ROW
EXECUTE FUNCTION update_updated_date();

-- Untuk tabel wilayah
DROP TRIGGER IF EXISTS wilayah_update_timestamp ON wilayah;
CREATE TRIGGER wilayah_update_timestamp
BEFORE UPDATE ON wilayah
FOR EACH ROW
EXECUTE FUNCTION update_updated_date();

-- Untuk tabel users
DROP TRIGGER IF EXISTS users_update_timestamp ON users;
CREATE TRIGGER users_update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_date();


-- ============================================
-- NOTES:
-- 1. Untuk PostgreSQL, ganti AUTOINCREMENT dengan SERIAL
-- 2. Untuk MySQL, ganti AUTOINCREMENT dengan AUTO_INCREMENT
-- 3. Password harus di-hash menggunakan bcrypt/argon2 di aplikasi
-- 4. Koordinat polygon disimpan sebagai JSON string
-- 5. Sesuaikan tipe data DECIMAL dengan kebutuhan presisi
-- ============================================
