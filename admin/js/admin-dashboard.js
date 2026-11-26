/* =========================================================
   NOJA'S CREATIONS
   ADMIN DASHBOARD
   DASHBOARD JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       API
    ====================================================== */

    const API = {
        products: "../server/products/read.php",
        requests: "../server/custom-design/dashboard.php"
    };


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const totalProducts =
        document.getElementById("totalProducts");

    const totalRequests =
        document.getElementById("totalRequests");

    const requestBadge =
        document.getElementById("requestBadge");

    const notificationCount =
        document.getElementById("notificationCount");

    const recentProducts =
        document.getElementById("recentProducts");

    const recentRequests =
        document.getElementById("recentRequests");

    const adminName =
        document.getElementById("adminName");

    const welcomeName =
        document.getElementById("welcomeName");


    /* =====================================================
       FORMAT PRICE
    ====================================================== */

    function formatPrice(price) {

        const amount = Number(price) || 0;

        return "₦" +
            amount.toLocaleString("en-NG");

    }


    /* =====================================================
       IMAGE PATH
    ====================================================== */

    function getImagePath(image) {

        if (!image) {
            return "";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://") ||
            image.startsWith("/")
        ) {
            return image;
        }

        return "../" +
            image.replace(/^\/+/, "");

    }


    /* =====================================================
       ESCAPE HTML
    ====================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       FORMAT DATE
    ====================================================== */

    function formatDate(dateString) {

        if (!dateString) {
            return "";
        }

        const date = new Date(
            dateString.replace(" ", "T")
        );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
        }

        return date.toLocaleDateString(
            "en-NG",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       LOAD PRODUCTS
    ====================================================== */

    async function loadProducts() {

        try {

            const response =
                await fetch(
                    API.products,
                    {
                        credentials: "include",
                        cache: "no-store"
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Unable to load products."
                );

            }


            const products =
                Array.isArray(data.products)
                    ? data.products
                    : [];


            /*
             * Only published products are shown
             * on the public website.
             */

            const publishedProducts =
                products.filter(
                    product =>
                        String(
                            product.status
                        ).toLowerCase() ===
                        "published"
                );


            /* =============================================
               TOTAL PRODUCTS
            ============================================== */

            if (totalProducts) {

                totalProducts.textContent =
                    publishedProducts.length;

            }


            /* =============================================
               RECENT PRODUCTS
            ============================================== */

            renderRecentProducts(
                publishedProducts
            );


            console.log(
                "Dashboard products loaded:",
                publishedProducts
            );


        } catch (error) {

            console.error(
                "Dashboard product loading error:",
                error
            );


            if (totalProducts) {
                totalProducts.textContent = "0";
            }


            if (recentProducts) {

                recentProducts.innerHTML = `
                    <div class="dashboard-empty-state">
                        <div class="dashboard-empty-icon">◈</div>

                        <h4>
                            Unable to load products
                        </h4>

                        <p>
                            Please refresh the dashboard
                            and try again.
                        </p>
                    </div>
                `;

            }

        }

    }


    /* =====================================================
       RENDER RECENT PRODUCTS
    ====================================================== */

    function renderRecentProducts(products) {

        if (!recentProducts) {
            return;
        }


        if (!products.length) {

            recentProducts.innerHTML = `
                <div class="dashboard-empty-state">

                    <div class="dashboard-empty-icon">
                        ◈
                    </div>

                    <h4>
                        No products yet
                    </h4>

                    <p>
                        Add your first fashion
                        design to your catalogue.
                    </p>

                    <a
                        href="products.html"
                        class="dashboard-empty-link"
                    >
                        Add Product
                        <span>→</span>
                    </a>

                </div>
            `;

            return;

        }


        const recent =
            products.slice(0, 5);


        recentProducts.innerHTML =
            recent.map(product => {

                const image =
                    getImagePath(
                        product.image
                    );


                const productName =
                    product.product_name ||
                    "Untitled Product";


                const collection =
                    product.collection ||
                    product.category ||
                    "NOJA'S CREATIONS";


                return `
                    <a
                        href="products.html"
                        class="dashboard-product-item"
                    >

                        <div class="dashboard-product-image">

                            ${
                                image
                                    ? `
                                        <img
                                            src="${escapeHTML(image)}"
                                            alt="${escapeHTML(productName)}"
                                            loading="lazy"
                                        >
                                      `
                                    : `
                                        <span>
                                            ◈
                                        </span>
                                      `
                            }

                        </div>


                        <div class="dashboard-product-info">

                            <strong>
                                ${escapeHTML(productName)}
                            </strong>

                            <span>
                                ${escapeHTML(collection)}
                            </span>

                        </div>


                        <div class="dashboard-product-price">

                            ${formatPrice(product.price)}

                        </div>

                    </a>
                `;

            }).join("");

    }


    /* =====================================================
       LOAD CUSTOM DESIGN REQUESTS
    ====================================================== */

    async function loadRequests() {

        try {

            const response =
                await fetch(
                    API.requests,
                    {
                        credentials: "include",
                        cache: "no-store"
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Unable to load design requests."
                );

            }


            const requests =
                Array.isArray(data.requests)
                    ? data.requests
                    : [];


            /* =============================================
               TOTAL REQUESTS
            ============================================== */

            if (totalRequests) {

                totalRequests.textContent =
                    requests.length;

            }


            /* =============================================
               REQUEST BADGE
            ============================================== */

            if (requestBadge) {

                requestBadge.textContent =
                    requests.length;

            }


            /* =============================================
               NOTIFICATION COUNT
            ============================================== */

            if (notificationCount) {

                notificationCount.textContent =
                    requests.length;

            }


            /* =============================================
               RECENT REQUESTS
            ============================================== */

            renderRecentRequests(
                requests
            );


            console.log(
                "Dashboard requests loaded:",
                requests
            );


        } catch (error) {

            console.error(
                "Dashboard request loading error:",
                error
            );


            if (totalRequests) {
                totalRequests.textContent = "0";
            }


            if (requestBadge) {
                requestBadge.textContent = "0";
            }


            if (notificationCount) {
                notificationCount.textContent = "0";
            }


            if (recentRequests) {

                recentRequests.innerHTML = `
                    <div class="dashboard-empty-state">

                        <div class="dashboard-empty-icon">
                            ✦
                        </div>

                        <h4>
                            Unable to load requests
                        </h4>

                        <p>
                            Please refresh the dashboard
                            and try again.
                        </p>

                    </div>
                `;

            }

        }

    }


    /* =====================================================
       RENDER RECENT REQUESTS
    ====================================================== */

    function renderRecentRequests(requests) {

        if (!recentRequests) {
            return;
        }


        if (!requests.length) {

            recentRequests.innerHTML = `
                <div class="dashboard-empty-state">

                    <div class="dashboard-empty-icon">
                        ✦
                    </div>

                    <h4>
                        No requests yet
                    </h4>

                    <p>
                        Customer design requests
                        will appear here.
                    </p>

                    <a
                        href="requests.html"
                        class="dashboard-empty-link"
                    >
                        View Requests
                        <span>→</span>
                    </a>

                </div>
            `;

            return;

        }


        const recent =
            requests.slice(0, 5);


        recentRequests.innerHTML =
            recent.map(request => {

                const name =
                    request.name ||
                    request.customer_name ||
                    "Customer";


                const category =
                    request.category ||
                    "Custom Design";


                const status =
                    request.status ||
                    "pending";


                const date =
                    formatDate(
                        request.created_at
                    );


                return `
                    <a
                        href="requests.html"
                        class="dashboard-request-item"
                    >

                        <div class="dashboard-request-icon">
                            ✦
                        </div>


                        <div class="dashboard-request-info">

                            <strong>
                                ${escapeHTML(name)}
                            </strong>

                            <span>
                                ${escapeHTML(category)}
                            </span>

                        </div>


                        <div class="dashboard-request-meta">

                            <span
                                class="dashboard-request-status ${escapeHTML(
                                    String(status).toLowerCase()
                                )}"
                            >
                                ${escapeHTML(status)}
                            </span>

                            <small>
                                ${escapeHTML(date)}
                            </small>

                        </div>

                    </a>
                `;

            }).join("");

    }


    /* =====================================================
       ADMIN NAME
    ====================================================== */

    function setupAdminName() {

        const storedName =
            sessionStorage.getItem(
                "adminName"
            );


        if (
            storedName &&
            adminName
        ) {

            adminName.textContent =
                storedName;

        }


        if (
            storedName &&
            welcomeName
        ) {

            welcomeName.textContent =
                storedName + ".";

        }

    }


    /* =====================================================
       INITIALIZE
    ====================================================== */

    setupAdminName();

    loadProducts();

    loadRequests();


    console.log(
        "NOJA'S CREATIONS: Admin dashboard initialized successfully."
    );

});