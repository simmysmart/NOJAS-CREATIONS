<?php

/*
|--------------------------------------------------------------------------
| NOJA'S CREATIONS
| Admin Authentication
| Login
|--------------------------------------------------------------------------
*/

session_start();

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
| Get Input
|--------------------------------------------------------------------------
*/

$rawInput = file_get_contents("php://input");

$data = json_decode($rawInput, true);

if (!is_array($data)) {
    $data = $_POST;
}


$email =
    trim($data["email"] ?? "");


$password =
    $data["password"] ?? "";


/*
|--------------------------------------------------------------------------
| Validate
|--------------------------------------------------------------------------
*/

if ($email === "" || $password === "") {

    http_response_code(422);

    echo json_encode([
        "success" => false,
        "message" => "Email and password are required."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Temporary Admin Credentials
|--------------------------------------------------------------------------
|
| We will move these into the database in the next step.
|
*/

$adminEmail =
    "nojascreations@gmail.com";

$adminPassword =
    "NOJAS@Admin2026";


/*
|--------------------------------------------------------------------------
| Authenticate
|--------------------------------------------------------------------------
*/

if (
    strtolower($email) !==
        strtolower($adminEmail)
    ||
    $password !== $adminPassword
) {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Invalid email or password."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Create Session
|--------------------------------------------------------------------------
*/

session_regenerate_id(true);


$_SESSION["admin_authenticated"] = true;

$_SESSION["admin_email"] =
    $adminEmail;

$_SESSION["admin_login_time"] =
    time();


/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

echo json_encode([
    "success" => true,
    "message" => "Login successful.",
    "redirect" => "../../admin/index.html"
]);

?>