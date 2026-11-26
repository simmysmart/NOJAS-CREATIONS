<?php

/*
|--------------------------------------------------------------------------
| NOJA'S CREATIONS
| Test Create Product API
|--------------------------------------------------------------------------
*/

$url = "http://localhost/nojas-creations/server/products/create.php";


$data = [
    "product_name" => "NOJA Test Dress",
    "description" => "This is a test product for NOJA'S CREATIONS.",
    "category" => "Dresses",
    "price" => "45000",
    "featured" => "1",
    "status" => "published"
];


$ch = curl_init($url);

curl_setopt($ch, CURLOPT_POST, true);

curl_setopt(
    $ch,
    CURLOPT_POSTFIELDS,
    $data
);

curl_setopt(
    $ch,
    CURLOPT_RETURNTRANSFER,
    true
);


$response = curl_exec($ch);

$error = curl_error($ch);

curl_close($ch);


if ($error) {

    echo "cURL Error: " . $error;

    exit;
}


echo "<pre>";
echo htmlspecialchars($response);
echo "</pre>";