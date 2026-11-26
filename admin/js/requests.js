/*
|--------------------------------------------------------------------------
| NOJA'S CREATIONS
| Admin Custom Design Requests
|--------------------------------------------------------------------------
*/

document.addEventListener("DOMContentLoaded", () => {

    const tableBody =
        document.getElementById("requestsTableBody");

    const searchInput =
        document.getElementById("requestSearch");

    const statusFilter =
        document.getElementById("requestStatusFilter");

    const modal =
        document.getElementById("requestModal");

    const modalBody =
        document.getElementById("requestModalBody");

    const modalClose =
        document.getElementById("requestModalClose");


    let requests = [];


    /*
    |--------------------------------------------------------------------------
    | LOAD REQUESTS
    |--------------------------------------------------------------------------
    */

    async function loadRequests() {

        try {

            const response = await fetch(
                "../server/custom-design/read.php"
            );


            const data = await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Unable to load requests."
                );

            }


            requests = Array.isArray(data.requests)
                ? data.requests
                : [];


            renderRequests();


        } catch (error) {

            console.error(
                "Request loading error:",
                error
            );


            tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        class="request-error"
                    >
                        Unable to load customer requests.
                        <br>
                        <small>${escapeHtml(error.message)}</small>
                    </td>
                </tr>
            `;

        }

    }


    /*
    |--------------------------------------------------------------------------
    | RENDER REQUESTS
    |--------------------------------------------------------------------------
    */

    function renderRequests() {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        const status =
            statusFilter.value;


        const filtered =
            requests.filter(request => {

                const matchesSearch =
                    !search ||

                    String(request.name || "")
                        .toLowerCase()
                        .includes(search) ||

                    String(request.email || "")
                        .toLowerCase()
                        .includes(search) ||

                    String(request.phone || "")
                        .toLowerCase()
                        .includes(search) ||

                    String(request.product || "")
                        .toLowerCase()
                        .includes(search);


                const matchesStatus =
                    status === "all" ||
                    request.status === status;


                return matchesSearch && matchesStatus;

            });


        if (!filtered.length) {

            tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        class="request-empty"
                    >
                        No custom design requests found.
                    </td>
                </tr>
            `;

            return;
        }


        tableBody.innerHTML =
            filtered.map(createRequestRow).join("");

    }


    /*
    |--------------------------------------------------------------------------
    | CREATE TABLE ROW
    |--------------------------------------------------------------------------
    */

    function createRequestRow(request) {

        const date =
            request.created_at
                ? new Date(request.created_at)
                    .toLocaleDateString(
                        "en-NG",
                        {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        }
                    )
                : "—";


        const status =
            request.status || "pending";


        return `
            <tr>

                <td>

                    <div class="request-customer">

                        <strong>
                            ${escapeHtml(request.name)}
                        </strong>

                        <small>
                            ${escapeHtml(request.email)}
                        </small>

                    </div>

                </td>


                <td>
                    ${escapeHtml(request.product || "Custom Design")}
                </td>


                <td>
                    ${formatLabel(request.category)}
                </td>


                <td>
                    ${escapeHtml(request.budget || "—")}
                </td>


                <td>
                    ${formatLabel(request.occasion || "—")}
                </td>


                <td>

                    <span
                        class="request-status ${status}"
                    >
                        ${formatLabel(status)}
                    </span>

                </td>


                <td>
                    ${date}
                </td>


                <td>

                    <div class="request-actions">

                        <button
                            type="button"
                            class="request-btn view"
                            data-action="view"
                            data-id="${request.id}"
                        >
                            View
                        </button>


                        <button
                            type="button"
                            class="request-btn delete"
                            data-action="delete"
                            data-id="${request.id}"
                        >
                            Delete
                        </button>

                    </div>

                </td>

            </tr>
        `;

    }


    /*
    |--------------------------------------------------------------------------
    | VIEW REQUEST
    |--------------------------------------------------------------------------
    */

    function viewRequest(id) {

        const request =
            requests.find(
                item => String(item.id) === String(id)
            );


        if (!request) {
            return;
        }


        const imageHtml =
            request.image
                ? `
                    <div class="request-detail full">

                        <span class="request-detail-label">
                            Inspiration Image
                        </span>

                        <img
                            src="../${escapeAttribute(request.image)}"
                            alt="Customer inspiration"
                            class="request-image"
                        >

                    </div>
                `
                : "";


        modalBody.innerHTML = `

            <div class="request-modal-header">

                <span class="section-label">
                    DESIGN REQUEST #${escapeHtml(request.id)}
                </span>

                <h2>
                    ${escapeHtml(request.name)}
                </h2>

                <p>
                    ${escapeHtml(request.email)}
                </p>

            </div>


            <div class="request-detail-grid">


                <div class="request-detail">

                    <span class="request-detail-label">
                        Phone
                    </span>

                    <div class="request-detail-value">
                        ${escapeHtml(request.phone || "—")}
                    </div>

                </div>


                <div class="request-detail">

                    <span class="request-detail-label">
                        Design Reference
                    </span>

                    <div class="request-detail-value">
                        ${escapeHtml(request.product || "Custom Design")}
                    </div>

                </div>


                <div class="request-detail">

                    <span class="request-detail-label">
                        Category
                    </span>

                    <div class="request-detail-value">
                        ${formatLabel(request.category)}
                    </div>

                </div>


                <div class="request-detail">

                    <span class="request-detail-label">
                        Budget
                    </span>

                    <div class="request-detail-value">
                        ${escapeHtml(request.budget || "—")}
                    </div>

                </div>


                <div class="request-detail">

                    <span class="request-detail-label">
                        Preferred Colour
                    </span>

                    <div class="request-detail-value">
                        ${escapeHtml(request.colour || "—")}
                    </div>

                </div>


                <div class="request-detail">

                    <span class="request-detail-label">
                        Occasion
                    </span>

                    <div class="request-detail-value">
                        ${formatLabel(request.occasion || "—")}
                    </div>

                </div>


                <div class="request-detail full">

                    <span class="request-detail-label">
                        Design Description
                    </span>

                    <div class="request-detail-value">
                        ${escapeHtml(request.description || "—")}
                    </div>

                </div>


                ${imageHtml}


            </div>


            <div class="request-status-control">

                <label for="modalRequestStatus">
                    Request Status
                </label>

                <select id="modalRequestStatus">

                    <option
                        value="pending"
                        ${request.status === "pending" ? "selected" : ""}
                    >
                        Pending
                    </option>

                    <option
                        value="reviewed"
                        ${request.status === "reviewed" ? "selected" : ""}
                    >
                        Reviewed
                    </option>

                    <option
                        value="completed"
                        ${request.status === "completed" ? "selected" : ""}
                    >
                        Completed
                    </option>

                    <option
                        value="cancelled"
                        ${request.status === "cancelled" ? "selected" : ""}
                    >
                        Cancelled
                    </option>

                </select>

            </div>

        `;


        const statusSelect =
            document.getElementById(
                "modalRequestStatus"
            );


        statusSelect.addEventListener(
            "change",
            async () => {

                await updateStatus(
                    request.id,
                    statusSelect.value
                );

            }
        );


        modal.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE STATUS
    |--------------------------------------------------------------------------
    */

    async function updateStatus(id, status) {

        try {

            const formData = new FormData();

            formData.append("id", id);

            formData.append("status", status);


            const response = await fetch(
                "../server/custom-design/update.php",
                {
                    method: "POST",
                    body: formData
                }
            );


            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Unable to update request."
                );

            }


            const request =
                requests.find(
                    item => String(item.id) === String(id)
                );


            if (request) {

                request.status = status;

            }


            renderRequests();


            alert(
                "Request status updated successfully."
            );


            viewRequest(id);


        } catch (error) {

            console.error(
                "Status update error:",
                error
            );


            alert(
                error.message ||
                "Unable to update request."
            );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | DELETE REQUEST
    |--------------------------------------------------------------------------
    */

    async function deleteRequest(id) {

        const request =
            requests.find(
                item => String(item.id) === String(id)
            );


        if (!request) {
            return;
        }


        const confirmed =
            confirm(
                `Delete the request from ${request.name}?`
            );


        if (!confirmed) {
            return;
        }


        try {

            const formData =
                new FormData();

            formData.append("id", id);


            const response =
                await fetch(
                    "../server/custom-design/delete.php",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Unable to delete request."
                );

            }


            requests =
                requests.filter(
                    item =>
                        String(item.id) !== String(id)
                );


            renderRequests();


            closeModal();


            alert(
                "Request deleted successfully."
            );


        } catch (error) {

            console.error(
                "Delete error:",
                error
            );


            alert(
                error.message ||
                "Unable to delete request."
            );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | BUTTON ACTIONS
    |--------------------------------------------------------------------------
    */

    tableBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-action]"
                );


            if (!button) {
                return;
            }


            const action =
                button.dataset.action;


            const id =
                button.dataset.id;


            if (action === "view") {

                viewRequest(id);

            }


            if (action === "delete") {

                deleteRequest(id);

            }

        }
    );


    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    searchInput.addEventListener(
        "input",
        renderRequests
    );


    statusFilter.addEventListener(
        "change",
        renderRequests
    );


    /*
    |--------------------------------------------------------------------------
    | CLOSE MODAL
    |--------------------------------------------------------------------------
    */

    function closeModal() {

        modal.classList.remove("active");

        document.body.style.overflow = "";

    }


    modalClose.addEventListener(
        "click",
        closeModal
    );


    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {

                closeModal();

            }

        }
    );


    /*
    |--------------------------------------------------------------------------
    | ESCAPE KEY
    |--------------------------------------------------------------------------
    */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeModal();

            }

        }
    );


    /*
    |--------------------------------------------------------------------------
    | FORMAT LABEL
    |--------------------------------------------------------------------------
    */

    function formatLabel(value) {

        if (!value) {
            return "—";
        }


        return String(value)
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, char => char.toUpperCase());

    }


    /*
    |--------------------------------------------------------------------------
    | ESCAPE HTML
    |--------------------------------------------------------------------------
    */

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /*
    |--------------------------------------------------------------------------
    | ESCAPE ATTRIBUTE
    |--------------------------------------------------------------------------
    */

    function escapeAttribute(value) {

        return escapeHtml(value);

    }


    /*
    |--------------------------------------------------------------------------
    | START
    |--------------------------------------------------------------------------
    */

    loadRequests();

});