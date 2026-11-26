/* =========================================================
   NOJA'S CREATIONS
   ADMINISTRATION
   MAIN ADMIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const menuToggle =
        document.getElementById("adminMenuToggle");

    const sidebar =
        document.getElementById("adminSidebar");

    const logoutButton =
        document.getElementById("logoutButton");


    /* =====================================================
       MOBILE SIDEBAR
    ====================================================== */

    if (menuToggle && sidebar) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                sidebar.classList.toggle("open");

            menuToggle.classList.toggle(
                "active",
                isOpen
            );

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

            document.body.classList.toggle(
                "admin-menu-open",
                isOpen
            );

        });

    }


    /* =====================================================
       CLOSE SIDEBAR WHEN NAVIGATION LINK IS CLICKED
    ====================================================== */

    if (sidebar) {

        const navigationLinks =
            sidebar.querySelectorAll(
                ".admin-nav-link"
            );

        navigationLinks.forEach(link => {

            link.addEventListener("click", () => {

                if (window.innerWidth <= 992) {

                    closeAdminSidebar();

                }

            });

        });

    }


    /* =====================================================
       CLOSE SIDEBAR WHEN OUTSIDE IS CLICKED
    ====================================================== */

    document.addEventListener(
        "click",
        event => {

            if (
                window.innerWidth > 992 ||
                !sidebar ||
                !sidebar.classList.contains("open")
            ) {
                return;
            }


            const clickedInsideSidebar =
                sidebar.contains(event.target);

            const clickedMenu =
                menuToggle &&
                menuToggle.contains(event.target);


            if (
                !clickedInsideSidebar &&
                !clickedMenu
            ) {

                closeAdminSidebar();

            }

        }
    );


    /* =====================================================
       WINDOW RESIZE
    ====================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 992) {

                closeAdminSidebar();

            }

        }
    );


    /* =====================================================
       LOGOUT
    ====================================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async () => {

                const confirmed =
                    window.confirm(
                        "Are you sure you want to logout?"
                    );

                if (!confirmed) {
                    return;
                }


                try {

                    const response =
                        await fetch(
                            "../server/auth/logout.php",
                            {
                                method: "POST",
                                credentials: "include",
                                cache: "no-store"
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok || !data.success) {

                        throw new Error(
                            data.message ||
                            "Unable to logout."
                        );

                    }


                    window.location.replace(
                        "login.html"
                    );


                } catch (error) {

                    console.error(
                        "Logout error:",
                        error
                    );


                    alert(
                        "Unable to logout.\n\n" +
                        error.message
                    );

                }

            }
        );

    }


    /* =====================================================
       CURRENT YEAR
    ====================================================== */

    const yearElement =
        document.getElementById("adminYear");


    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       ADMIN DATE
    ====================================================== */

    const dateElement =
        document.getElementById("adminDate");


    if (dateElement) {

        const today =
            new Date();


        const formattedDate =
            today.toLocaleDateString(
                "en-NG",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        dateElement.textContent =
            formattedDate;

    }


    /* =====================================================
       EXTERNAL VIEW-SITE LINKS
    ====================================================== */

    const externalLinks =
        document.querySelectorAll(
            'a[target="_blank"]'
        );


    externalLinks.forEach(link => {

        link.setAttribute(
            "rel",
            "noopener noreferrer"
        );

    });

});


/* =========================================================
   CLOSE ADMIN SIDEBAR
========================================================= */

function closeAdminSidebar() {

    const sidebar =
        document.getElementById(
            "adminSidebar"
        );


    const menuToggle =
        document.getElementById(
            "adminMenuToggle"
        );


    if (sidebar) {

        sidebar.classList.remove(
            "open"
        );

    }


    if (menuToggle) {

        menuToggle.classList.remove(
            "active"
        );

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    document.body.classList.remove(
        "admin-menu-open"
    );

}