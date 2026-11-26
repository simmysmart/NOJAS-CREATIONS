/* =========================================================
   NOJA'S CREATIONS
   CUSTOM DESIGN REQUESTS ADMIN
========================================================= */


/* =========================================================
   API
========================================================= */

const API = {

    read: "../server/custom-design/read.php",
    update: "../server/custom-design/update.php",
    delete: "../server/custom-design/delete.php"

};


/* =========================================================
   STATE
========================================================= */

let requests = [];


/* =========================================================
   DOM
========================================================= */

const tableBody =
    document.getElementById("requestsTableBody");

const requestSearch =
    document.getElementById("requestSearch");

const statusFilter =
    document.getElementById("requestStatusFilter");

const refreshButton =
    document.getElementById("refreshRequests");

const totalRequests =
    document.getElementById("totalRequests");

const pendingRequests =
    document.getElementById("pendingRequests");

const reviewedRequests =
    document.getElementById("reviewedRequests");

const completedRequests =
    document.getElementById("completedRequests");

const requestCountLabel =
    document.getElementById("requestCountLabel");

const requestModal =
    document.getElementById("requestModal");

const requestModalBody =
    document.getElementById("requestModalBody");

const requestModalTitle =
    document.getElementById("requestModalTitle");

const closeRequestModal =
    document.getElementById("closeRequestModal");

const adminMenuToggle =
    document.getElementById("adminMenuToggle");

const adminSidebar =
    document.getElementById("adminSidebar");


/* =========================================================
   LOAD REQUESTS
========================================================= */

async function loadRequests() {

    if (tableBody) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="requests-loading">
                    Loading custom design requests...
                </td>
            </tr>
        `;

    }


    try {

        const response =
            await fetch(API.read, {
                method: "GET",
                cache: "no-store"
            });


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}.`
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to load requests."
            );

        }


        requests =
            Array.isArray(data.requests)
                ? data.requests
                : [];


        updateSummary();

        renderRequests();


    } catch (error) {

        console.error(
            "Custom design requests error:",
            error
        );


        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="requests-loading">
                        Unable to load custom design requests.
                        <br>
                        <small>
                            ${escapeHTML(error.message)}
                        </small>
                    </td>
                </tr>
            `;

        }

    }

}


/* =========================================================
   SUMMARY
========================================================= */

function updateSummary() {

    const total =
        requests.length;


    const pending =
        requests.filter(
            request =>
                request.status === "pending"
        ).length;


    const reviewed =
        requests.filter(
            request =>
                request.status === "reviewed"
        ).length;


    const completed =
        requests.filter(
            request =>
                request.status === "completed"
        ).length;


    if (totalRequests) {

        totalRequests.textContent =
            total;

    }


    if (pendingRequests) {

        pendingRequests.textContent =
            pending;

    }


    if (reviewedRequests) {

        reviewedRequests.textContent =
            reviewed;

    }


    if (completedRequests) {

        completedRequests.textContent =
            completed;

    }

}


/* =========================================================
   FILTER
========================================================= */

function getFilteredRequests() {

    const search =
        (requestSearch?.value || "")
            .trim()
            .toLowerCase();


    const status =
        statusFilter?.value || "all";


    return requests.filter(request => {

        const matchesSearch =

            !search ||

            String(request.id)
                .toLowerCase()
                .includes(search) ||

            String(request.name || "")
                .toLowerCase()
                .includes(search) ||

            String(request.email || "")
                .toLowerCase()
                .includes(search);


        const matchesStatus =

            status === "all" ||

            request.status === status;


        return (
            matchesSearch &&
            matchesStatus
        );

    });

}


/* =========================================================
   RENDER
========================================================= */

function renderRequests() {

    if (!tableBody) {
        return;
    }


    const filtered =
        getFilteredRequests();


    if (requestCountLabel) {

        requestCountLabel.textContent =
            `${filtered.length} ${
                filtered.length === 1
                    ? "request"
                    : "requests"
            }`;

    }


    if (!filtered.length) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="requests-loading"
                >
                    No custom design requests found.
                </td>
            </tr>
        `;

        return;

    }


    tableBody.innerHTML =
        filtered.map(request => {

            const customerName =
                escapeHTML(
                    request.name || "Unknown"
                );


            const email =
                escapeHTML(
                    request.email || ""
                );


            const category =
                escapeHTML(
                    request.category || "—"
                );


            const budget =
                escapeHTML(
                    request.budget || "Not specified"
                );


            const product =
                escapeHTML(
                    request.product || "Custom Design"
                );


            const status =
                escapeHTML(
                    request.status || "pending"
                );


            const date =
                formatDate(
                    request.created_at
                );


            return `

                <tr>

                    <td>
                        #${escapeHTML(request.id)}
                    </td>


                    <td>

                        <div class="request-customer-name">
                            ${customerName}
                        </div>

                        <div class="request-customer-contact">
                            ${email}
                        </div>

                    </td>


                    <td>
                        ${product}
                    </td>


                    <td>
                        ${category}
                    </td>


                    <td>
                        ${budget}
                    </td>


                    <td>

                        <span
                            class="request-status ${status}"
                        >
                            ${status}
                        </span>

                    </td>


                    <td>
                        ${date}
                    </td>


                    <td>

                        <div class="request-table-actions">

                            <button
                                type="button"
                                class="view-request-button"
                                data-id="${escapeAttribute(request.id)}"
                            >
                                View
                            </button>


                            <button
                                type="button"
                                class="delete-request-button"
                                data-id="${escapeAttribute(request.id)}"
                            >
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>

            `;

        }).join("");


    /* =====================================================
       VIEW BUTTONS
    ===================================================== */

    document
        .querySelectorAll(".view-request-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openRequest(
                        Number(button.dataset.id)
                    );

                }
            );

        });


    /* =====================================================
       DELETE BUTTONS
    ===================================================== */

    document
        .querySelectorAll(".delete-request-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteRequest(
                        Number(button.dataset.id)
                    );

                }
            );

        });

}


