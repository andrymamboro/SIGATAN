-- Schema: Pertanahan (Postgres / Supabase-ready)
-- Using GENERATED AS IDENTITY for modern Postgres IDs

CREATE TABLE IF NOT EXISTS tanah (
    id               integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nama_pemilik     varchar(255) NOT NULL,
    nik_pemilik      varchar(16) NOT NULL,
    umur_pemilik     integer,
    pekerjaan_pemilik varchar(100),
    alamat_pemilik   text,
    kecamatan        varchar(100) NOT NULL,
    kelurahan        varchar(100) NOT NULL,
    lokasi           text NOT NULL,
    latitude         numeric(10,8),
    longitude        numeric(11,8),
    location_type    varchar(20) DEFAULT 'marker',
    polygon_coords   jsonb,
    luas_perkalian   varchar(50),
    luas_meter       numeric(14,2),
    luas_terbilang   varchar(255),
    batas_utara      varchar(255),
    batas_timur      varchar(255),
    batas_selatan    varchar(255),
    batas_barat      varchar(255),
    asal_usul        varchar(255),
    nama_penerima    varchar(255),
    nik_penerima     varchar(16),
    umur_penerima    integer,
    pekerjaan_penerima varchar(100),
    alamat_penerima  text,
    atas_nama        varchar(255),
    transaksi        varchar(50),
    harga            numeric(15,2),
    harga_terbilang  text,
    nomor_skpt       varchar(100),
    tanggal_skpt     date,
    nomor_penyerahan varchar(100),
    tanggal_penyerahan date,
    status           varchar(20) DEFAULT 'Proses',
    created_date     timestamptz DEFAULT now(),
    updated_date     timestamptz DEFAULT now(),
    created_by       varchar(100),
    updated_by       varchar(100)
);

CREATE TABLE IF NOT EXISTS pejabat (
    id               integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kecamatan        varchar(100) NOT NULL,
    kelurahan        varchar(100),
    nama             varchar(255) NOT NULL,
    nip              varchar(50),
    jabatan          varchar(100) NOT NULL,
    selaku           varchar(100),
    aktif            boolean DEFAULT true,
    created_date     timestamptz DEFAULT now(),
    updated_date     timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wilayah (
    id               integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kecamatan        varchar(100) NOT NULL,
    kelurahan        varchar(100) NOT NULL,
    kode_wilayah     varchar(20),
    luas_wilayah     numeric(14,2),
    jumlah_penduduk  integer,
    aktif            boolean DEFAULT true,
    created_date     timestamptz DEFAULT now(),
    updated_date     timestamptz DEFAULT now(),
    CONSTRAINT wilayah_kecamatan_kelurahan_unique UNIQUE (kecamatan, kelurahan)
);

CREATE TABLE IF NOT EXISTS users (
    id               integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username         varchar(50) NOT NULL UNIQUE,
    password         varchar(255) NOT NULL,
    full_name        varchar(255) NOT NULL,
    email            varchar(100),
    no_hp            varchar(20),
    role             varchar(20) DEFAULT 'user',
    kecamatan        varchar(100),
    kelurahan        varchar(100),
    aktif            boolean DEFAULT true,
        -- Relasi ke Supabase Auth
        auth_id UUID UNIQUE,
        last_login       timestamptz,
        created_date     timestamptz DEFAULT now(),
        updated_date     timestamptz DEFAULT now()
);

-- Sample data (safe small set)
INSERT INTO wilayah (kecamatan, kelurahan) VALUES
('Kecamatan Pusat', 'Kelurahan Merdeka'),
('Kecamatan Pusat', 'Kelurahan Sejahtera'),
('Kecamatan Timur', 'Kelurahan Makmur'),
('Kecamatan Timur', 'Kelurahan Sentosa'),
('Kecamatan Barat', 'Kelurahan Bahagia'),
('Kecamatan Barat', 'Kelurahan Damai')
ON CONFLICT DO NOTHING;

INSERT INTO users (username, password, full_name, role, aktif) VALUES
('admin', 'admin123', 'Administrator', 'admin', TRUE)
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, password, full_name, role, kecamatan, kelurahan, aktif) VALUES
('user1', 'user123', 'User Kelurahan', 'user', 'Kecamatan Pusat', 'Kelurahan Merdeka', TRUE)
ON CONFLICT (username) DO NOTHING;

