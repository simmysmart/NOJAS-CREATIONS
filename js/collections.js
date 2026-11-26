/* =========================================================
   NOJA'S CREATIONS
   COLLECTIONS
   Dynamic Collection Loading
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadCollections();
});


/* =========================================================
   API
========================================================= */

const COLLECTIONS_API =
    "/NOJAS-CREATIONS/server/products/read.php";


/* =========================================================
   COLLECTION CONFIGURATION
========================================================= */

const collectionConfig = {
    signature: {
        container: "signatureCollection"
    },

    traditional: {
        container: "traditionalCollection"
    },

    ankara: {
        container: "ankaraCollection"
    },

    evening: {
        container: "eveningCollection"
    },

    bridal: {
        container: "bridalCollection"
    },

    agbada: {
        container: "agbadaCollection"
    }
};


/* =========================================================
   LOAD COLLECTIONS
========================================================= */

async function loadCollections() {

    try {

        console.log(
            "Loading collections from:",
            COLLECTIONS_API
        );

        const response = await fetch(COLLECTIONS_API);

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const data = await response.json();

        console.log(
            "Collections API response:",
            data
        );

        if (!data.success) {
            throw new Error(
                data.message ||
                "Unable to load products."
            );
        }


        /* =================================================
           ONLY PUBLISHED PRODUCTS
        ================================================= */

        const products = (data.products || [])
            .filter(product =>
                String(product.status).toLowerCase() ===
                "published"
            )
            .map(formatProduct);


        console.log(
            "Published products:",
            products
        );


        /* =================================================
           LOAD MAIN COLLECTIONS
        ================================================= */

        Object.entries(collectionConfig).forEach(
            ([collectionKey, config]) => {

                const collectionProducts =
                    products.filter(product => {

                        return (
                            String(product.collection)
                                .toLowerCase() ===
                            collectionKey
                        );

                    });


                renderCollection(
                    config.container,
                    collectionProducts
                );

            }
        );


        /* =================================================
           LOAD LATEST DESIGNS
           Newest published products first
        ================================================= */

        const latestProducts = [...products]
            .sort((a, b) => {

                return (
                    new Date(b.created_at) -
                    new Date(a.created_at)
                );

            })
            .slice(0, 6);


        renderCollection(
            "latestCollection",
            latestProducts
        );


        console.log(
            "Collections loaded successfully."
        );

    } catch (error) {

        console.error(
            "Collections loading error:",
            error
        );

        showCollectionError(
            error.message
        );
    }
}


/* =========================================================
   FORMAT PRODUCT
========================================================= */

function formatProduct(product) {

    return {

        id: product.id,

        name:
            product.product_name ||
            "Untitled Design",

        description:
            product.description ||
            "",

        category:
            product.category ||
            "",

        collection:
            product.collection ||
            "",

        price:
            Number(product.price) || 0,

        image:
            getImagePath(product.image),

        featured:
            Number(product.featured) === 1,

        status:
            product.status,

        created_at:
            product.created_at,

        updated_at:
            product.updated_at
    };
}


/* =========================================================
   IMAGE PATH
========================================================= */

function getImagePath(image) {

    if (!image) {

        return "/NOJAS-CREATIONS/assets/images/logo.jpg";

    }


    if (
        image.startsWith("http://") ||
        image.startsWith("https://") ||
        image.startsWith("/")
    ) {

        return image;

    }


    return "/NOJAS-CREATIONS/" + image;
}


/* =========================================================
   RENDER COLLECTION
========================================================= */

function renderCollection(
    containerId,
    products
) {

    const container =
        document.getElementById(containerId);


    if (!container) {

        console.warn(
            `Collection container not found: ${containerId}`
        );

        return;
    }


    /* ================================================
       NO PRODUCTS
    ================================================ */

    if (!products.length) {

        container.innerHTML = `
            <div class="collection-empty">
                <p>No designs available yet.</p>
            </div>
        `;

        return;
    }


    /* ================================================
       PRODUCTS
    ================================================ */

    container.innerHTML =
        products
            .map(createProductCard)
            .join("");
}


/* =========================================================
   CREATE PRODUCT CARD
========================================================= */

function createProductCard(product) {

    return `
        <article
            class="product-card collection-product-card"
            data-product-id="${product.id}"
        >

            <div class="product-card-image">

                <img
                    src="${product.image}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                >

            </div>


            <div class="product-card-content">

                <h3>
                    ${escapeHTML(product.name)}
                </h3>


                ${
                    product.description
                        ? `
                            <p>
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
                            <span class="product-price">
                                ₦${formatPrice(
                                    product.price
                                )}
                            </span>
                        `
                        : ""
                }


                <a
                    href="product-details.html?id=${product.id}"
                    class="product-card-link"
                >
                    View Design
                </a>

            </div>

        </article>
    `;
}


/* =========================================================
   PRICE FORMAT
========================================================= */

function formatPrice(price) {

    return Number(price).toLocaleString(
        "en-NG",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   ERROR MESSAGE
========================================================= */

function showCollectionError(message) {

    Object.values(collectionConfig).forEach(
        config => {

            const container =
                document.getElementById(
                    config.container
                );

            if (!container) return;

            container.innerHTML = `
                <div class="collection-empty">
                    <p>
                        Unable to load designs.
                    </p>
                </div>
            `;
        }
    );


    const latest =
        document.getElementById(
            "latestCollection"
        );

    if (latest) {

        latest.innerHTML = `
            <div class="collection-empty">
                <p>
                    Unable to load latest designs.
                </p>
            </div>
        `;
    }


    console.error(
        "Collection error:",
        message
    );
}