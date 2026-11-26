
// =====================================================
// NOJA'S CREATIONS
// ADMIN PRODUCTS MANAGEMENT
// =====================================================


// =====================================================
// API
// =====================================================

const API = {
    create: "../server/products/create.php",
    read: "../server/products/read.php",
    update: "../server/products/update.php",
    delete: "../server/products/delete.php"
};


// =====================================================
// GLOBAL VARIABLES
// =====================================================

let products = [];
let editingProductId = null;


// =====================================================
// DOM ELEMENTS
// =====================================================

const openProductForm =
    document.getElementById("openProductForm");

const emptyAddProduct =
    document.getElementById("emptyAddProduct");

const productFormSection =
    document.getElementById("productFormSection");

const closeProductForm =
    document.getElementById("closeProductForm");

const cancelProductForm =
    document.getElementById("cancelProductForm");

const productForm =
    document.getElementById("productForm");

const productImage =
    document.getElementById("productImage");

const productImagePreview =
    document.getElementById("productImagePreview");

const productsTableBody =
    document.getElementById("productsTableBody");

const productsEmptyState =
    document.getElementById("productsEmptyState");

const productSearch =
    document.getElementById("productSearch");

const productCategoryFilter =
    document.getElementById("productCategoryFilter");

const productStatusFilter =
    document.getElementById("productStatusFilter");


// =====================================================
// OPEN PRODUCT FORM
// =====================================================

