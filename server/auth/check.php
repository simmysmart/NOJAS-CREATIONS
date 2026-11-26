<?php

/*
|--------------------------------------------------------------------------
| NOJA'S CREATIONS
| Admin Authentication
| Session Check
|--------------------------------------------------------------------------
*/

session_start();

header("Content-Type: application/json; charset=UTF-8");


/*
|--------------------------------------------------------------------------
| Check Session
|--------------------------------------------------------------------------
*/

if (
    !empty($_SESSION["admin_authenticated"]) &&
    $_SESSION["admin_authenticated"] === true
) {

    echo json_encode([
        "success" => true,
        "authenticated" => true,
        "email" => $_SESSION["admin_email"] ?? ""
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Not Authenticated
|--------------------------------------------------------------------------
*/

http_response_code(401);

echo json_encode([
    "success" => false,
    "authenticated" => false,
    "message" => "Authentication required."
]);

?>