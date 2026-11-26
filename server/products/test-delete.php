<?php

/*
|--------------------------------------------------------------------------
| NOJA'S CREATIONS
| Test Delete Product API
|--------------------------------------------------------------------------
*/

$url = "http://localhost/nojas-creations/server/products/delete.php";


/*
|--------------------------------------------------------------------------
| Product ID To Delete
|--------------------------------------------------------------------------
|
| Our test product was ID 1.
|
*/

$data = [
    "id" => "1"
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