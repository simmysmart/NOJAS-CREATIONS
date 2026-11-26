<?php

/* =========================================================
   NOJA'S CREATIONS
   PRODUCTS - READ API
========================================================= */

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/db.php";


/* =========================================================
   CHECK DATABASE CONNECTION
========================================================= */

if ($conn->connect_error) {

    echo json_encode([
        "success" => false,
        "message" => "Database connection failed."
    ]);

    exit;
}


/* =========================================================
   GET PRODUCTS
========================================================= */

$sql = "
    SELECT
        id,
        product_name,
        description,
        category,
        collection,
        price,
        image,
        featured,
        status,
        created_at,
        updated_at
    FROM products
    ORDER BY created_at DESC
";


$result = $conn->query($sql);


/* =========================================================
   CHECK QUERY
========================================================= */

if (!$result) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to retrieve products.",
        "error" => $conn->error
    ]);

    exit;
}


/* =========================================================
   BUILD PRODUCTS ARRAY
========================================================= */

$products = [];

while ($row = $result->fetch_assoc()) {

    $row["id"] = (int) $row["id"];

    $row["price"] = (float) $row["price"];

    $row["featured"] = (int) $row["featured"];

    $products[] = $row;
}


/* =========================================================
   RESPONSE
========================================================= */

echo json_encode([
    "success" => true,
    "count" => count($products),
    "products" => $products
]);


$conn->close();