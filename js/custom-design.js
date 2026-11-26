/*
|--------------------------------------------------------------------------
| NOJA'S CREATIONS
| CUSTOM DESIGN REQUEST
|--------------------------------------------------------------------------
| Handles:
| - Form validation
| - Image validation
| - Image preview
| - Form submission
| - PHP API response handling
| - Success / error messages
|--------------------------------------------------------------------------
*/


document.addEventListener("DOMContentLoaded", () => {


    /* =========================================================
       FORM ELEMENTS
    ========================================================= */

    const form =
        document.getElementById("customDesignForm");

    const message =
        document.getElementById("formMessage");

    const submitButton =
        document.getElementById("customSubmitButton");


    /* =========================================================
       STOP IF FORM DOES NOT EXIST
    ========================================================= */

    if (!form) {

        console.error(
            "NOJA'S CREATIONS: Custom design form not found."
        );

        return;
    }


    /* =========================================================
       INPUT ELEMENTS
    ========================================================= */

    const nameInput =
        document.getElementById("name");

    const emailInput =
        document.getElementById("email");

    const phoneInput =
        document.getElementById("phone");

    const categoryInput =
        document.getElementById("category");

    const occasionInput =
        document.getElementById("occasion");

    const descriptionInput =
        document.getElementById("description");

    const budgetInput =
        document.getElementById("budget");

    const preferredDateInput =
        document.getElementById("preferred_date");

    const imageInput =
        document.getElementById("design_image");

    const fileName =
        document.getElementById("fileName");

    const imagePreview =
        document.getElementById("imagePreview");

    const previewImage =
        document.getElementById("previewImage");


    /* =========================================================
       API ENDPOINT
    ========================================================= */

    const API_URL =
        "../server/custom-design/create.php";


    /* =========================================================
       SHOW MESSAGE
    ========================================================= */

    function showMessage(text = "", type = "") {

        if (!message) {
            return;
        }

        message.textContent = text;

        message.className = "form-message";

        if (type) {
            message.classList.add(type);
        }
    }


    /* =========================================================
       IMAGE PREVIEW
    ========================================================= */

    if (imageInput) {

        imageInput.addEventListener(
            "change",
            () => {

                const file =
                    imageInput.files &&
                    imageInput.files[0];


                /* -------------------------------------------------
                   NO FILE
                ------------------------------------------------- */

                if (!file) {

                    if (fileName) {
                        fileName.textContent = "";
                    }

                    if (imagePreview) {
                        imagePreview.style.display = "none";
                    }

                    if (previewImage) {
                        previewImage.src = "";
                    }

                    return;
                }


                /* -------------------------------------------------
                   MAXIMUM FILE SIZE
                ------------------------------------------------- */

                const maxSize =
                    5 * 1024 * 1024;


                if (file.size > maxSize) {

                    showMessage(
                        "The inspiration image must be smaller than 5MB.",
                        "error"
                    );

                    imageInput.value = "";

                    if (fileName) {
                        fileName.textContent = "";
                    }

                    if (imagePreview) {
                        imagePreview.style.display = "none";
                    }

                    return;
                }


                /* -------------------------------------------------
                   ALLOWED IMAGE TYPES
                ------------------------------------------------- */

                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ];


                if (
                    !allowedTypes.includes(file.type)
                ) {

                    showMessage(
                        "Only JPG, PNG and WEBP images are allowed.",
                        "error"
                    );

                    imageInput.value = "";

                    if (fileName) {
                        fileName.textContent = "";
                    }

                    if (imagePreview) {
                        imagePreview.style.display = "none";
                    }

                    return;
                }


                /* -------------------------------------------------
                   DISPLAY FILE NAME
                ------------------------------------------------- */

                if (fileName) {

                    fileName.textContent =
                        file.name;

                }


                /* -------------------------------------------------
                   CREATE IMAGE PREVIEW
                ------------------------------------------------- */

                if (
                    imagePreview &&
                    previewImage
                ) {

                    const imageURL =
                        URL.createObjectURL(file);

                    previewImage.src =
                        imageURL;

                    imagePreview.style.display =
                        "block";


                    previewImage.onload =
                        () => {

                            URL.revokeObjectURL(
                                imageURL
                            );

                        };


                    previewImage.onerror =
                        () => {

                            URL.revokeObjectURL(
                                imageURL
                            );

                            imagePreview.style.display =
                                "none";

                        };

                }


                /* -------------------------------------------------
                   CLEAR OLD ERROR MESSAGE
                ------------------------------------------------- */

                showMessage("");

            }
        );

    }


    /* =========================================================
       FORM SUBMISSION
    ========================================================= */

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* =================================================
               BROWSER VALIDATION
            ================================================= */

            if (!form.checkValidity()) {

                form.reportValidity();

                return;
            }


            /* =================================================
               MANUAL VALIDATION
            ================================================= */

            if (
                !nameInput ||
                !nameInput.value.trim()
            ) {

                showMessage(
                    "Please enter your full name.",
                    "error"
                );

                if (nameInput) {
                    nameInput.focus();
                }

                return;
            }


            if (
                !emailInput ||
                !emailInput.value.trim()
            ) {

                showMessage(
                    "Please enter your email address.",
                    "error"
                );

                if (emailInput) {
                    emailInput.focus();
                }

                return;
            }


            if (
                !phoneInput ||
                !phoneInput.value.trim()
            ) {

                showMessage(
                    "Please enter your phone number.",
                    "error"
                );

                if (phoneInput) {
                    phoneInput.focus();
                }

                return;
            }


            if (
                !categoryInput ||
                !categoryInput.value
            ) {

                showMessage(
                    "Please select a design category.",
                    "error"
                );

                if (categoryInput) {
                    categoryInput.focus();
                }

                return;
            }


            if (
                !descriptionInput ||
                !descriptionInput.value.trim()
            ) {

                showMessage(
                    "Please describe the design you want.",
                    "error"
                );

                if (descriptionInput) {
                    descriptionInput.focus();
                }

                return;
            }


            /* =================================================
               CLEAR OLD MESSAGE
            ================================================= */

            showMessage("");


            /* =================================================
               DISABLE SUBMIT BUTTON
            ================================================= */

            const originalButtonHTML =
                submitButton
                    ? submitButton.innerHTML
                    : "";


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.innerHTML = `
                    <span>
                        Submitting Request...
                    </span>

                    <strong aria-hidden="true">
                        ↗
                    </strong>
                `;
            }


            /* =================================================
               CREATE FORM DATA
            ================================================= */

            const formData =
                new FormData(form);


            /* =================================================
               DEBUG
            ================================================= */

            console.log(
                "NOJA'S CREATIONS: Submitting custom design request..."
            );


            for (const [key, value] of formData.entries()) {

                if (value instanceof File) {

                    console.log(
                        key,
                        value.name,
                        value.type,
                        value.size
                    );

                } else {

                    console.log(
                        key,
                        value
                    );

                }

            }


            /* =================================================
               SEND REQUEST
            ================================================= */

            try {

                const response =
                    await fetch(
                        API_URL,
                        {
                            method: "POST",
                            body: formData,
                            credentials: "include"
                        }
                    );


                /* =================================================
                   READ RESPONSE AS TEXT FIRST
                ================================================= */

                const responseText =
                    await response.text();


                console.log(
                    "Custom design API response:",
                    responseText
                );


                /* =================================================
                   PARSE JSON
                ================================================= */

                let data;

                try {

                    data =
                        JSON.parse(
                            responseText
                        );

                } catch (jsonError) {

                    console.error(
                        "Invalid JSON response:",
                        responseText
                    );

                    throw new Error(
                        "The server returned an invalid response. Please check the PHP server."
                    );
                }


                /* =================================================
                   CHECK RESPONSE
                ================================================= */

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        `Server error: ${response.status}`
                    );
                }


                if (!data.success) {

                    throw new Error(
                        data.message ||
                        "Unable to submit your custom design request."
                    );
                }


                /* =================================================
                   SUCCESS
                ================================================= */

                showMessage(
                    data.message ||
                    "Your custom design request has been submitted successfully.",
                    "success"
                );


                /* =================================================
                   RESET FORM
                ================================================= */

                form.reset();


                /* =================================================
                   CLEAR FILE NAME
                ================================================= */

                if (fileName) {

                    fileName.textContent = "";

                }


                /* =================================================
                   CLEAR IMAGE PREVIEW
                ================================================= */

                if (imagePreview) {

                    imagePreview.style.display =
                        "none";

                }


                if (previewImage) {

                    previewImage.src = "";

                }


                /* =================================================
                   SCROLL TO MESSAGE
                ================================================= */

                if (message) {

                    message.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }


            } catch (error) {

                console.error(
                    "Custom design submission error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Something went wrong. Please try again.",
                    "error"
                );


            } finally {

                /* =================================================
                   RESTORE BUTTON
                ================================================= */

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.innerHTML =
                        originalButtonHTML;

                }

            }

        }
    );


    /* =========================================================
       DEBUG MESSAGE
    ========================================================= */

    console.log(
        "NOJA'S CREATIONS: Custom design form initialized successfully."
    );

});