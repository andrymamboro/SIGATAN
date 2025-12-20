-- Schema: Pertanahan (Postgres/Supabase)
-- Modern, with identity columns, triggers, and best practices

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
    auth_id          UUID UNIQUE,
    last_login       timestamptz,
    created_date     timestamptz DEFAULT now(),
    updated_date     timestamptz DEFAULT now()
);

-- Views
DROP VIEW IF EXISTS v_tanah_lengkap;
CREATE VIEW v_tanah_lengkap AS
SELECT t.*, w.kode_wilayah FROM tanah t LEFT JOIN wilayah w ON t.kecamatan = w.kecamatan AND t.kelurahan = w.kelurahan;

DROP VIEW IF EXISTS v_statistik_kecamatan;
CREATE VIEW v_statistik_kecamatan AS
SELECT kecamatan, COUNT(*) as total_tanah, SUM(CASE WHEN status = 'Proses' THEN 1 ELSE 0 END) as proses, SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as selesai, SUM(CASE WHEN status = 'Ditolak' THEN 1 ELSE 0 END) as ditolak, SUM(COALESCE(luas_meter,0)) as total_luas FROM tanah GROUP BY kecamatan;

DROP VIEW IF EXISTS v_statistik_kelurahan;
CREATE VIEW v_statistik_kelurahan AS
SELECT kecamatan, kelurahan, COUNT(*) as total_tanah, SUM(CASE WHEN status = 'Proses' THEN 1 ELSE 0 END) as proses, SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as selesai, SUM(CASE WHEN status = 'Ditolak' THEN 1 ELSE 0 END) as ditolak, SUM(COALESCE(luas_meter,0)) as total_luas FROM tanah GROUP BY kecamatan, kelurahan;

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
CREATE TRIGGER tanah_update_timestamp BEFORE UPDATE ON tanah FOR EACH ROW EXECUTE FUNCTION update_updated_date();
DROP TRIGGER IF EXISTS pejabat_update_timestamp ON pejabat;
CREATE TRIGGER pejabat_update_timestamp BEFORE UPDATE ON pejabat FOR EACH ROW EXECUTE FUNCTION update_updated_date();
DROP TRIGGER IF EXISTS wilayah_update_timestamp ON wilayah;
CREATE TRIGGER wilayah_update_timestamp BEFORE UPDATE ON wilayah FOR EACH ROW EXECUTE FUNCTION update_updated_date();
DROP TRIGGER IF EXISTS users_update_timestamp ON users;
CREATE TRIGGER users_update_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_date();
