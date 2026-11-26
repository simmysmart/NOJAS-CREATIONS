<?php

require_once __DIR__ . "/../auth/require-auth.php";

/*
|--------------------------------------------------------------------------
| NOJA'S CREATIONS
| Update Product API
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
| Get Product Data
|--------------------------------------------------------------------------
*/

$productName = trim(
    $_POST["product_name"] ?? ""
);

$description = trim(
    $_POST["product_description"] ?? ""
);

$category = trim(
    $_POST["product_category"] ?? ""
);

$collection = trim(
    $_POST["product_collection"] ?? ""
);

$price = $_POST["product_price"] ?? 0;

$status = $_POST["product_status"] ?? "draft";

$featured = isset($_POST["product_featured"])
    ? 1
    : 0;


/*
|--------------------------------------------------------------------------
| Validate Product Name
|--------------------------------------------------------------------------
*/

if ($productName === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Product name is required."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Validate Category
|--------------------------------------------------------------------------
*/

if ($category === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Product category is required."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Validate Collection
|--------------------------------------------------------------------------
*/

if ($collection === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Product collection is required."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Validate Price
|--------------------------------------------------------------------------
*/

if (!is_numeric($price) || $price < 0) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Please enter a valid price."
    ]);

    exit;
}

$price = (float) $price;


/*
|--------------------------------------------------------------------------
| Validate Status
|--------------------------------------------------------------------------
*/

$allowedStatuses = [
    "draft",
    "published"
];

if (!in_array($status, $allowedStatuses, true)) {

    $status = "draft";
}


/*
|--------------------------------------------------------------------------
| Get Existing Product Image
|--------------------------------------------------------------------------
*/

$existingImage = null;

$getImage = $conn->prepare(
    "SELECT image FROM products WHERE id = ?"
);

if (!$getImage) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to check existing product."
    ]);

    exit;
}

$getImage->bind_param(
    "i",
    $id
);

$getImage->execute();

$getImage->bind_result(
    $existingImage
);

if (!$getImage->fetch()) {

    $getImage->close();

    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "Product not found."
    ]);

    exit;
}

$getImage->close();


/*
|--------------------------------------------------------------------------
| Keep Existing Image By Default
|--------------------------------------------------------------------------
*/

$imagePath = $existingImage;


/*
|--------------------------------------------------------------------------
| Handle New Product Image
|--------------------------------------------------------------------------
*/

if (
    isset($_FILES["product_image"]) &&
    $_FILES["product_image"]["error"] !== UPLOAD_ERR_NO_FILE
) {

    /*
    |--------------------------------------------------------------------------
    | Check Upload Error
    |--------------------------------------------------------------------------
    */

    if (
        $_FILES["product_image"]["error"]
        !== UPLOAD_ERR_OK
    ) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "There was a problem uploading the image."
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | Allowed Image Types
    |--------------------------------------------------------------------------
    */

    $allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    $fileType = mime_content_type(
        $_FILES["product_image"]["tmp_name"]
    );

    if (
        !in_array(
            $fileType,
            $allowedTypes,
            true
        )
    ) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Only JPG, PNG and WEBP images are allowed."
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | Maximum File Size
    |--------------------------------------------------------------------------
    */

    if (
        $_FILES["product_image"]["size"]
        > 5 * 1024 * 1024
    ) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Image size must not exceed 5MB."
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | Product Image Directory
    |--------------------------------------------------------------------------
    */

    $uploadDirectory =
        __DIR__
        . "/../../assets/images/products/admin-uploaded/";


    /*
    |--------------------------------------------------------------------------
    | Create Directory If Needed
    |--------------------------------------------------------------------------
    */

    if (!is_dir($uploadDirectory)) {

        if (
            !mkdir(
                $uploadDirectory,
                0755,
                true
            )
        ) {

            http_response_code(500);

            echo json_encode([
                "success" => false,
                "message" => "Failed to create image directory."
            ]);

            exit;
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Generate Safe Filename
    |--------------------------------------------------------------------------
    */

    $extension = strtolower(
        pathinfo(
            $_FILES["product_image"]["name"],
            PATHINFO_EXTENSION
        )
    );

    $fileName =
        uniqid(
            "product_",
            true
        )
        . "."
        . $extension;


    $destination =
        $uploadDirectory
        . $fileName;


    /*
    |--------------------------------------------------------------------------
    | Save New Image
    |--------------------------------------------------------------------------
    */

    if (
        !move_uploaded_file(
            $_FILES["product_image"]["tmp_name"],
            $destination
        )
    ) {

        http_response_code(500);

        echo json_encode([
            "success" => false,
            "message" => "Failed to save product image."
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | Database Image Path
    |--------------------------------------------------------------------------
    */

    $imagePath =
        "assets/images/products/admin-uploaded/"
        . $fileName;
}


/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

$sql = "
    UPDATE products
    SET
        product_name = ?,
        description = ?,
        category = ?,
        collection = ?,
        price = ?,
        image = ?,
        featured = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
";


$stmt = $conn->prepare($sql);


if (!$stmt) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare database query.",
        "error" => $conn->error
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Bind Parameters
|--------------------------------------------------------------------------
*/

$stmt->bind_param(
    "ssssdssis",
    $productName,
    $description,
    $category,
    $collection,
    $price,
    $imagePath,
    $featured,
    $status,
    $id
);


/*
|--------------------------------------------------------------------------
| Execute Update
|--------------------------------------------------------------------------
*/

if (!$stmt->execute()) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to update product.",
        "error" => $stmt->error
    ]);

    $stmt->close();
    $conn->close();

    exit;
}


/*
|--------------------------------------------------------------------------
| Success Response
|--------------------------------------------------------------------------
*/

echo json_encode([
    "success" => true,
    "message" => "Product updated successfully.",
    "product_id" => $id,
    "product" => [
        "id" => $id,
        "product_name" => $productName,
        "description" => $description,
        "category" => $category,
        "collection" => $collection,
        "price" => $price,
        "image" => $imagePath,
        "featured" => $featured,
        "status" => $status
    ]
]);


$stmt->close();
$conn->close();

?>