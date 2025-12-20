<?php
// restore-db-pg.php
// Endpoint untuk restore database PostgreSQL (Supabase) dari file SQL yang diupload
// Pastikan hanya admin yang bisa akses file ini di produksi!

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['sqlfile'])) {
    $tmp = $_FILES['sqlfile']['tmp_name'];
    // Konfigurasi koneksi PostgreSQL
    $dbhost = 'db.wfctxoulksmervtxghwr.supabase.co';
    $dbport = '5432';
    $dbuser = 'postgres';
    $dbpass = 'Halloo85';
    $dbname = 'postgres';
    $cmd = "PGPASSWORD=$dbpass psql -h $dbhost -p $dbport -U $dbuser -d $dbname -f $tmp";
    system($cmd, $retval);
    if ($retval === 0) {
        echo 'Restore sukses';
    } else {
        http_response_code(500);
        echo 'Restore gagal';
    }
    exit;
} else {
    http_response_code(400);
    echo 'No file uploaded.';
    exit;
}
?>
