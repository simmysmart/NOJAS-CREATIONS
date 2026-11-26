<?php

/* =========================================================
   NOJA'S CREATIONS
   CUSTOM DESIGN REQUESTS — CREATE API
========================================================= */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

function sendResponse($success, $message, $data = [], $statusCode = 200)
{
    http_response_code($statusCode);
    echo json_encode(
        array_merge(["success" => $success, "message" => $message], $data),
        JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    );
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendResponse(false, "Only POST requests are allowed.", [], 405);
}

require_once __DIR__ . "/../products/db.php";

if (!isset($conn) || !$conn) {
    sendResponse(false, "Database connection failed.", [], 500);
}

/* ---------------------------------------------------------
   MAKE SURE TABLE EXISTS - USES THE NEW WORKING TABLE
--------------------------------------------------------- */

$createTable = "
CREATE TABLE IF NOT EXISTS custom_design_requests2 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product VARCHAR(255) NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    category VARCHAR(100) NULL,
    budget VARCHAR(100) NULL,
    description TEXT NULL,
    colour VARCHAR(100) NULL,
    occasion VARCHAR(255) NULL,
    preferred_date DATE NULL,
    design_image VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
";

if (!$conn->query($createTable)) {
    sendResponse(false, "Unable to prepare custom design requests table.", [], 500);
}

/* ---------------------------------------------------------
   RECEIVE FORM DATA
--------------------------------------------------------- */

$product = trim($_POST["product"] ?? "");
$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$phone = trim($_POST["phone"] ?? "");
$category = trim($_POST["category"] ?? "");
$budget = trim($_POST["budget"] ?? "");
$description = trim($_POST["description"] ?? "");
$colour = trim($_POST["colour"] ?? "");
$occasion = trim($_POST["occasion"] ?? "");
$preferred_date = trim($_POST["preferred_date"] ?? "");
if ($preferred_date === "") $preferred_date = null;

if ($product === "") $product = "Custom Design";
if ($name === "") sendResponse(false, "Please enter your name.", [], 400);
if ($email === "") sendResponse(false, "Please enter your email address.", [], 400);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) sendResponse(false, "Please enter a valid email address.", [], 400);
if ($phone === "") sendResponse(false, "Please enter your phone number.", [], 400);

/* ---------------------------------------------------------
   IMAGE UPLOAD
--------------------------------------------------------- */

$imagePath = null;
$imageKey = isset($_FILES["designImage"]) ? "designImage" : "design_image";

if (isset($_FILES[$imageKey]) && $_FILES[$imageKey]["error"] !== UPLOAD_ERR_NO_FILE) {
    $file = $_FILES[$imageKey];
    if ($file["error"] !== UPLOAD_ERR_OK) sendResponse(false, "There was a problem uploading your inspiration image.", [], 400);
    $maxSize = 5 * 1024 * 1024;
    if ($file["size"] > $maxSize) sendResponse(false, "The inspiration image must be smaller than 5MB.", [], 400);
    $allowedTypes = ["image/jpeg" => "jpg", "image/png" => "png", "image/webp" => "webp", "image/gif" => "gif"];
    $fileInfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($fileInfo, $file["tmp_name"]);
    finfo_close($fileInfo);
    if (!isset($allowedTypes[$mimeType])) sendResponse(false, "Only JPG, PNG, WEBP and GIF images are allowed.", [], 400);
    $uploadDirectory = __DIR__ . "/../../uploads/custom-design/";
    if (!is_dir($uploadDirectory)) {
        if (!mkdir($uploadDirectory, 0755, true)) sendResponse(false, "Unable to create the image upload directory.", [], 500);
    }
    $extension = $allowedTypes[$mimeType];
    $fileName = "custom-" . date("YmdHis") . "-" . bin2hex(random_bytes(6)) . "." . $extension;
    $destination = $uploadDirectory . $fileName;
    if (!move_uploaded_file($file["tmp_name"], $destination)) sendResponse(false, "Unable to save the uploaded inspiration image.", [], 500);
    $imagePath = "uploads/custom-design/" . $fileName;
}

/* ---------------------------------------------------------
   INSERT REQUEST - MATCHES THE NEW TABLE
--------------------------------------------------------- */

$sql = "
INSERT INTO custom_design_requests2 (
    product, name, email, phone, category, budget, description, colour, occasion, preferred_date, design_image, status
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
";

$stmt = $conn->prepare($sql);
if (!$stmt) sendResponse(false, "Unable to prepare the custom design request.", [], 500);

$stmt->bind_param("sssssssssss", $product, $name, $email, $phone, $category, $budget, $description, $colour, $occasion, $preferred_date, $imagePath);

if (!$stmt->execute()) {
    if ($imagePath) {
        $uploadedFile = __DIR__ . "/../../" . $imagePath;
        if (file_exists($uploadedFile)) unlink($uploadedFile);
    }
    $stmt->close();
    $conn->close();
    sendResponse(false, "Unable to save your custom design request.", [], 500);
}

$requestId = $stmt->insert_id;
$stmt->close();
$conn->close();

sendResponse(true, "Your custom design request has been submitted successfully.", ["request_id" => (int) $requestId], 201);