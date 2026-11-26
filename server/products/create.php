<?php

require_once __DIR__ . "/../auth/require-auth.php";

/*
|--------------------------------------------------------------------------
| NOJA'S CREATIONS
| Create Product API
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
| Product Image
|--------------------------------------------------------------------------
*/

$imagePath = null;


/*
|--------------------------------------------------------------------------
| Handle Product Image Upload
|--------------------------------------------------------------------------
*/

if (
    isset($_FILES["product_image"]) &&
    $_FILES["product_image"]["error"] !== UPLOAD_ERR_NO_FILE
) {

    /*
    |----------------------------------------------------------------------
    | Upload Error
    |----------------------------------------------------------------------
    */

    if (
        $_FILES["product_image"]["error"] !== UPLOAD_ERR_OK
    ) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "There was a problem uploading the image."
        ]);

        exit;
    }


    /*
    |----------------------------------------------------------------------
    | Allowed Image Types
    |----------------------------------------------------------------------
    */

    $allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    $fileType = mime_content_type(
        $_FILES["product_image"]["tmp_name"]
    );


    if (!in_array($fileType, $allowedTypes, true)) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Only JPG, PNG and WEBP images are allowed."
        ]);

        exit;
    }


    /*
    |----------------------------------------------------------------------
    | Maximum File Size: 5MB
    |----------------------------------------------------------------------
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
    |----------------------------------------------------------------------
    | Upload Directory
    |----------------------------------------------------------------------
    */

    $uploadDirectory =
        __DIR__
        . "/../../assets/images/products/admin-uploaded/";


    /*
    |----------------------------------------------------------------------
    | Create Directory If Needed
    |----------------------------------------------------------------------
    */

    if (!is_dir($uploadDirectory)) {

        if (!mkdir($uploadDirectory, 0755, true)) {

            http_response_code(500);

            echo json_encode([
                "success" => false,
                "message" => "Failed to create image directory."
            ]);

            exit;
        }
    }


    /*
    |----------------------------------------------------------------------
    | Determine Extension
    |----------------------------------------------------------------------
    */

    $extension = strtolower(
        pathinfo(
            $_FILES["product_image"]["name"],
            PATHINFO_EXTENSION
        )
    );


    /*
    |----------------------------------------------------------------------
    | Generate Safe Filename
    |----------------------------------------------------------------------
    */

    $fileName =
        uniqid("product_", true)
        . "."
        . $extension;


    $destination =
        $uploadDirectory
        . $fileName;


    /*
    |----------------------------------------------------------------------
    | Save Image
    |----------------------------------------------------------------------
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
    |----------------------------------------------------------------------
    | Database Image Path
    |----------------------------------------------------------------------
    */

    $imagePath =
        "assets/images/products/admin-uploaded/"
        . $fileName;
}


/*
|--------------------------------------------------------------------------
| Insert Product
|--------------------------------------------------------------------------
*/

$sql = "
    INSERT INTO products
    (
        product_name,
        description,
        category,
        collection,
        price,
        image,
        featured,
        status
    )
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?)
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
    "ssssdsis",
    $productName,
    $description,
    $category,
    $collection,
    $price,
    $imagePath,
    $featured,
    $status
);


/*
|--------------------------------------------------------------------------
| Execute Insert
|--------------------------------------------------------------------------
*/

if (!$stmt->execute()) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to create product.",
        "error" => $stmt->error
    ]);

    $stmt->close();
    $conn->close();

    exit;
}


/*
|--------------------------------------------------------------------------
| New Product ID
|--------------------------------------------------------------------------
*/

$productId = $stmt->insert_id;


/*
|--------------------------------------------------------------------------
| Success Response
|--------------------------------------------------------------------------
*/

echo json_encode([
    "success" => true,
    "message" => "Product created successfully.",
    "product_id" => $productId,

    "product" => [
        "id" => $productId,
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