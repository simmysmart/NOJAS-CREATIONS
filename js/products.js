/* =========================================================
   NOJA'S CREATIONS
   PUBLIC PRODUCTS JAVASCRIPT

   FEATURES:
   - Load products from database
   - Featured products
   - Product listing
   - Product filtering
   - Product search
   - Product details
   - Collection support
   - Image handling
   - Published products only
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       API
    ===================================================== */

    const PRODUCTS_API =
        "/NOJAS-CREATIONS/server/products/read.php";


    /* =====================================================
       PRODUCT STORAGE
    ===================================================== */

    let products = [];


    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const featuredContainer =
        document.getElementById("featuredProducts");

    const productsContainer =
        document.getElementById("productsGrid");

    const productDetails =
        document.getElementById("productDetails");

    const productSearch =
        document.getElementById("productSearch");


    /* =====================================================
       COLLECTION LABEL
    ===================================================== */

    function getCollectionLabel(collection) {

        if (!collection) {
            return "NOJA'S CREATIONS";
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


        const key =
            String(collection)
                .trim()
                .toLowerCase();


        return labels[key] || collection;

    }


    /* =====================================================
       CATEGORY LABEL
    ===================================================== */

    function getCategoryLabel(category) {

        if (!category) {
            return "";
        }

        return String(category)
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, function (letter) {

                return letter.toUpperCase();

            });

    }


    /* =====================================================
       CONVERT DATABASE PRODUCT
       TO PUBLIC PRODUCT FORMAT
    ===================================================== */

    function formatProduct(product) {

        return {

            id:
                Number(product.id),

            name:
                product.product_name ||
                "Untitled Product",

            category:
                product.category ||
                "",

            collection:
                product.collection ||
                "",

            collectionLabel:
                getCollectionLabel(
                    product.collection
                ),

            categoryLabel:
                getCategoryLabel(
                    product.category
                ),

            image:
                product.image ||
                "",

            description:
                product.description ||
                "",

            price:
                Number(product.price || 0),

            featured:
                Number(product.featured || 0),

            status:
                product.status ||
                "draft",

            created_at:
                product.created_at ||
                "",

            updated_at:
                product.updated_at ||
                ""

        };

    }


    /* =====================================================
       GET IMAGE PATH
    ===================================================== */

    function getImagePath(image) {

        if (!image) {

            return "/NOJAS-CREATIONS/assets/images/logo.jpg";

        }


        const imagePath =
            String(image).trim();


        /*
         * Full external URL
         */

        if (
            imagePath.startsWith("http://") ||
            imagePath.startsWith("https://")
        ) {

            return imagePath;

        }


        /*
         * Already root-relative
         */

        if (imagePath.startsWith("/")) {

            return imagePath;

        }


        /*
         * Database stores paths such as:
         *
         * assets/images/products/...
         *
         */

        return "/NOJAS-CREATIONS/" + imagePath;

    }


    /* =====================================================
       PRODUCT DETAILS URL
    ===================================================== */

    function getProductDetailsUrl(productId) {

        const currentPath =
            window.location.pathname;


        /*
         * Homepage
         *
         * /NOJAS-CREATIONS/
         */

        if (
            currentPath ===
                "/NOJAS-CREATIONS/" ||
            currentPath.endsWith(
                "/NOJAS-CREATIONS/index.html"
            )
        ) {

            return (
                "pages/product-details.html?id=" +
                encodeURIComponent(productId)
            );

        }


        /*
         * Pages inside /pages/
         */

        return (
            "product-details.html?id=" +
            encodeURIComponent(productId)
        );

    }


    /* =====================================================
       CREATE PRODUCT CARD
    ===================================================== */

    function createProductCard(product) {

        const article =
            document.createElement("article");


        article.className =
            "featured-card";


        article.innerHTML = `

            <a
                href="${getProductDetailsUrl(product.id)}"
                class="product-image"
                aria-label="View ${escapeHTML(product.name)}"
            >

                <img
                    src="${getImagePath(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                >

            </a>


            <div class="product-info">

                <span>
                    ${escapeHTML(
                        product.collectionLabel
                    )}
                </span>


                <h3>
                    ${escapeHTML(
                        product.name
                    )}
                </h3>

            </div>

        `;


        /*
         * Image error handling
         */

        const image =
            article.querySelector("img");


        if (image) {

            image.addEventListener(
                "error",
                function () {

                    console.error(
                        "Product image failed to load:",
                        product.image
                    );

                    image.classList.add(
                        "image-error"
                    );

                }
            );

        }


        return article;

    }


    /* =====================================================
       LOAD PRODUCTS FROM DATABASE
    ===================================================== */

    async function fetchProducts() {

        try {

            console.log(
                "Loading public products from:",
                PRODUCTS_API
            );


            const response =
                await fetch(
                    PRODUCTS_API,
                    {
                        method: "GET",
                        cache: "no-store"
                    }
                );


            const text =
                await response.text();


            console.log(
                "Public products API response:",
                text
            );


            let data;


            try {

                data =
                    JSON.parse(text);

            } catch (error) {

                throw new Error(
                    "The products server returned invalid JSON."
                );

            }


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Failed to load products."
                );

            }


            /*
             * Only published products
             * are displayed publicly.
             */

            products =
                (data.products || [])
                    .filter(function (product) {

                        return (
                            String(
                                product.status
                            ).toLowerCase() ===
                            "published"
                        );

                    })
                    .map(formatProduct);


            console.log(
                "Public products loaded successfully:",
                products
            );


            /*
             * Make products available
             * to other scripts.
             */

            window.NOJAProducts =
                products;


            /*
             * Render homepage featured products.
             */

            loadFeaturedProducts();


            /*
             * Render product listing page.
             */

            loadProducts();


            /*
             * Render product details page
             * when applicable.
             */

            loadProductDetails();


        } catch (error) {

            console.error(
                "Public products error:",
                error
            );


            if (productsContainer) {

                productsContainer.innerHTML = `

                    <div class="no-products">

                        <p>
                            Products are temporarily
                            unavailable.
                        </p>

                    </div>

                `;

            }


            if (productDetails) {

                productDetails.innerHTML = `

                    <div class="no-products">

                        <h2>
                            Unable to Load Design
                        </h2>

                        <p>
                            Please try again later.
                        </p>

                    </div>

                `;

            }

        }

    }


    /* =====================================================
       FEATURED PRODUCTS
    ===================================================== */

    function loadFeaturedProducts() {

        if (!featuredContainer) {
            return;
        }


        /*
         * Only published + featured products.
         */

        const featuredProducts =
            products.filter(function (product) {

                return (
                    product.status ===
                        "published" &&
                    product.featured === 1
                );

            });


        /*
         * No featured products.
         */

        if (!featuredProducts.length) {

            featuredContainer.innerHTML = `

                <div class="no-products">

                    <p>
                        No featured products available.
                    </p>

                </div>

            `;

            return;

        }


        /*
         * Clear existing products.
         */

        featuredContainer.innerHTML = "";


        /*
         * Create cards.
         */

        featuredProducts.forEach(
            function (product, index) {

                const article =
                    createProductCard(product);


                /*
                 * Preserve homepage
                 * large-card design.
                 */

                if (index === 0) {

                    article.classList.add(
                        "large-card"
                    );

                }


                featuredContainer.appendChild(
                    article
                );

            }
        );

    }


    /* =====================================================
       LOAD PRODUCTS PAGE
    ===================================================== */

    function loadProducts(
        productList = products
    ) {

        if (!productsContainer) {
            return;
        }


        productsContainer.innerHTML = "";


        /*
         * No products.
         */

        if (!productList.length) {

            productsContainer.innerHTML = `

                <div class="no-products">

                    <p>
                        No products found.
                    </p>

                </div>

            `;

            return;

        }


        /*
         * Add products.
         */

        productList.forEach(
            function (product) {

                productsContainer.appendChild(
                    createProductCard(product)
                );

            }
        );

    }


    /* =====================================================
       PRODUCT FILTER
    ===================================================== */

    const filterButtons =
        document.querySelectorAll(
            "[data-product-filter]"
        );


    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const category =
                        button.dataset.productFilter;


                    /*
                     * Remove active state.
                     */

                    filterButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    /*
                     * Activate clicked filter.
                     */

                    button.classList.add(
                        "active"
                    );


                    /*
                     * Show all.
                     */

                    if (
                        !category ||
                        category === "all"
                    ) {

                        loadProducts(
                            products
                        );

                        return;

                    }


                    /*
                     * Filter products
                     * by category.
                     */

                    const filteredProducts =
                        products.filter(
                            function (product) {

                                return (
                                    String(
                                        product.category
                                    ).toLowerCase() ===
                                    String(
                                        category
                                    ).toLowerCase()
                                );

                            }
                        );


                    loadProducts(
                        filteredProducts
                    );

                }
            );

        }
    );


    /* =====================================================
       PRODUCT SEARCH
    ===================================================== */

    if (productSearch) {

        productSearch.addEventListener(
            "input",
            function () {

                const searchTerm =
                    productSearch.value
                        .trim()
                        .toLowerCase();


                /*
                 * Empty search.
                 */

                if (!searchTerm) {

                    loadProducts(
                        products
                    );

                    return;

                }


                /*
                 * Search products.
                 */

                const results =
                    products.filter(
                        function (product) {

                            return (

                                product.name
                                    .toLowerCase()
                                    .includes(
                                        searchTerm
                                    )

                                ||

                                product.collection
                                    .toLowerCase()
                                    .includes(
                                        searchTerm
                                    )

                                ||

                                product.category
                                    .toLowerCase()
                                    .includes(
                                        searchTerm
                                    )

                                ||

                                product.description
                                    .toLowerCase()
                                    .includes(
                                        searchTerm
                                    )

                            );

                        }
                    );


                loadProducts(results);

            }
        );

    }


    /* =====================================================
       PRODUCT DETAILS
    ===================================================== */

    function loadProductDetails() {

        if (!productDetails) {
            return;
        }


        console.log(
            "Product details page detected."
        );


        /*
         * Get ID from URL.
         */

        const params =
            new URLSearchParams(
                window.location.search
            );


        const productId =
            Number(
                params.get("id")
            );


        console.log(
            "Requested product ID:",
            productId
        );


        /*
         * No product ID.
         */

        if (!productId) {

            showProductNotFound();

            return;

        }


        /*
         * Find product in database-loaded array.
         */

        const product =
            products.find(
                function (item) {

                    return (
                        Number(item.id) ===
                        productId
                    );

                }
            );


        /*
         * Product does not exist.
         */

        if (!product) {

            showProductNotFound();

            return;

        }


        /*
         * Product must be published.
         */

        if (
            product.status !==
            "published"
        ) {

            showProductNotFound();

            return;

        }


        console.log(
            "Displaying product:",
            product
        );


        /*
         * Render product.
         */

        productDetails.innerHTML = `

            <div class="product-details-image">

                <img
                    src="${getImagePath(product.image)}"
                    alt="${escapeHTML(product.name)}"
                >

            </div>


            <div class="product-details-content">

                <span class="product-details-collection">

                    ${escapeHTML(
                        product.collectionLabel
                    )}

                </span>


                <h1>

                    ${escapeHTML(
                        product.name
                    )}

                </h1>


                ${
                    product.description
                        ? `
                            <p class="product-details-description">

                                ${escapeHTML(
                                    product.description
                                )}

                            </p>
                        `
                        : ""
                }


                ${
                    product.price > 0
                        ? `
                            <div class="product-details-price">

                                ₦${formatPrice(
                                    product.price
                                )}

                            </div>
                        `
                        : ""
                }


                <a
                    href="custom-design.html?product=${encodeURIComponent(
                        product.name
                    )}"
                    class="primary-button"
                >

                    <span>
                        Request This Design
                    </span>

                    <strong aria-hidden="true">
                        ↗
                    </strong>

                </a>

            </div>

        `;


        /*
         * Product image error handling.
         */

        const image =
            productDetails.querySelector(
                "img"
            );


        if (image) {

            image.addEventListener(
                "error",
                function () {

                    console.error(
                        "Product details image failed:",
                        product.image
                    );

                    image.classList.add(
                        "image-error"
                    );

                }
            );

        }

    }


    /* =====================================================
       PRODUCT NOT FOUND
    ===================================================== */

    function showProductNotFound() {

        if (!productDetails) {
            return;
        }


        productDetails.innerHTML = `

            <div class="no-products">

                <h2>
                    Product Not Found
                </h2>


                <p>
                    The product you are looking for
                    could not be found.
                </p>


                <a
                    href="collections.html"
                    class="primary-button"
                >

                    Back to Collections

                </a>

            </div>

        `;

    }


    /* =====================================================
       FORMAT PRICE
    ===================================================== */

    function formatPrice(price) {

        return Number(price).toLocaleString(
            "en-NG",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        );

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

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


    /* =====================================================
       GLOBAL IMAGE ERROR HANDLING
    ===================================================== */

    document
        .querySelectorAll(
            ".product-image img, .product-details-image img"
        )
        .forEach(
            function (image) {

                image.addEventListener(
                    "error",
                    function () {

                        image.classList.add(
                            "image-error"
                        );

                    }
                );

            }
        );


    /* =====================================================
       START PRODUCT SYSTEM
    ===================================================== */

    fetchProducts();


    console.log(
        "NOJA'S CREATIONS public product system initialized."
    );

});