function openProductEditor() {

    editingProductId = null;


    if (productForm) {
        productForm.reset();
    }


    resetImagePreview();

    clearProductPreview();


    const title =
        document.getElementById("productFormTitle");


    if (title) {

        title.textContent =
            "Add New Product";

    }


    const submitButton =
        productForm
            ? productForm.querySelector(
                'button[type="submit"]'
            )
            : null;


    if (submitButton) {

        submitButton.disabled = false;

        submitButton.textContent =
            "Save Product";

    }


    if (productFormSection) {

        productFormSection.hidden =
            false;

        productFormSection.style.display =
            "block";


        productFormSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// =====================================================
// OPEN BUTTONS
// =====================================================

if (openProductForm) {

    openProductForm.addEventListener(
        "click",
        openProductEditor
    );

}


if (emptyAddProduct) {

    emptyAddProduct.addEventListener(
        "click",
        openProductEditor
    );

}


// =====================================================
// CLOSE PRODUCT FORM
// =====================================================

function closeProductEditor() {

    editingProductId = null;


    if (productForm) {
        productForm.reset();
    }


    resetImagePreview();

    clearProductPreview();


    if (productFormSection) {

        productFormSection.hidden =
            true;

        productFormSection.style.display =
            "none";

    }

}


if (closeProductForm) {

    closeProductForm.addEventListener(
        "click",
        closeProductEditor
    );

}


if (cancelProductForm) {

    cancelProductForm.addEventListener(
        "click",
        closeProductEditor
    );

}


// =====================================================
// RESET IMAGE PREVIEW
// =====================================================

function resetImagePreview() {

    if (!productImagePreview) {
        return;
    }


    productImagePreview.innerHTML = `

        <div class="product-upload-placeholder">

            <span>+</span>

            <strong>
                Product Image
            </strong>

            <small>
                JPG, PNG or WEBP
            </small>

        </div>

    `;

}


// =====================================================
// GET ADMIN IMAGE PATH
// =====================================================

function getAdminImagePath(image) {

    if (!image) {
        return "";
    }


    let imagePath =
        String(image).trim();


    if (!imagePath) {
        return "";
    }


    // =================================================
    // ABSOLUTE URL
    // =================================================

    if (
        imagePath.startsWith("http://") ||
        imagePath.startsWith("https://") ||
        imagePath.startsWith("data:")
    ) {

        return imagePath;

    }


    // =================================================
    // ALREADY ADMIN-RELATIVE
    // =================================================

    if (imagePath.startsWith("../")) {

        return imagePath;

    }


    // =================================================
    // DATABASE PATH
    // =================================================

    return "../" + imagePath;

}


// =====================================================
// IMAGE PREVIEW
// =====================================================

if (productImage) {

    productImage.addEventListener(
        "change",
        handleProductImagePreview
    );

}


// =====================================================
// HANDLE PRODUCT IMAGE PREVIEW
// =====================================================

function handleProductImagePreview() {

    if (!productImage) {
        return;
    }


    const file =
        productImage.files &&
        productImage.files.length > 0
            ? productImage.files[0]
            : null;


    // =================================================
    // NO NEW IMAGE SELECTED
    // =================================================

    if (!file) {

        if (editingProductId !== null) {

            const product =
                products.find(
                    function (item) {

                        return Number(item.id) ===
                            Number(editingProductId);

                    }
                );


            if (product) {

                showExistingProductImage(
                    product
                );

                updateProductPreview(
                    product
                );

            } else {

                resetImagePreview();

            }

        } else {

            resetImagePreview();

            clearProductPreview();

        }


        return;

    }


    // =================================================
    // VALIDATE FILE TYPE
    // =================================================

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if (!allowedTypes.includes(file.type)) {

        alert(
            "Please select a JPG, PNG or WEBP image."
        );


        productImage.value = "";


        restoreCurrentImagePreview();


        return;

    }


    // =================================================
    // VALIDATE FILE SIZE
    // =================================================

    if (file.size > 5 * 1024 * 1024) {

        alert(
            "Image size must not exceed 5MB."
        );


        productImage.value = "";


        restoreCurrentImagePreview();


        return;

    }


    // =================================================
    // CREATE TEMPORARY IMAGE URL
    // =================================================

    const imageURL =
        URL.createObjectURL(file);


    // =================================================
    // UPDATE UPLOAD PREVIEW
    // =================================================

    if (productImagePreview) {

        productImagePreview.innerHTML = `

            <img
                src="${imageURL}"
                alt="New Product Image Preview"
                style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                    display:block;
                "
            >

        `;

    }


    // =================================================
    // UPDATE LARGE PRODUCT PREVIEW
    // =================================================

    updatePreviewWithImage(
        imageURL,
        "New Product Image Preview"
    );


    // =================================================
    // CLEAN UP OBJECT URL
    // =================================================

    const previewImages =
        document.querySelectorAll(
            "#productImagePreview img, .product-preview-image img"
        );


    previewImages.forEach(
        function (img) {

            img.addEventListener(
                "load",
                function () {

                    /*
                     * Do not revoke the URL immediately
                     * because both previews use it.
                     *
                     * The URL will be released when another
                     * image is selected or the editor closes.
                     */

                },
                {
                    once: true
                }
            );

        }
    );

}


// =====================================================
// RESTORE CURRENT IMAGE PREVIEW
// =====================================================

function restoreCurrentImagePreview() {

    if (editingProductId !== null) {

        const product =
            products.find(
                function (item) {

                    return Number(item.id) ===
                        Number(editingProductId);

                }
            );


        if (product) {

            showExistingProductImage(
                product
            );


            updateProductPreview(
                product
            );


            return;

        }

    }


    resetImagePreview();

}


// =====================================================
// SHOW EXISTING PRODUCT IMAGE
// =====================================================

function showExistingProductImage(product) {

    if (
        !product ||
        !productImagePreview
    ) {
        return;
    }


    if (!product.image) {

        resetImagePreview();

        return;

    }


    const imagePath =
        getAdminImagePath(
            product.image
        );


    productImagePreview.innerHTML = `

        <img
            src="${escapeHTML(imagePath)}"
            alt="${escapeHTML(
                product.product_name ||
                "Product"
            )}"
            style="
                width:100%;
                height:100%;
                object-fit:cover;
                display:block;
            "
            onerror="
                this.style.display='none';
            "
        >

    `;

}


// =====================================================
// UPDATE PREVIEW WITH NEW IMAGE
// =====================================================

function updatePreviewWithImage(
    imageURL,
    altText
) {

    const previewImage =
        document.querySelector(
            ".product-preview-image"
        );


    if (!previewImage) {
        return;
    }


    previewImage.innerHTML = `

        <img
            src="${imageURL}"
            alt="${escapeHTML(
                altText ||
                "Product Preview"
            )}"
            style="
                width:100%;
                height:100%;
                object-fit:cover;
                display:block;
            "
        >

    `;

}


// =====================================================
// SUBMIT PRODUCT FORM
// =====================================================

if (productForm) {

    productForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const submitButton =
                productForm.querySelector(
                    'button[type="submit"]'
                );


            const isEditing =
                editingProductId !== null;


            try {

                // =================================================
                // DISABLE SUBMIT BUTTON
                // =================================================

                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        isEditing
                            ? "Updating..."
                            : "Saving...";

                }


                // =================================================
                // FORM DATA
                // =================================================

                const formData =
                    new FormData(
                        productForm
                    );


                // =================================================
                // COLLECTION VALIDATION
                // =================================================

                const collection =
                    formData.get(
                        "product_collection"
                    );


                console.log(
                    "Selected collection:",
                    collection
                );


                if (!collection) {

                    throw new Error(
                        "Please select a product collection."
                    );

                }


                // =================================================
                // DETERMINE API
                // =================================================

                let url;


                if (isEditing) {

                    formData.set(
                        "id",
                        editingProductId
                    );


                    url =
                        API.update;

                } else {

                    url =
                        API.create;

                }


                console.log(
                    "Sending product to:",
                    url
                );


                // =================================================
                // SEND REQUEST
                // =================================================

                const response =
                    await fetch(
                        url,
                        {
                            method: "POST",
                            body: formData,
                            credentials: "include"
                        }
                    );


                const responseText =
                    await response.text();


                console.log(
                    "Server response:",
                    responseText
                );


                // =================================================
                // PARSE JSON
                // =================================================

                let data;


                try {

                    data =
                        JSON.parse(
                            responseText
                        );

                } catch (jsonError) {

                    throw new Error(
                        "Server returned an invalid response: " +
                        responseText
                    );

                }


                // =================================================
                // HTTP ERROR
                // =================================================

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        `HTTP error: ${response.status}`
                    );

                }


                // =================================================
                // APPLICATION ERROR
                // =================================================

                if (!data.success) {

                    throw new Error(
                        data.message ||
                        "Unable to save product."
                    );

                }


                // =================================================
                // SUCCESS
                // =================================================

                alert(
                    isEditing
                        ? "Product updated successfully!"
                        : "Product added successfully!"
                );


                editingProductId =
                    null;


                closeProductEditor();


                await loadProducts();


            } catch (error) {

                console.error(
                    "Save product error:",
                    error
                );


                alert(
                    "Unable to save product.\n\n" +
                    error.message
                );


            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Save Product";

                }

            }

        }
    );

}


