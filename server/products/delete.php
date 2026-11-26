<?php

require_once __DIR__ . "/../auth/require-auth.php";

/*
|--------------------------------------------------------------------------
| NOJA'S CREATIONS
| Delete Product API
|--------------------------------------------------------------------------
*/

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/db.php";


/*
|--------------------------------------------------------------------------
| Allow POST Requests Only
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Get Product ID
|--------------------------------------------------------------------------
*/

$id = isset($_POST["id"])
    ? (int) $_POST["id"]
    : 0;

if ($id <= 0) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "A valid product ID is required."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Get Product Image
|--------------------------------------------------------------------------
*/

$image = null;

$stmt = $conn->prepare(
    "SELECT image FROM products WHERE id = ?"
);

if (!$stmt) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare product lookup."
    ]);

    exit;
}

$stmt->bind_param(
    "i",
    $id
);

$stmt->execute();

$stmt->bind_result(
    $image
);

if (!$stmt->fetch()) {

    $stmt->close();

    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "Product not found."
    ]);

    exit;
}

$stmt->close();


/*
|--------------------------------------------------------------------------
| Delete Product From Database
|--------------------------------------------------------------------------
*/

$stmt = $conn->prepare(
    "DELETE FROM products WHERE id = ?"
);

if (!$stmt) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare delete query."
    ]);

    exit;
}

$stmt->bind_param(
    "i",
    $id
);


/*
|--------------------------------------------------------------------------
| Execute Delete
|--------------------------------------------------------------------------
*/

if (!$stmt->execute()) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete product.",
        "error" => $stmt->error
    ]);

    $stmt->close();
    $conn->close();

    exit;
}


/*
|--------------------------------------------------------------------------
| Confirm A Product Was Actually Deleted
|--------------------------------------------------------------------------
*/

if ($stmt->affected_rows === 0) {

    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "Product could not be deleted."
    ]);

    $stmt->close();
    $conn->close();

    exit;
}

$stmt->close();


/*
|--------------------------------------------------------------------------
| Delete Associated Product Image
|--------------------------------------------------------------------------
|
| Only delete images that belong to the dedicated
| admin-uploaded product image directory.
|
|--------------------------------------------------------------------------
*/

$imageDeleted = false;

if (!empty($image)) {

    /*
    |--------------------------------------------------------------------------
    | Product Upload Directory
    |--------------------------------------------------------------------------
    */

    $productImageDirectory =
        realpath(
            __DIR__ . "/../../assets/images/products/admin-uploaded/"
        );


    /*
    |--------------------------------------------------------------------------
    | Build Image Path
    |--------------------------------------------------------------------------
    */

    if ($productImageDirectory !== false) {

        $imageFile =
            realpath(
                __DIR__ . "/../../" . $image
            );


        /*
        |--------------------------------------------------------------------------
        | Security Check
        |--------------------------------------------------------------------------
        |
        | Make sure the resolved file is actually inside
        | the admin-uploaded product image directory.
        |
        |--------------------------------------------------------------------------
        */

        if (
            $imageFile !== false &&
            is_file($imageFile)
        ) {

            $directoryPrefix =
                rtrim(
                    $productImageDirectory,
                    DIRECTORY_SEPARATOR
                )
                . DIRECTORY_SEPARATOR;


            if (
                strpos(
                    $imageFile,
                    $directoryPrefix
                ) === 0
            ) {

                if (unlink($imageFile)) {

                    $imageDeleted = true;
                }
            }
        }
    }
}


/*
|--------------------------------------------------------------------------
| Success Response
|--------------------------------------------------------------------------
*/

echo json_encode([
    "success" => true,
    "message" => "Product deleted successfully.",
    "product_id" => $id,
    "image_deleted" => $imageDeleted
]);


$conn->close();

?>