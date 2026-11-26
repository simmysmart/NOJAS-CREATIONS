<?php

/*
|--------------------------------------------------------------------------
| NOJA'S CREATIONS
| Admin Custom Design Requests
| Read Requests
|--------------------------------------------------------------------------
*/

header("Content-Type: application/json; charset=UTF-8");


/*
|--------------------------------------------------------------------------
| Database
|--------------------------------------------------------------------------
*/

require_once __DIR__ . "/../products/db.php";


/*
|--------------------------------------------------------------------------
| Read Requests
|--------------------------------------------------------------------------
*/

$sql = "
    SELECT
        id,
        product,
        name,
        email,
        phone,
        category,
        budget,
        description,
        colour,
        occasion,
        image,
        status,
        created_at,
        updated_at
    FROM custom_design_requests
    ORDER BY created_at DESC
";


$result = $conn->query($sql);


/*
|--------------------------------------------------------------------------
| Check Query
|--------------------------------------------------------------------------
*/

if (!$result) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to load custom design requests."
    ]);

    $conn->close();

    exit;
}


/*
|--------------------------------------------------------------------------
| Build Requests
|--------------------------------------------------------------------------
*/

$requests = [];


while ($row = $result->fetch_assoc()) {

    $requests[] = $row;

}


/*
|--------------------------------------------------------------------------
| Success Response
|--------------------------------------------------------------------------
*/

echo json_encode([
    "success" => true,
    "requests" => $requests
]);


$conn->close();

?>