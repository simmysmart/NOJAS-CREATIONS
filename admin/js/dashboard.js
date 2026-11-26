```javascript
/* =========================================================
   NOJA'S CREATIONS
   ADMIN DASHBOARD
   dashboard.js
   ========================================================= */


/* =========================================================
   DASHBOARD INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeSidebar();

    initializeLogout();

    initializeNotifications();

    loadDashboardData();

});


/* =========================================================
   SIDEBAR
========================================================= */

function initializeSidebar() {

    const sidebar =
        document.getElementById("adminSidebar");

    const toggle =
        document.getElementById("sidebarToggle");

    const overlay =
        document.getElementById("sidebarOverlay");


    if (!sidebar || !toggle) {
        return;
    }


    toggle.addEventListener("click", () => {

        const isOpen =
            sidebar.classList.toggle("open");

        toggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );


        if (overlay) {

            overlay.classList.toggle(
                "active",
                isOpen
            );

        }

    });


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    /* CLOSE WHEN NAVIGATION LINK IS CLICKED */

    const navLinks =
        document.querySelectorAll(
            ".admin-nav-link"
        );


    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (
                    window.innerWidth <= 900
                ) {

                    closeSidebar();

                }

            }
        );

    });


    /* CLOSE AFTER RESIZING TO DESKTOP */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900
            ) {

                closeSidebar();

            }

        }
    );


    function closeSidebar() {

        sidebar.classList.remove(
            "open"
        );

        toggle.setAttribute(
            "aria-expanded",
            "false"
        );


        if (overlay) {

            overlay.classList.remove(
                "active"
            );

        }

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function initializeLogout() {

    const logoutButton =
        document.getElementById(
            "sidebarLogout"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to sign out?"
                );


            if (!confirmed) {
                return;
            }


            /*
             * Clear temporary admin session.
             *
             * When your real PHP authentication
             * endpoint is connected, this section
             * will be replaced with the server logout.
             */

            sessionStorage.removeItem(
                "nojas_admin"
            );

            localStorage.removeItem(
                "nojas_admin_session"
            );


            window.location.href =
                "login.html";

        }
    );

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function initializeNotifications() {

    const button =
        document.getElementById(
            "notificationButton"
        );

    const count =
        document.getElementById(
            "notificationCount"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const notificationCount =
                count
                    ? Number(count.textContent)
                    : 0;


            if (notificationCount === 0) {

                alert(
                    "You have no new notifications."
                );

                return;

            }


            alert(
                `You have ${notificationCount} notification${
                    notificationCount === 1
                        ? ""
                        : "s"
                }.`
            );

        }
    );

}


/* =========================================================
   LOAD DASHBOARD DATA
========================================================= */

function loadDashboardData() {

    /*
     * Temporary values.
     *
     * These will later come from PHP/MySQL.
     */

    const dashboardData = {

        products: 0,

        collections: 0,

        gallery: 0,

        requests: 0,

        messages: 0

    };


    updateStatistics(
        dashboardData
    );

}


/* =========================================================
   UPDATE STATISTICS
========================================================= */

function updateStatistics(data) {

    setNumber(
        "totalProducts",
        data.products
    );


    setNumber(
        "totalCollections",
        data.collections
    );


    setNumber(
        "totalGallery",
        data.gallery
    );


    setNumber(
        "totalRequests",
        data.requests
    );


    setNumber(
        "requestBadge",
        data.requests
    );


    setNumber(
        "messageBadge",
        data.messages
    );


    setNumber(
        "notificationCount",
        data.requests + data.messages
    );

}


/* =========================================================
   SAFE NUMBER UPDATE
========================================================= */

function setNumber(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    element.textContent =
        Number(value) || 0;

}


/* =========================================================
   ADMIN NAME
========================================================= */

function setAdminName(name) {

    const adminName =
        document.getElementById(
            "adminName"
        );


    const welcomeName =
        document.getElementById(
            "welcomeName"
        );


    if (adminName) {

        adminName.textContent =
            name;

    }


    if (welcomeName) {

        welcomeName.textContent =
            `${name}.`;

    }

}


/* =========================================================
   DEFAULT ADMIN NAME
========================================================= */

setAdminName(
    "Administrator"
);
```
