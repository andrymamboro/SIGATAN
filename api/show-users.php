<?php
// Script untuk menampilkan username dan password user dari tabel users
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'db_tanah');

header('Content-Type: application/json');

try {
    $conn = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    $stmt = $conn->query("SELECT id, username, password FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode([
        'status' => 'success',
        'users' => $users
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
