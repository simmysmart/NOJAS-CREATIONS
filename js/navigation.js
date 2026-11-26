/* =========================================================
   NOJA'S CREATIONS
   NAVIGATION JAVASCRIPT
   DESKTOP + TABLET + MOBILE
   DROPDOWN + MEGA MENU + MOBILE MENU
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    const desktopDropdowns = document.querySelectorAll(
        ".nav-menu .dropdown, .nav-menu .mega-dropdown"
    );

    const mobileDropdownToggles = document.querySelectorAll(
        ".mobile-dropdown-toggle"
    );

    const mobileLinks = document.querySelectorAll(
        ".mobile-menu a"
    );


    /* =====================================================
       MOBILE MENU
    ====================================================== */

    function openMobileMenu() {

        if (!menuToggle || !mobileMenu) {
            return;
        }

        mobileMenu.classList.add("active");

        menuToggle.classList.add("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "mobile-menu-open"
        );
    }


    function closeMobileMenu() {

        if (!menuToggle || !mobileMenu) {
            return;
        }

        mobileMenu.classList.remove("active");

        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "mobile-menu-open"
        );

        closeAllMobileDropdowns();
    }


    function toggleMobileMenu() {

        if (!mobileMenu) {
            return;
        }

        if (mobileMenu.classList.contains("active")) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }
    }


    /* =====================================================
       MOBILE MENU BUTTON
    ====================================================== */

    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                event.stopPropagation();

                toggleMobileMenu();

            }
        );

    }


    /* =====================================================
       MOBILE DROPDOWNS
    ====================================================== */

    function closeAllMobileDropdowns(
        exceptToggle = null
    ) {

        mobileDropdownToggles.forEach(
            (toggle) => {

                if (toggle === exceptToggle) {
                    return;
                }

                toggle.classList.remove(
                    "active"
                );

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                const content =
                    toggle.nextElementSibling;

                if (
                    content &&
                    content.classList.contains(
                        "mobile-dropdown-content"
                    )
                ) {

                    content.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    mobileDropdownToggles.forEach(
        (toggle) => {

            toggle.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();

                    const content =
                        toggle.nextElementSibling;

                    if (!content) {
                        return;
                    }

                    const isOpen =
                        toggle.classList.contains(
                            "active"
                        );


                    /* Close other dropdowns */

                    closeAllMobileDropdowns(
                        toggle
                    );


                    /* Toggle current dropdown */

                    if (isOpen) {

                        toggle.classList.remove(
                            "active"
                        );

                        toggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        content.classList.remove(
                            "active"
                        );

                    } else {

                        toggle.classList.add(
                            "active"
                        );

                        toggle.setAttribute(
                            "aria-expanded",
                            "true"
                        );

                        content.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       MOBILE LINKS
    ====================================================== */

    mobileLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                () => {

                    closeMobileMenu();

                }
            );

        }
    );


    /* =====================================================
       DESKTOP DROPDOWNS
    ====================================================== */

    desktopDropdowns.forEach(
        (dropdown) => {

            const trigger =
                dropdown.querySelector(
                    ":scope > .nav-link"
                );

            if (!trigger) {
                return;
            }


            /* -------------------------------------------------
               CLICK SUPPORT
            ------------------------------------------------- */

            trigger.addEventListener(
                "click",
                (event) => {

                    /*
                       On desktop we prevent the parent
                       page from opening immediately when
                       the item has a dropdown.
                    */

                    if (
                        window.innerWidth >= 993
                    ) {

                        event.preventDefault();

                        event.stopPropagation();


                        const isOpen =
                            dropdown.classList.contains(
                                "dropdown-open"
                            );


                        /* Close all other desktop dropdowns */

                        desktopDropdowns.forEach(
                            (item) => {

                                if (
                                    item !== dropdown
                                ) {

                                    item.classList.remove(
                                        "dropdown-open"
                                    );

                                }

                            }
                        );


                        /* Toggle current dropdown */

                        if (isOpen) {

                            dropdown.classList.remove(
                                "dropdown-open"
                            );

                        } else {

                            dropdown.classList.add(
                                "dropdown-open"
                            );

                        }

                    }

                }
            );

        }
    );


    /* =====================================================
       CLICK OUTSIDE DESKTOP DROPDOWN
    ====================================================== */

    document.addEventListener(
        "click",
        (event) => {

            if (
                window.innerWidth < 993
            ) {
                return;
            }


            const clickedInsideDropdown =
                event.target.closest(
                    ".nav-menu .dropdown, .nav-menu .mega-dropdown"
                );


            if (!clickedInsideDropdown) {

                desktopDropdowns.forEach(
                    (dropdown) => {

                        dropdown.classList.remove(
                            "dropdown-open"
                        );

                    }
                );

            }

        }
    );


    /* =====================================================
       ESC KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }


            /* Close desktop dropdowns */

            desktopDropdowns.forEach(
                (dropdown) => {

                    dropdown.classList.remove(
                        "dropdown-open"
                    );

                }
            );


            /* Close mobile menu */

            closeMobileMenu();

        }
    );


    /* =====================================================
       RESIZE HANDLING
    ====================================================== */

    let previousWidth =
        window.innerWidth;


    window.addEventListener(
        "resize",
        () => {

            const currentWidth =
                window.innerWidth;


            /*
               Desktop → Mobile
               Mobile → Desktop
            */

            if (
                previousWidth < 993 &&
                currentWidth >= 993
            ) {

                closeMobileMenu();

            }


            if (
                previousWidth >= 993 &&
                currentWidth < 993
            ) {

                desktopDropdowns.forEach(
                    (dropdown) => {

                        dropdown.classList.remove(
                            "dropdown-open"
                        );

                    }
                );

            }


            previousWidth =
                currentWidth;

        }
    );


    /* =====================================================
       INITIAL STATE
    ====================================================== */

    if (mobileMenu) {

        mobileMenu.classList.remove(
            "active"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
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


    mobileDropdownToggles.forEach(
        (toggle) => {

            toggle.classList.remove(
                "active"
            );

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );


            const content =
                toggle.nextElementSibling;


            if (
                content &&
                content.classList.contains(
                    "mobile-dropdown-content"
                )
            ) {

                content.classList.remove(
                    "active"
                );

            }

        }
    );


    desktopDropdowns.forEach(
        (dropdown) => {

            dropdown.classList.remove(
                "dropdown-open"
            );

        }
    );


    /* =====================================================
       DONE
    ====================================================== */

    console.log(
        "NOJA'S CREATIONS navigation loaded successfully."
    );

});