/* =========================================================
   OPEN REQUEST
========================================================= */

function openRequest(id) {

    const request =
        requests.find(
            item =>
                Number(item.id) === Number(id)
        );


    if (!request) {
        return;
    }


    if (requestModalTitle) {

        requestModalTitle.textContent =
            `Request #${request.id}`;

    }


    /* =====================================================
       IMAGE PATH
       DO NOT CHANGE — CURRENTLY WORKING
    ===================================================== */

    const imagePath =
        String(request.image || "")
            .replace(/^\/+/, "")
            .replace(/^(\.\.\/)+/, "");


    const imageURL =
        imagePath
            ? `${window.location.origin}/NOJAS-CREATIONS/${imagePath}`
            : "";


    const imageHTML =
        imageURL
            ? `
                <div class="request-image-wrapper">

                    <img
                        src="${escapeAttribute(imageURL)}"
                        alt="Customer design reference"
                        class="request-design-image"
                        onerror="console.error('Unable to load design image:', this.src)"
                    >

                </div>
              `
            : "";


    /* =====================================================
       MODAL CONTENT
    ===================================================== */

    requestModalBody.innerHTML = `

        ${imageHTML}


        <div class="request-detail-grid">


            <div class="request-detail">

                <span class="request-detail-label">
                    CUSTOMER
                </span>

                <div class="request-detail-value">
                    ${escapeHTML(
                        request.name || "—"
                    )}
                </div>

            </div>


            <div class="request-detail">

                <span class="request-detail-label">
                    PRODUCT
                </span>

                <div class="request-detail-value">
                    ${escapeHTML(
                        request.product ||
                        "Custom Design"
                    )}
                </div>

            </div>


            <div class="request-detail">

                <span class="request-detail-label">
                    EMAIL
                </span>

                <div class="request-detail-value">
                    ${escapeHTML(
                        request.email || "—"
                    )}
                </div>

            </div>


            <div class="request-detail">

                <span class="request-detail-label">
                    PHONE
                </span>

                <div class="request-detail-value">
                    ${escapeHTML(
                        request.phone || "—"
                    )}
                </div>

            </div>


            <div class="request-detail">

                <span class="request-detail-label">
                    CATEGORY
                </span>

                <div class="request-detail-value">
                    ${escapeHTML(
                        request.category || "—"
                    )}
                </div>

            </div>


            <div class="request-detail">

                <span class="request-detail-label">
                    BUDGET
                </span>

                <div class="request-detail-value">
                    ${escapeHTML(
                        request.budget ||
                        "Not specified"
                    )}
                </div>

            </div>


            <div class="request-detail">

                <span class="request-detail-label">
                    COLOUR
                </span>

                <div class="request-detail-value">
                    ${escapeHTML(
                        request.colour || "—"
                    )}
                </div>

            </div>


            <div class="request-detail">

                <span class="request-detail-label">
                    OCCASION
                </span>

                <div class="request-detail-value">
                    ${escapeHTML(
                        request.occasion || "—"
                    )}
                </div>

            </div>


            <div class="request-detail">

                <span class="request-detail-label">
                    STATUS
                </span>

                <div class="request-detail-value">
                    ${escapeHTML(
                        request.status || "pending"
                    )}
                </div>

            </div>


            <div class="request-detail">

                <span class="request-detail-label">
                    SUBMITTED
                </span>

                <div class="request-detail-value">
                    ${formatDate(
                        request.created_at
                    )}
                </div>

            </div>


            <div class="request-detail full">

                <span class="request-detail-label">
                    DESIGN DESCRIPTION
                </span>

                <div class="request-detail-value">
                    ${escapeHTML(
                        request.description || "—"
                    )}
                </div>

            </div>


        </div>


        <!-- =================================================
             STATUS CONTROL
        ================================================== -->

        <div class="request-status-control">

            <label for="requestStatus">
                REQUEST STATUS
            </label>


            <select
                id="requestStatus"
                class="request-status-select"
            >

                <option
                    value="pending"
                    ${
                        request.status === "pending"
                            ? "selected"
                            : ""
                    }
                >
                    Pending
                </option>


                <option
                    value="reviewed"
                    ${
                        request.status === "reviewed"
                            ? "selected"
                            : ""
                    }
                >
                    Reviewed
                </option>


                <option
                    value="completed"
                    ${
                        request.status === "completed"
                            ? "selected"
                            : ""
                    }
                >
                    Completed
                </option>

            </select>

        </div>


        <!-- =================================================
             CUSTOMER ACTIONS
        ================================================== -->

        <div class="request-actions">

            <a
                href="mailto:${escapeAttribute(
                    request.email || ""
                )}"
                class="request-action-link"
            >
                Email Customer
            </a>


            <a
                href="tel:${escapeAttribute(
                    request.phone || ""
                )}"
                class="request-action-link secondary"
            >
                Call Customer
            </a>

        </div>

    `;


    /* =====================================================
       STATUS CHANGE EVENT
    ===================================================== */

    const requestStatus =
        document.getElementById(
            "requestStatus"
        );


    if (requestStatus) {

        requestStatus.addEventListener(
            "change",
            function () {

                updateRequestStatus(
                    request.id,
                    this.value
                );

            }
        );

    }


    /* =====================================================
       OPEN MODAL
    ===================================================== */

    if (requestModal) {

        requestModal.classList.add("active");

        requestModal.setAttribute(
            "aria-hidden",
            "false"
        );

    }

}


