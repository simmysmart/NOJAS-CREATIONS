<?php

/*
|--------------------------------------------------------------------------
| NOJA'S CREATIONS
| Admin Custom Design Requests
| Delete Request
|--------------------------------------------------------------------------
*/

header("Content-Type: application/json; charset=UTF-8");


/*
|--------------------------------------------------------------------------
| Only POST
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Database
|--------------------------------------------------------------------------
*/

require_once __DIR__ . "/../products/db.php";


/*
|--------------------------------------------------------------------------
| Get Request ID
|--------------------------------------------------------------------------
|
| Supports both:
| 1. FormData / application/x-www-form-urlencoded
| 2. JSON request body
|
*/

$id = 0;


/*
| Try normal POST data first
*/

if (isset($_POST["id"])) {

    $id = intval($_POST["id"]);

}


/*
| If no ID was found, try JSON
*/

if ($id <= 0) {

    $rawInput = file_get_contents("php://input");

    if (!empty($rawInput)) {

        $jsonData = json_decode(
            $rawInput,
            true
        );

        if (
            is_array($jsonData) &&
            isset($jsonData["id"])
        ) {

            $id = intval(
                $jsonData["id"]
            );

        }

    }

}


/*
|--------------------------------------------------------------------------
| Validate Request ID
|--------------------------------------------------------------------------
*/

if ($id <= 0) {

    http_response_code(422);

    echo json_encode([
        "success" => false,
        "message" => "Invalid request ID."
    ]);

    $conn->close();

    exit;
}


/*
|--------------------------------------------------------------------------
| Find Request
|--------------------------------------------------------------------------
*/

$stmt = $conn->prepare("
    SELECT image
    FROM custom_design_requests
    WHERE id = ?
");


if (!$stmt) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to prepare request."
    ]);

    $conn->close();

    exit;
}


$stmt->bind_param(
    "i",
    $id
);

$stmt->execute();

$result = $stmt->get_result();


/*
|--------------------------------------------------------------------------
| Check Request Exists
|--------------------------------------------------------------------------
*/

if ($result->num_rows === 0) {

    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "Request not found."
    ]);

    $stmt->close();
    $conn->close();

    exit;
}


$request = $result->fetch_assoc();

$imagePath = $request["image"] ?? "";


$stmt->close();


/*
|--------------------------------------------------------------------------
| Delete Database Record
|--------------------------------------------------------------------------
*/

$delete = $conn->prepare("
    DELETE FROM custom_design_requests
    WHERE id = ?
");


if (!$delete) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to prepare deletion."
    ]);

    $conn->close();

    exit;
}


$delete->bind_param(
    "i",
    $id
);


/*
|--------------------------------------------------------------------------
| Execute Delete
|--------------------------------------------------------------------------
*/

if (!$delete->execute()) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to delete request."
    ]);

    $delete->close();
    $conn->close();

    exit;
}


$delete->close();


/*
|--------------------------------------------------------------------------
| Delete Uploaded Image
|--------------------------------------------------------------------------
*/

if (!empty($imagePath)) {

    $imageFile =
        dirname(__DIR__, 2) .
        "/" .
        ltrim($imagePath, "/");


    if (is_file($imageFile)) {

        @unlink($imageFile);

    }

}


/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

echo json_encode([
    "success" => true,
    "message" => "Request deleted successfully.",
    "id" => $id
]);


$conn->close();

?>