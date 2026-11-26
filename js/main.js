/* =========================================================
   NOJA'S CREATIONS
   MAIN JAVASCRIPT
   General website functionality
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PAGE LOADER
    ====================================================== */

    const pageLoader = document.getElementById("pageLoader");

    if (pageLoader) {

        window.addEventListener("load", function () {

            setTimeout(function () {

                pageLoader.classList.add("loaded");

                document.body.classList.remove(
                    "loading"
                );

            }, 500);

        });

    }


    /* =====================================================
       HEADER SCROLL EFFECT
    ====================================================== */

    const siteHeader =
        document.getElementById("siteHeader");


    function handleHeaderScroll() {

        if (!siteHeader) return;


        if (window.scrollY > 50) {

            siteHeader.classList.add(
                "scrolled"
            );

        } else {

            siteHeader.classList.remove(
                "scrolled"
            );

        }

    }


    window.addEventListener(
        "scroll",
        handleHeaderScroll,
        { passive: true }
    );


    handleHeaderScroll();


    /* =====================================================
       SMOOTH SCROLL
    ====================================================== */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                const headerHeight =
                    siteHeader
                        ? siteHeader.offsetHeight
                        : 0;


                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight;


                window.scrollTo({

                    top: targetPosition,

                    behavior: "smooth"

                });

            }
        );

    });


    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    const revealElements =
        document.querySelectorAll(
            ".reveal, .reveal-up, .fade-in"
        );


    if (
        revealElements.length &&
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            function (element) {

                revealObserver.observe(
                    element
                );

            }
        );

    }


    /* =====================================================
       CURRENT YEAR
    ====================================================== */

    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );


    yearElements.forEach(
        function (element) {

            element.textContent =
                new Date().getFullYear();

        }
    );


    /* =====================================================
       IMAGE ERROR HANDLING
    ====================================================== */

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach(function (image) {

        image.addEventListener(
            "error",
            function () {

                image.classList.add(
                    "image-error"
                );

            }
        );

    });


    /* =====================================================
       EXTERNAL LINKS
    ====================================================== */

    const externalLinks =
        document.querySelectorAll(
            'a[target="_blank"]'
        );


    externalLinks.forEach(
        function (link) {

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );

        }
    );


    /* =====================================================
       PREVENT DOUBLE CLICK SUBMISSION
       FOR FORMS
    ====================================================== */

    const forms =
        document.querySelectorAll(
            "form"
        );


    forms.forEach(function (form) {

        form.addEventListener(
            "submit",
            function () {

                const submitButton =
                    form.querySelector(
                        'button[type="submit"], input[type="submit"]'
                    );


                if (!submitButton) {
                    return;
                }


                /*
                   Do not disable buttons permanently.
                   This only protects against accidental
                   rapid double submission.
                */

                if (
                    submitButton.dataset.submitting ===
                    "true"
                ) {

                    return;

                }


                submitButton.dataset.submitting =
                    "true";


                setTimeout(
                    function () {

                        submitButton.dataset.submitting =
                            "false";

                    },
                    3000
                );

            }
        );

    });


    /* =====================================================
       CONSOLE MESSAGE
    ====================================================== */

    console.log(
        "NOJA'S CREATIONS — Website initialized successfully."
    );

});