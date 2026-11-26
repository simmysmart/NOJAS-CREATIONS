<?php

/* =========================================================
   NOJA'S CREATIONS
   ADMIN AUTHENTICATION HELPER
========================================================= */

session_start();

header("Content-Type: application/json; charset=UTF-8");


/* =========================================================
   CHECK ADMIN SESSION
========================================================= */

if (
    empty($_SESSION["admin_authenticated"]) ||
    $_SESSION["admin_authenticated"] !== true
) {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "authenticated" => false,
        "message" => "Authentication required."
    ]);

    exit;
}