// =====================================================
// LOAD PRODUCTS
// =====================================================

async function loadProducts() {

    try {

        console.log(
            "Loading products from:",
            API.read
        );


        const response =
            await fetch(
                API.read,
                {
                    method: "GET",
                    cache: "no-store",
                    credentials: "include"
                }
            );


        const responseText =
            await response.text();


        console.log(
            "Products API response:",
            responseText
        );


        let data;


        try {

            data =
                JSON.parse(
                    responseText
                );

        } catch (jsonError) {

            throw new Error(
                "Invalid JSON returned by read.php"
            );

        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                `HTTP error: ${response.status}`
            );

        }


        if (!data.success) {

            throw new Error(
                data.message ||
                "Failed to load products."
            );

        }


        products =
            Array.isArray(
                data.products
            )
                ? data.products
                : [];


        console.log(
            "Products loaded successfully:",
            products
        );


        renderProducts();

        updateProductStats();


    } catch (error) {

        console.error(
            "Load products error:",
            error
        );

    }

}


// =====================================================
// RENDER PRODUCTS
// =====================================================

function renderProducts() {

    if (!productsTableBody) {
        return;
    }


    const search =
        productSearch
            ? productSearch.value
                .trim()
                .toLowerCase()
            : "";


    const category =
        productCategoryFilter
            ? productCategoryFilter.value
            : "all";


    const status =
        productStatusFilter
            ? productStatusFilter.value
            : "all";


    const filteredProducts =
        products.filter(
            function (product) {

                const productName =
                    String(
                        product.product_name ||
                        ""
                    ).toLowerCase();


                const productCategory =
                    String(
                        product.category ||
                        ""
                    ).toLowerCase();


                const productStatus =
                    String(
                        product.status ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    !search ||
                    productName.includes(
                        search
                    );


                const matchesCategory =
                    category === "all" ||
                    productCategory ===
                        category.toLowerCase();


                const matchesStatus =
                    status === "all" ||
                    productStatus ===
                        status.toLowerCase();


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesStatus
                );

            }
        );


    productsTableBody.innerHTML =
        "";


    if (
        filteredProducts.length ===
        0
    ) {

        productsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:40px;
                    "
                >
                    No products found.
                </td>

            </tr>

        `;


        if (productsEmptyState) {

            productsEmptyState.style.display =
                products.length === 0
                    ? "block"
                    : "none";

        }


        setText(
            "productResultCount",
            "0 products"
        );


        return;

    }


    if (productsEmptyState) {

        productsEmptyState.style.display =
            "none";

    }


    filteredProducts.forEach(
        function (product) {

            const row =
                document.createElement(
                    "tr"
                );


            const imageHTML =
                getProductImageHTML(
                    product
                );


            const statusClass =
                String(
                    product.status ||
                    "draft"
                ).toLowerCase();


            row.innerHTML = `

                <td>

                    <div
                        class="admin-product-table-product"
                        style="
                            display:flex;
                            align-items:center;
                            gap:12px;
                        "
                    >

                        ${imageHTML}

                        <div>

                            <strong>
                                ${escapeHTML(
                                    product.product_name ||
                                    "Unnamed Product"
                                )}
                            </strong>

                        </div>

                    </div>

                </td>


                <td>
                    ${escapeHTML(
                        formatCategory(
                            product.category
                        )
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        formatCollection(
                            product.collection
                        )
                    )}
                </td>


                <td>
                    ₦${formatPrice(
                        product.price
                    )}
                </td>


                <td>

                    <span
                        class="
                            product-status
                            product-status-${escapeHTML(
                                statusClass
                            )}
                        "
                    >
                        ${escapeHTML(
                            formatStatus(
                                product.status
                            )
                        )}
                    </span>

                </td>


                <td>

                    <span
                        class="
                            product-featured-status
                            ${
                                Number(
                                    product.featured
                                ) === 1
                                    ? "is-featured"
                                    : ""
                            }
                        "
                    >
                        ${
                            Number(
                                product.featured
                            ) === 1
                                ? "Yes"
                                : "No"
                        }
                    </span>

                </td>


                <td>

                    <div
                        class="product-action-buttons"
                    >

                        <button
                            type="button"
                            class="edit-product"
                            data-id="${product.id}"
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            class="delete-product"
                            data-id="${product.id}"
                        >
                            Delete
                        </button>

                    </div>

                </td>

            `;


            productsTableBody.appendChild(
                row
            );

        }
    );


    attachProductActions();


    setText(
        "productResultCount",
        `${filteredProducts.length} product${
            filteredProducts.length === 1
                ? ""
                : "s"
        }`
    );

}


// =====================================================
// PRODUCT IMAGE
// =====================================================

function getProductImageHTML(product) {

    if (!product.image) {

        return `

            <div
                style="
                    width:60px;
                    height:75px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#eee;
                    border-radius:6px;
                    font-size:10px;
                    text-align:center;
                "
            >
                No Image
            </div>

        `;

    }


    const imagePath =
        getAdminImagePath(
            product.image
        );


    return `

        <img
            src="${escapeHTML(imagePath)}"
            alt="${escapeHTML(
                product.product_name ||
                "Product"
            )}"
            style="
                width:60px;
                height:75px;
                object-fit:cover;
                border-radius:6px;
                display:block;
            "
            onerror="
                this.style.display='none';
            "
        >

    `;

}


// =====================================================
// PRODUCT ACTIONS
// =====================================================

function attachProductActions() {

    document
        .querySelectorAll(
            ".edit-product"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(
                                this.dataset.id
                            );


                        editProduct(id);

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".delete-product"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(
                                this.dataset.id
                            );


                        deleteProduct(id);

                    }
                );

            }
        );

}


// =====================================================
// EDIT PRODUCT
// =====================================================

function editProduct(id) {

    const product =
        products.find(
            function (item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;

    }


    editingProductId =
        Number(product.id);


    const title =
        document.getElementById(
            "productFormTitle"
        );


    if (title) {

        title.textContent =
            "Edit Product";

    }


    setFormValue(
        "productName",
        product.product_name
    );


    setFormValue(
        "productDescription",
        product.description
    );


    setFormValue(
        "productCategory",
        product.category
    );


    setFormValue(
        "product_collection",
        product.collection
    );


    setFormValue(
        "productPrice",
        product.price
    );


    setFormValue(
        "productStatus",
        product.status
    );


    const featured =
        document.getElementById(
            "productFeatured"
        );


    if (featured) {

        featured.checked =
            Number(
                product.featured
            ) === 1;

    }


    // =================================================
    // SHOW EXISTING IMAGE
    // =================================================

    showExistingProductImage(
        product
    );


    // =================================================
    // SHOW CURRENT PRODUCT INFORMATION
    // =================================================

    updateProductPreview(
        product
    );


    const submitButton =
        productForm
            ? productForm.querySelector(
                'button[type="submit"]'
            )
            : null;


    if (submitButton) {

        submitButton.disabled =
            false;

        submitButton.textContent =
            "Update Product";

    }


    // =================================================
    // OPEN EDITOR
    // =================================================

    if (productFormSection) {

        productFormSection.hidden =
            false;

        productFormSection.style.display =
            "block";


        productFormSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// =====================================================
// DELETE PRODUCT
// =====================================================

async function deleteProduct(id) {

    const product =
        products.find(
            function (item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    const productName =
        product
            ? product.product_name
            : "this product";


    const confirmed =
        confirm(
            `Are you sure you want to delete "${productName}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const formData =
            new FormData();


        formData.append(
            "id",
            id
        );


        const response =
            await fetch(
                API.delete,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }
            );


        const responseText =
            await response.text();


        let data;


        try {

            data =
                JSON.parse(
                    responseText
                );

        } catch (error) {

            throw new Error(
                "Invalid response from delete.php"
            );

        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                `HTTP error: ${response.status}`
            );

        }


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to delete product."
            );

        }


        alert(
            "Product deleted successfully!"
        );


        if (
            editingProductId !== null &&
            Number(editingProductId) ===
                Number(id)
        ) {

            closeProductEditor();

        }


        await loadProducts();


        clearProductPreview();


    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );


        alert(
            "Unable to delete product.\n\n" +
            error.message
        );

    }

}


