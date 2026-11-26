/* =========================================================
   NOJA'S CREATIONS
   ADMIN LOGIN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const loginForm =
        document.getElementById("adminLoginForm");

    const emailInput =
        document.getElementById("adminEmail");

    const passwordInput =
        document.getElementById("adminPassword");

    const togglePassword =
        document.getElementById("togglePassword");

    const loginButton =
        document.getElementById("loginButton");

    const loginMessage =
        document.getElementById("loginMessage");

    const loginYear =
        document.getElementById("loginYear");


    /* =====================================================
       API
    ====================================================== */

    const LOGIN_API =
        "../server/auth/login.php";


    /* =====================================================
       YEAR
    ====================================================== */

    if (loginYear) {

        loginYear.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       TOGGLE PASSWORD
    ====================================================== */

    if (
        togglePassword &&
        passwordInput
    ) {

        togglePassword.addEventListener(
            "click",
            () => {

                const isPassword =
                    passwordInput.type === "password";

                passwordInput.type =
                    isPassword
                        ? "text"
                        : "password";

                togglePassword.textContent =
                    isPassword
                        ? "Hide"
                        : "Show";

                togglePassword.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Hide password"
                        : "Show password"
                );

            }
        );

    }


    /* =====================================================
       LOGIN
    ====================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                clearMessage();


                const email =
                    emailInput.value.trim();

                const password =
                    passwordInput.value;


                /* -----------------------------------------
                   VALIDATION
                ----------------------------------------- */

                if (!email) {

                    showMessage(
                        "Please enter your email address."
                    );

                    emailInput.focus();

                    return;

                }


                if (!password) {

                    showMessage(
                        "Please enter your password."
                    );

                    passwordInput.focus();

                    return;

                }


                /* -----------------------------------------
                   LOADING
                ----------------------------------------- */

                loginButton.disabled = true;

                loginButton.classList.add(
                    "loading"
                );


                try {

                    const response =
                        await fetch(
                            LOGIN_API,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                credentials: "include",

                                cache: "no-store",

                                body: JSON.stringify({
                                    email,
                                    password
                                })
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
                            "Unable to login."
                        );

                    }


                    /* -------------------------------------
                       SUCCESS
                    ------------------------------------- */

                    showMessage(
                        "Login successful. Redirecting...",
                        true
                    );


                    /*
                     * IMPORTANT:
                     *
                     * Do NOT use data.redirect here.
                     *
                     * The PHP response may contain an
                     * incorrect /admin/index.html path.
                     *
                     * We explicitly construct the correct
                     * project URL from the current page.
                     */

                    setTimeout(
                        () => {

                            const adminDashboard =
                                new URL(
                                    "index.html",
                                    window.location.href
                                );

                            window.location.replace(
                                adminDashboard.href
                            );

                        },
                        500
                    );


                } catch (error) {

                    console.error(
                        "Admin login error:",
                        error
                    );


                    showMessage(
                        error.message ||
                        "Unable to connect to the server."
                    );


                } finally {

                    loginButton.disabled = false;

                    loginButton.classList.remove(
                        "loading"
                    );

                }

            }
        );

    }


    /* =====================================================
       MESSAGE HELPERS
    ====================================================== */

    function showMessage(
        message,
        success = false
    ) {

        if (!loginMessage) {
            return;
        }

        loginMessage.textContent =
            message;

        loginMessage.classList.toggle(
            "success",
            success
        );

    }


    function clearMessage() {

        if (!loginMessage) {
            return;
        }

        loginMessage.textContent = "";

        loginMessage.classList.remove(
            "success"
        );

    }

});