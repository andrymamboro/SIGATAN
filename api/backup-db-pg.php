<?php
// backup-db-pg.php
// Endpoint untuk download SQL dump database PostgreSQL (Supabase)
// Pastikan hanya admin yang bisa akses file ini di produksi!

// Konfigurasi koneksi PostgreSQL
$dbhost = 'db.wfctxoulksmervtxghwr.supabase.co';
$dbport = '5432';
$dbuser = 'postgres';
$dbpass = 'Halloo85';
$dbname = 'postgres';


// Fitur Save As: user bisa pilih nama file lewat parameter GET (misal: ?filename=mybackup.sql)
$filename = isset($_GET['filename']) && preg_match('/^[a-zA-Z0-9_\-\.]+\.sql$/', $_GET['filename'])
	? $_GET['filename']
	: ("backup_pg_" . date('Ymd_His') . ".sql");
$filepath = __DIR__ . "/" . $filename;

// Perintah pg_dump, output ke file
$cmd = "PGPASSWORD=$dbpass pg_dump -h $dbhost -p $dbport -U $dbuser -d $dbname --no-owner --no-privileges > $filepath";
system($cmd);

// Setelah backup selesai, kirim file ke user
if (file_exists($filepath)) {
	header('Content-Type: application/octet-stream');
	header('Content-Disposition: attachment; filename="' . $filename . '"');
	readfile($filepath);
	// Hapus file backup setelah didownload
	unlink($filepath);
	exit;
} else {
	http_response_code(500);
	echo "Backup gagal dibuat.";
	exit;
}
?>
