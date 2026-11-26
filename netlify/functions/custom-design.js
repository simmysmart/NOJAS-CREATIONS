exports.handler = async function (event) {

    /* =====================================================
       NOJA'S CREATIONS
       CUSTOM DESIGN REQUEST FUNCTION
       ===================================================== */

    if (event.httpMethod !== "POST") {

        return {
            statusCode: 405,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                success: false,
                message: "Method not allowed."
            })
        };

    }


    /* =====================================================
       PARSE REQUEST
    ===================================================== */

    try {

        let data = {};

        if (event.body) {

            try {

                data = JSON.parse(event.body);

            } catch (error) {

                data = Object.fromEntries(
                    new URLSearchParams(event.body)
                );

            }

        }


        /* =================================================
           COLLECT DATA
        ================================================= */

        const request = {

            product:
                data.product ||
                "",

            name:
                data.name ||
                "",

            email:
                data.email ||
                "",

            phone:
                data.phone ||
                "",

            category:
                data.category ||
                "",

            budget:
                data.budget ||
                "",

            description:
                data.description ||
                "",

            colour:
                data.colour ||
                "",

            occasion:
                data.occasion ||
                "",

            created_at:
                new Date().toISOString()

        };


        /* =================================================
           VALIDATION
        ================================================= */

        if (
            !request.name ||
            !request.email ||
            !request.phone ||
            !request.category ||
            !request.description
        ) {

            return {

                statusCode: 400,

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    success: false,

                    message:
                        "Please complete all required fields."

                })

            };

        }


        /* =================================================
           EMAIL FORMAT VALIDATION
        ================================================= */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(
                request.email
            )
        ) {

            return {

                statusCode: 400,

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    success: false,

                    message:
                        "Please enter a valid email address."

                })

            };

        }


        /* =================================================
           TEMPORARY STORAGE
           
           For now we return the request successfully.
           Database/email integration comes next.
        ================================================= */

        console.log(
            "NEW CUSTOM DESIGN REQUEST:",
            request
        );


        /* =================================================
           SUCCESS
        ================================================= */

        return {

            statusCode: 200,

            headers: {

                "Content-Type":
                    "application/json",

                "Access-Control-Allow-Origin":
                    "*"

            },

            body: JSON.stringify({

                success: true,

                message:
                    "Your custom design request has been received successfully.",

                request: request

            })

        };


    } catch (error) {

        console.error(
            "CUSTOM DESIGN ERROR:",
            error
        );


        return {

            statusCode: 500,

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                success: false,

                message:
                    "An unexpected error occurred."

            })

        };

    }

};