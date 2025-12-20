<?php
// Test Database Connection
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'db_tanah');

try {
    $conn = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    // Check if users table exists
    $stmt = $conn->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Get all users (without password)
    $stmt = $conn->query("SELECT id, username, full_name, role, aktif FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Database connected successfully',
        'users_count' => $result['count'],
        'users' => $users
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