// =====================================================
// UPDATE PRODUCT PREVIEW
// =====================================================

function updateProductPreview(product) {

    if (!product) {
        return;
    }


    setText(
        "previewCategory",
        formatCategory(
            product.category
        ).toUpperCase()
    );


    setText(
        "previewName",
        product.product_name ||
        "Product Name"
    );


    setText(
        "previewDescription",
        product.description ||
        "Product description will appear here."
    );


    setText(
        "previewPrice",
        "₦" +
        formatPrice(
            product.price
        )
    );


    setText(
        "previewStatus",
        formatStatus(
            product.status
        )
    );


    const previewImage =
        document.querySelector(
            ".product-preview-image"
        );


    if (!previewImage) {
        return;
    }


    if (product.image) {

        const imagePath =
            getAdminImagePath(
                product.image
            );


        previewImage.innerHTML = `

            <img
                src="${escapeHTML(imagePath)}"
                alt="${escapeHTML(
                    product.product_name ||
                    "Product"
                )}"
                style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                    display:block;
                "
                onerror="
                    this.style.display='none';
                "
            >

        `;

    } else {

        previewImage.innerHTML = `

            <div
                class="product-preview-placeholder"
            >

                <span>
                    NOJA'S
                </span>

                <small>
                    CREATIONS
                </small>

            </div>

        `;

    }

}


