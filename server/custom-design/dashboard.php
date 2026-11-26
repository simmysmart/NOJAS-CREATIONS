<?php

/*
|--------------------------------------------------------------------------
| NOJA'S CREATIONS
| Custom Design Request Dashboard API
|--------------------------------------------------------------------------
*/

require_once __DIR__ . "/../auth/require-auth.php";

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../products/db.php";


/*
|--------------------------------------------------------------------------
| CHECK DATABASE CONNECTION
|--------------------------------------------------------------------------
*/

if ($conn->connect_error) {

    echo json_encode([
        "success" => false,
        "message" => "Database connection failed."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| TOTAL REQUESTS
|--------------------------------------------------------------------------
*/

$totalResult = $conn->query("
    SELECT COUNT(*) AS total
    FROM custom_design_requests
");

$total = 0;

if ($totalResult) {

    $row = $totalResult->fetch_assoc();

    $total = (int) $row["total"];
}


/*
|--------------------------------------------------------------------------
| PENDING REQUESTS
|--------------------------------------------------------------------------
*/

$pendingResult = $conn->query("
    SELECT COUNT(*) AS total
    FROM custom_design_requests
    WHERE status = 'pending'
");

$pending = 0;

if ($pendingResult) {

    $row = $pendingResult->fetch_assoc();

    $pending = (int) $row["total"];
}


/*
|--------------------------------------------------------------------------
| REVIEWED REQUESTS
|--------------------------------------------------------------------------
*/

$reviewedResult = $conn->query("
    SELECT COUNT(*) AS total
    FROM custom_design_requests
    WHERE status = 'reviewed'
");

$reviewed = 0;

if ($reviewedResult) {

    $row = $reviewedResult->fetch_assoc();

    $reviewed = (int) $row["total"];
}


/*
|--------------------------------------------------------------------------
| COMPLETED REQUESTS
|--------------------------------------------------------------------------
*/

$completedResult = $conn->query("
    SELECT COUNT(*) AS total
    FROM custom_design_requests
    WHERE status = 'completed'
");

$completed = 0;

if ($completedResult) {

    $row = $completedResult->fetch_assoc();

    $completed = (int) $row["total"];
}


/*
|--------------------------------------------------------------------------
| CANCELLED REQUESTS
|--------------------------------------------------------------------------
*/

$cancelledResult = $conn->query("
    SELECT COUNT(*) AS total
    FROM custom_design_requests
    WHERE status = 'cancelled'
");

$cancelled = 0;

if ($cancelledResult) {

    $row = $cancelledResult->fetch_assoc();

    $cancelled = (int) $row["total"];
}


/*
|--------------------------------------------------------------------------
| RECENT REQUESTS
|--------------------------------------------------------------------------
|
| design_image and preferred_date are NOT included because
| they do not exist in the current database table.
|
*/

$recentRequests = [];

$recentResult = $conn->query("
    SELECT
        id,
        name,
        email,
        phone,
        category,
        occasion,
        description,
        budget,
        status,
        created_at
    FROM custom_design_requests
    ORDER BY created_at DESC
    LIMIT 5
");


if (!$recentResult) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to retrieve design requests.",
        "error" => $conn->error
    ]);

    $conn->close();

    exit;
}


while ($row = $recentResult->fetch_assoc()) {

    $recentRequests[] = $row;
}


/*
|--------------------------------------------------------------------------
| RESPONSE
|--------------------------------------------------------------------------
*/

echo json_encode([

    "success" => true,

    "statistics" => [

        "total" => $total,

        "pending" => $pending,

        "reviewed" => $reviewed,

        "completed" => $completed,

        "cancelled" => $cancelled

    ],

    "requests" => $recentRequests,

    "recent_requests" => $recentRequests

]);


$conn->close();

?>