/* =========================================================
   UPDATE REQUEST STATUS
========================================================= */

async function updateRequestStatus(
    requestId,
    status
) {

    if (!requestId || !status) {
        return;
    }


    const request =
        requests.find(
            item =>
                Number(item.id) ===
                Number(requestId)
        );


    if (!request) {
        return;
    }


    const previousStatus =
        request.status;


    /* =====================================================
       DISABLE CONTROL WHILE SAVING
    ===================================================== */

    const requestStatus =
        document.getElementById(
            "requestStatus"
        );


    if (requestStatus) {

        requestStatus.disabled = true;

    }


    try {

        const response =
            await fetch(
                API.update,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        id: Number(requestId),
                        status: status
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}.`
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to update request status."
            );

        }


        /* =================================================
           UPDATE LOCAL DATA
        ================================================= */

        request.status =
            status;


        /* =================================================
           REFRESH SUMMARY + TABLE
        ================================================= */

        updateSummary();

        renderRequests();


        /* =================================================
           REOPEN UPDATED REQUEST
        ================================================= */

        openRequest(
            requestId
        );


    } catch (error) {

        console.error(
            "Update request status error:",
            error
        );


        /* =================================================
           RESTORE PREVIOUS STATUS
        ================================================= */

        request.status =
            previousStatus;


        updateSummary();

        renderRequests();


        alert(
            error.message ||
            "Unable to update request status."
        );


        /* =================================================
           REOPEN REQUEST WITH OLD STATUS
        ================================================= */

        openRequest(
            requestId
        );

    }

}


/* =========================================================
   DELETE REQUEST
========================================================= */

async function deleteRequest(requestId) {

    if (!requestId) {
        return;
    }


    const request =
        requests.find(
            item =>
                Number(item.id) ===
                Number(requestId)
        );


    if (!request) {
        return;
    }


    const customerName =
        request.name ||
        "this customer";


    const confirmed =
        window.confirm(
            `Are you sure you want to delete the custom design request from ${customerName}?\n\nThis action cannot be undone.`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                API.delete,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        id: Number(requestId)
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}.`
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to delete request."
            );

        }


        /* =================================================
           REMOVE FROM LOCAL ARRAY
        ================================================= */

        requests =
            requests.filter(
                item =>
                    Number(item.id) !==
                    Number(requestId)
            );


        /* =================================================
           UPDATE SUMMARY
        ================================================= */

        updateSummary();


        /* =================================================
           UPDATE TABLE
        ================================================= */

        renderRequests();


        /* =================================================
           CLOSE MODAL
        ================================================= */

        closeModal();


        /* =================================================
           SUCCESS MESSAGE
        ================================================= */

        alert(
            "Custom design request deleted successfully."
        );


    } catch (error) {

        console.error(
            "Delete request error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete request."
        );

    }

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

    if (!requestModal) {
        return;
    }


    requestModal.classList.remove(
        "active"
    );


    requestModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


if (closeRequestModal) {

    closeRequestModal.addEventListener(
        "click",
        closeModal
    );

}


document
    .querySelector(".request-modal-overlay")
    ?.addEventListener(
        "click",
        closeModal
    );


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   SEARCH
========================================================= */

requestSearch?.addEventListener(
    "input",
    renderRequests
);


/* =========================================================
   STATUS FILTER
========================================================= */

statusFilter?.addEventListener(
    "change",
    renderRequests
);


/* =========================================================
   REFRESH
========================================================= */

refreshButton?.addEventListener(
    "click",
    loadRequests
);


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

adminMenuToggle?.addEventListener(
    "click",
    () => {

        adminSidebar?.classList.toggle(
            "open"
        );

    }
);


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escapeAttribute(value) {

    return escapeHTML(value);

}


/* =========================================================
   DATE
========================================================= */

function formatDate(value) {

    if (!value) {
        return "—";
    }


    const date =
        new Date(
            String(value).replace(" ", "T")
        );


    if (Number.isNaN(date.getTime())) {

        return escapeHTML(value);

    }


    return date.toLocaleDateString(
        "en-NG",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    loadRequests
);