// =====================================================
// CLEAR PREVIEW
// =====================================================

function clearProductPreview() {

    setText(
        "previewCategory",
        "CATEGORY"
    );


    setText(
        "previewName",
        "Product Name"
    );


    setText(
        "previewDescription",
        "Product description will appear here."
    );


    setText(
        "previewPrice",
        "₦0"
    );


    setText(
        "previewStatus",
        "Draft"
    );


    const previewImage =
        document.querySelector(
            ".product-preview-image"
        );


    if (previewImage) {

        previewImage.innerHTML = `

            <div
                class="product-preview-placeholder"
            >

                <span>
                    NOJA'S
                </span>

                <small>
                    CREATIONS
                </small>

            </div>

        `;

    }

}


// =====================================================
// SEARCH
// =====================================================

if (productSearch) {

    productSearch.addEventListener(
        "input",
        renderProducts
    );

}


// =====================================================
// CATEGORY FILTER
// =====================================================

if (productCategoryFilter) {

    productCategoryFilter.addEventListener(
        "change",
        renderProducts
    );

}


// =====================================================
// STATUS FILTER
// =====================================================

if (productStatusFilter) {

    productStatusFilter.addEventListener(
        "change",
        renderProducts
    );

}


// =====================================================
// UPDATE PRODUCT STATISTICS
// =====================================================

