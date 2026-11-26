<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Connect to database - SAME settings as submit.php
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'nojas_creations';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed']);
    exit;
}

// Get all requests, newest first
$sql = "SELECT * FROM custom_design_requests2 ORDER BY created_at DESC";
$result = $conn->query($sql);

$rows = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
}

echo json_encode(['success' => true, 'data' => $rows]);
$conn->close();