INSERT INTO pejabat (kecamatan, kelurahan, nama, nip, jabatan, selaku, aktif) VALUES
('Kecamatan Pusat', NULL, 'Dr. Ahmad Yani, S.Sos', '196512311988031001', 'PPATK Kecamatan', 'PPATK Kecamatan Pusat', TRUE),
('Kecamatan Pusat', 'Kelurahan Merdeka', 'Ir. Budi Santoso', '197203151994031001', 'Lurah', 'Lurah Kelurahan Merdeka', TRUE),
('Kecamatan Pusat', 'Kelurahan Merdeka', 'Siti Nurjanah, S.IP', '198505102005012001', 'Kasi Pemerintahan', 'Kepala Seksi Pemerintahan', TRUE),
('Kecamatan Pusat', 'Kelurahan Merdeka', 'Dedi Kurniawan', '199001152010011001', 'Staf Administrasi Kecamatan', 'Staf Administrasi Pertanahan', TRUE)
ON CONFLICT DO NOTHING;

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
)
ON CONFLICT DO NOTHING;

-- Views
DROP VIEW IF EXISTS v_tanah_lengkap;
CREATE VIEW v_tanah_lengkap AS
SELECT 
    t.*,
    w.kode_wilayah
FROM tanah t
LEFT JOIN wilayah w ON t.kecamatan = w.kecamatan AND t.kelurahan = w.kelurahan;

DROP VIEW IF EXISTS v_statistik_kecamatan;
CREATE VIEW v_statistik_kecamatan AS
SELECT 
    kecamatan,
    COUNT(*) as total_tanah,
    SUM(CASE WHEN status = 'Proses' THEN 1 ELSE 0 END) as proses,
    SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as selesai,
    SUM(CASE WHEN status = 'Ditolak' THEN 1 ELSE 0 END) as ditolak,
    SUM(COALESCE(luas_meter,0)) as total_luas
FROM tanah
GROUP BY kecamatan;

DROP VIEW IF EXISTS v_statistik_kelurahan;
CREATE VIEW v_statistik_kelurahan AS
SELECT 
    kecamatan,
    kelurahan,
    COUNT(*) as total_tanah,
    SUM(CASE WHEN status = 'Proses' THEN 1 ELSE 0 END) as proses,
    SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as selesai,
    SUM(CASE WHEN status = 'Ditolak' THEN 1 ELSE 0 END) as ditolak,
    SUM(COALESCE(luas_meter,0)) as total_luas
FROM tanah
GROUP BY kecamatan, kelurahan;

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach triggers
DROP TRIGGER IF EXISTS tanah_update_timestamp ON tanah;
CREATE TRIGGER tanah_update_timestamp
BEFORE UPDATE ON tanah
FOR EACH ROW
EXECUTE FUNCTION update_updated_date();

DROP TRIGGER IF EXISTS pejabat_update_timestamp ON pejabat;
CREATE TRIGGER pejabat_update_timestamp
BEFORE UPDATE ON pejabat
FOR EACH ROW
EXECUTE FUNCTION update_updated_date();

DROP TRIGGER IF EXISTS wilayah_update_timestamp ON wilayah;
CREATE TRIGGER wilayah_update_timestamp
BEFORE UPDATE ON wilayah
FOR EACH ROW
EXECUTE FUNCTION update_updated_date();

DROP TRIGGER IF EXISTS users_update_timestamp ON users;
CREATE TRIGGER users_update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_date();