function updateProductStats() {

    const total =
        products.length;


    const published =
        products.filter(
            function (product) {

                return String(
                    product.status ||
                    ""
                ).toLowerCase() ===
                    "published";

            }
        ).length;


    const drafts =
        products.filter(
            function (product) {

                return String(
                    product.status ||
                    ""
                ).toLowerCase() ===
                    "draft";

            }
        ).length;


    const featured =
        products.filter(
            function (product) {

                return Number(
                    product.featured
                ) === 1;

            }
        ).length;


    setText(
        "totalProducts",
        total
    );


    setText(
        "publishedProducts",
        published
    );


    setText(
        "draftProducts",
        drafts
    );


    setText(
        "featuredProducts",
        featured
    );

}


// =====================================================
// HELPERS
// =====================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value ?? "";

    }

}


// =====================================================
// SET FORM VALUE
// =====================================================

function setFormValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value ?? "";

    }

}


// =====================================================
// FORMAT PRICE
// =====================================================

function formatPrice(price) {

    const number =
        Number(price);


    if (Number.isNaN(number)) {

        return "0";

    }


    return number.toLocaleString(
        "en-NG",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );

}


// =====================================================
// FORMAT CATEGORY
// =====================================================

function formatCategory(
    category
) {

    if (!category) {

        return "Uncategorized";

    }


    return String(category)
        .replace(
            /[-_]/g,
            " "
        )
        .replace(
            /\b\w/g,
            function (letter) {

                return letter.toUpperCase();

            }
        );

}


// =====================================================
// FORMAT COLLECTION
// =====================================================

function formatCollection(
    collection
) {

    if (!collection) {

        return "Unassigned";

    }


    const labels = {

        signature:
            "Signature Collection",

        traditional:
            "Traditional Wear",

        ankara:
            "Ankara Collection",

        evening:
            "Evening Wear",

        bridal:
            "Bridal Collection",

        agbada:
            "Agbada Collection"

    };


    return (
        labels[
            String(
                collection
            ).toLowerCase()
        ] ||
        formatCategory(
            collection
        )
    );

}


// =====================================================
// FORMAT STATUS
// =====================================================

function formatStatus(
    status
) {

    if (!status) {

        return "Draft";

    }


    const normalized =
        String(status);


    return (
        normalized
            .charAt(0)
            .toUpperCase() +
        normalized.slice(1)
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProducts();

    }
);