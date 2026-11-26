<?php

/*
|--------------------------------------------------------------------------
| NOJA'S CREATIONS
| Database Connection
|--------------------------------------------------------------------------
*/

$host = "127.0.0.1";
$dbname = "nojas_creations";
$username = "root";
$password = "";


/*
|--------------------------------------------------------------------------
| Create Database Connection
|--------------------------------------------------------------------------
*/

$conn = new mysqli(
    $host,
    $username,
    $password,
    $dbname
);


/*
|--------------------------------------------------------------------------
| Check Connection
|--------------------------------------------------------------------------
*/

if ($conn->connect_error) {
    http_response_code(500);

    header("Content-Type: application/json");

    echo json_encode([
        "success" => false,
        "message" => "Database connection failed."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Set Character Encoding
|--------------------------------------------------------------------------
*/

$conn->set_charset("utf8mb4");