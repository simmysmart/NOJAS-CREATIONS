/* =========================================================
   NOJA'S CREATIONS
   ADMIN AUTHENTICATION GUARD
========================================================= */

(function () {

    /* =====================================================
       CURRENT PAGE
    ====================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    /* =====================================================
       LOGIN PAGE DOES NOT NEED AUTH CHECK
    ====================================================== */

    if (currentPage === "login.html") {

        return;

    }


    /* =====================================================
       AUTHENTICATION API
    ====================================================== */

    const AUTH_CHECK =
        "../server/auth/check.php";


    /* =====================================================
       CHECK ADMIN SESSION
    ====================================================== */

    fetch(
        AUTH_CHECK,
        {
            method: "GET",
            credentials: "include",
            cache: "no-store"
        }
    )

        .then(async response => {

            let data = {};


            /* =================================================
               READ JSON RESPONSE
            ================================================== */

            try {

                data =
                    await response.json();

            } catch (error) {

                console.error(
                    "Invalid authentication response.",
                    error
                );

            }


            /* =================================================
               NOT AUTHENTICATED
            ================================================== */

            if (
                !response.ok ||
                !data.authenticated
            ) {

                redirectToLogin();

            }

        })

        .catch(error => {

            console.error(
                "Authentication check failed:",
                error
            );


            redirectToLogin();

        });


    /* =====================================================
       REDIRECT TO LOGIN
    ====================================================== */

    function redirectToLogin() {

        if (
            window.location.pathname
                .toLowerCase()
                .endsWith("/login.html")
        ) {

            return;

        }


        window.location.replace(
            "login.html"
        );

    }

})();