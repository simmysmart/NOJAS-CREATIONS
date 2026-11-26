<?php

/*
|--------------------------------------------------------------------------
| NOJA'S CREATIONS
| Admin Custom Design Requests
| Update Request Status
|--------------------------------------------------------------------------
|
| Admin can change status AFTER customer has made a request:
|   pending   -> new request, just arrived
|   reviewed  -> admin has seen it
|   completed -> design is finished / delivered
|   cancelled -> admin cancelled it
|
| Frontend sends: { "id": 4, "status": "reviewed" }
|
*/

require_once __DIR__ . "/../auth/require-auth.php";

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

require_once __DIR__ . "/../products/db.php";

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
if (!is_array($data)) {
    $data = $_POST;
}

$id = intval($data["id"] ?? 0);
$status = trim($data["status"] ?? "");

if ($id <= 0) {
    http_response_code(422);
    echo json_encode(["success" => false, "message" => "Invalid request ID."]);
    exit;
}

// ONLY 4 STATUSES ALLOWED - as you wanted
$allowedStatuses = [
    "pending",
    "reviewed",
    "completed",
    "cancelled"
];

if (!in_array($status, $allowedStatuses, true)) {
    http_response_code(422);
    echo json_encode(["success" => false, "message" => "Invalid request status."]);
    exit;
}

// FIXED TABLE: custom_design_requests2
$sql = "UPDATE custom_design_requests2 SET status = ? WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Unable to prepare request update."]);
    exit;
}

$stmt->bind_param("si", $status, $id);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Unable to update request."]);
    $stmt->close();
    $conn->close();
    exit;
}

// If 0 rows affected, check if request exists
if ($stmt->affected_rows === 0) {
    $check = $conn->prepare("SELECT id, status FROM custom_design_requests2 WHERE id = ?");
    if ($check) {
        $check->bind_param("i", $id);
        $check->execute();
        $checkResult = $check->get_result();
        if ($checkResult->num_rows === 0) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Request not found."]);
            $check->close();
            $stmt->close();
            $conn->close();
            exit;
        }
        $check->close();
    }
}

echo json_encode([
    "success" => true,
    "message" => "Request status updated successfully.",
    "id" => $id,
    "status" => $status
]);

$stmt->close();
$conn->close();
?>