-- Schema: Pertanahan (MySQL)
-- Modern, with auto_increment, triggers, and best practices

CREATE TABLE IF NOT EXISTS tanah (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    nama_pemilik     VARCHAR(255) NOT NULL,
    nik_pemilik      VARCHAR(16) NOT NULL,
    umur_pemilik     INT,
    pekerjaan_pemilik VARCHAR(100),
    alamat_pemilik   TEXT,
    kecamatan        VARCHAR(100) NOT NULL,
    kelurahan        VARCHAR(100) NOT NULL,
    lokasi           TEXT NOT NULL,
    latitude         DECIMAL(10,8),
    longitude        DECIMAL(11,8),
    location_type    VARCHAR(20) DEFAULT 'marker',
    polygon_coords   JSON,
    luas_perkalian   VARCHAR(50),
    luas_meter       DECIMAL(14,2),
    luas_terbilang   VARCHAR(255),
    batas_utara      VARCHAR(255),
    batas_timur      VARCHAR(255),
    batas_selatan    VARCHAR(255),
    batas_barat      VARCHAR(255),
    asal_usul        VARCHAR(255),
    nama_penerima    VARCHAR(255),
    nik_penerima     VARCHAR(16),
    umur_penerima    INT,
    pekerjaan_penerima VARCHAR(100),
    alamat_penerima  TEXT,
    atas_nama        VARCHAR(255),
    transaksi        VARCHAR(50),
    harga            DECIMAL(15,2),
    harga_terbilang  TEXT,
    nomor_skpt       VARCHAR(100),
    tanggal_skpt     DATE,
    nomor_penyerahan VARCHAR(100),
    tanggal_penyerahan DATE,
    status           VARCHAR(20) DEFAULT 'Proses',
    created_date     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by       VARCHAR(100),
    updated_by       VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS pejabat (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    kecamatan        VARCHAR(100) NOT NULL,
    kelurahan        VARCHAR(100),
    nama             VARCHAR(255) NOT NULL,
    nip              VARCHAR(50),
    jabatan          VARCHAR(100) NOT NULL,
    selaku           VARCHAR(100),
    aktif            BOOLEAN DEFAULT TRUE,
    created_date     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wilayah (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    kecamatan        VARCHAR(100) NOT NULL,
    kelurahan        VARCHAR(100) NOT NULL,
    kode_wilayah     VARCHAR(20),
    luas_wilayah     DECIMAL(14,2),
    jumlah_penduduk  INT,
    aktif            BOOLEAN DEFAULT TRUE,
    created_date     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY wilayah_kecamatan_kelurahan_unique (kecamatan, kelurahan)
);

CREATE TABLE IF NOT EXISTS users (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    username         VARCHAR(50) NOT NULL UNIQUE,
    password         VARCHAR(255) NOT NULL,
    full_name        VARCHAR(255) NOT NULL,
    email            VARCHAR(100),
    no_hp            VARCHAR(20),
    role             VARCHAR(20) DEFAULT 'user',
    kecamatan        VARCHAR(100),
    kelurahan        VARCHAR(100),
    aktif            BOOLEAN DEFAULT TRUE,
    auth_id          CHAR(36) UNIQUE,
    last_login       DATETIME,
    created_date     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Views (MySQL 8+ supports views, but not triggers on views)
CREATE OR REPLACE VIEW v_tanah_lengkap AS
SELECT t.*, w.kode_wilayah FROM tanah t LEFT JOIN wilayah w ON t.kecamatan = w.kecamatan AND t.kelurahan = w.kelurahan;

CREATE OR REPLACE VIEW v_statistik_kecamatan AS
SELECT kecamatan, COUNT(*) as total_tanah, SUM(CASE WHEN status = 'Proses' THEN 1 ELSE 0 END) as proses, SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as selesai, SUM(CASE WHEN status = 'Ditolak' THEN 1 ELSE 0 END) as ditolak, SUM(COALESCE(luas_meter,0)) as total_luas FROM tanah GROUP BY kecamatan;

CREATE OR REPLACE VIEW v_statistik_kelurahan AS
SELECT kecamatan, kelurahan, COUNT(*) as total_tanah, SUM(CASE WHEN status = 'Proses' THEN 1 ELSE 0 END) as proses, SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as selesai, SUM(CASE WHEN status = 'Ditolak' THEN 1 ELSE 0 END) as ditolak, SUM(COALESCE(luas_meter,0)) as total_luas FROM tanah GROUP BY kecamatan, kelurahan;
