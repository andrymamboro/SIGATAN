<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'db_tanah');

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Connection
class Database {
    private static $instance = null;
    private $conn;
    
    private function __construct() {
        try {
            $this->conn = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
            exit();
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->conn;
    }
}

// Helper Functions
function getAuthToken() {
    // Debug: log semua header yang diterima
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    file_put_contents(__DIR__ . '/headers.log', json_encode([
        'headers' => $headers,
        '_SERVER' => $_SERVER
    ], JSON_PRETTY_PRINT) . "\n", FILE_APPEND);

    // Try multiple methods to get authorization header
    if (isset($headers['Authorization'])) {
        return str_replace('Bearer ', '', $headers['Authorization']);
    }
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
    }
    if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        return str_replace('Bearer ', '', $_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
    }
    return null;
}

function verifyToken($token) {
    if (!$token) return false;
    
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("SELECT id, username, full_name, email, role, kecamatan, kelurahan FROM users WHERE aktif = 1");
    $stmt->execute();
    $users = $stmt->fetchAll();
    
    // Simple token verification (in production, use JWT)
    foreach ($users as $user) {
        $expectedToken = base64_encode($user['username'] . ':' . $user['id']);
        if ($token === $expectedToken) {
            return [
                'id' => $user['id'],
                'username' => $user['username'],
                'nama' => $user['full_name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'kecamatan' => $user['kecamatan'],
                'kelurahan' => $user['kelurahan']
            ];
        }
    }
    return false;
}

function response($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit();
}

function requireAuth() {
    $token = getAuthToken();
    $user = verifyToken($token);
    
    if (!$user) {
        response(['error' => 'Unauthorized'], 401);
    }
    
    return $user;
}

// Get Request Data
function getRequestData() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

// Parse URL
$request_uri = $_SERVER['REQUEST_URI'];
$script_name = dirname($_SERVER['SCRIPT_NAME']);
$path = str_replace($script_name, '', $request_uri);
$path = parse_url($path, PHP_URL_PATH);
$path = trim($path, '/');
$segments = explode('/', $path);

$method = $_SERVER['REQUEST_METHOD'];

// Routing
try {
    // Auth Routes
    if ($segments[0] === 'auth') {
        // Test auth endpoint
        if ($segments[1] === 'test' && $method === 'GET') {
            $token = getAuthToken();
            $user = verifyToken($token);
            response([
                'token_received' => $token ? 'yes' : 'no',
                'token_value' => $token,
                'user_verified' => $user ? 'yes' : 'no',
                'user_data' => $user
            ]);
        }
        
        if ($segments[1] === 'login' && $method === 'POST') {
            $data = getRequestData();
            $db = Database::getInstance()->getConnection();
            
            $stmt = $db->prepare("SELECT * FROM users WHERE username = ? AND aktif = 1");
            $stmt->execute([$data['username']]);
            $user = $stmt->fetch();
            
            // In production, use password_hash and password_verify
            if ($user && $user['password'] === $data['password']) {
                $token = base64_encode($user['username'] . ':' . $user['id']);
                
                // Update last login
                $updateStmt = $db->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
                $updateStmt->execute([$user['id']]);
                
                response([
                    'token' => $token,
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'nama' => $user['full_name'],
                        'full_name' => $user['full_name'],
                        'email' => $user['email'] ?? null,
                        'role' => $user['role'],
                        'kecamatan' => $user['kecamatan'],
                        'kelurahan' => $user['kelurahan']
                    ]
                ]);
            } else {
                response(['error' => 'Invalid credentials'], 401);
            }
        }
        
        if ($segments[1] === 'me' && $method === 'GET') {
            $user = requireAuth();
            response($user);
        }
    }
    
    // Entity Routes
    if ($segments[0] === 'entities') {
        $user = requireAuth();
        $entity = ucfirst($segments[1]); // Tanah, Pejabat, Wilayah
        $db = Database::getInstance()->getConnection();
        
        // List all
        if ($method === 'GET' && count($segments) === 2) {
            $orderBy = $_GET['order_by'] ?? 'id';
            $sql = "SELECT * FROM " . strtolower($entity) . " ORDER BY " . $orderBy;
            $stmt = $db->query($sql);
            response($stmt->fetchAll());
        }
        
        // Filter
        if ($method === 'GET' && isset($segments[2]) && $segments[2] === 'filter') {
            $where = [];
            $params = [];
            foreach ($_GET as $key => $value) {
                if ($key !== 'order_by') {
                    $where[] = "$key = ?";
                    $params[] = $value;
                }
            }
            $orderBy = $_GET['order_by'] ?? 'id';
            $sql = "SELECT * FROM " . strtolower($entity);
            if ($where) {
                $sql .= " WHERE " . implode(' AND ', $where);
            }
            $sql .= " ORDER BY " . $orderBy;
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            response($stmt->fetchAll());
        }
        
        // Get by ID
        if ($method === 'GET' && isset($segments[2]) && is_numeric($segments[2])) {
            $id = $segments[2];
            $stmt = $db->prepare("SELECT * FROM " . strtolower($entity) . " WHERE id = ?");
            $stmt->execute([$id]);
            $result = $stmt->fetch();
            if ($result) {
                response($result);
            } else {
                response(['error' => 'Not found'], 404);
            }
        }
        
        // Create
        if ($method === 'POST') {
            $data = getRequestData();
            $fields = array_keys($data);
            $values = array_values($data);
            $placeholders = array_fill(0, count($fields), '?');
            
            $sql = "INSERT INTO " . strtolower($entity) . " (" . implode(', ', $fields) . ") VALUES (" . implode(', ', $placeholders) . ")";
            $stmt = $db->prepare($sql);
            $stmt->execute($values);
            
            response(['id' => $db->lastInsertId(), 'message' => 'Created successfully'], 201);
        }
        
        // Update
        if ($method === 'PUT' && isset($segments[2])) {
            $id = $segments[2];
            $data = getRequestData();
            $fields = array_keys($data);
            $set = array_map(fn($f) => "$f = ?", $fields);
            $values = array_values($data);
            $values[] = $id;
            
            $sql = "UPDATE " . strtolower($entity) . " SET " . implode(', ', $set) . " WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute($values);
            
            response(['message' => 'Updated successfully']);
        }
        
        // Delete
        if ($method === 'DELETE' && isset($segments[2])) {
            $id = $segments[2];
            $stmt = $db->prepare("DELETE FROM " . strtolower($entity) . " WHERE id = ?");
            $stmt->execute([$id]);
            
            response(['message' => 'Deleted successfully']);
        }
    }
    
    // Default 404
    response(['error' => 'Endpoint not found'], 404);
    
} catch (Exception $e) {
    response(['error' => $e->getMessage()], 500);
}
?>
