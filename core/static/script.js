document.addEventListener("DOMContentLoaded", function () {
    console.log("test")
    // Function to fetch and display secrets
    function fetchAndDisplaySecrets() {
        fetch("/secrets/", {
            method: "GET",
            headers: {
                "Authorization": "Bearer YOUR_AUTH_TOKEN", // Replace with your authentication method
            },
        })
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector(".container-secrets");
            container.innerHTML = ""; // Clear existing content

            data.forEach(secret => {
                // Create a Bootstrap card for each secret
                const card = document.createElement("div");
                card.classList.add("card", "mb-3");

                // Create card body
                const cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                // Create a link to the secret's detail page using the secret's title
                const secretLink = document.createElement("a");
                secretLink.classList.add("text-decoration-none"); // Add this line to apply Bootstrap styling

                secretLink.href = `/secrets/details/${secret.id}/`; // Replace with your URL structure
                secretLink.style.textDecoration = "none"; // Remove underline
                secretLink.style.color = "inherit"; // Inherit text color

                // Create card title
                const cardTitle = document.createElement("h5");
                cardTitle.classList.add("card-title");
                cardTitle.textContent = secret.title;

                secretLink.appendChild(cardTitle);
                cardBody.appendChild(secretLink);

                // Create card content
                const cardAdditionalInfo = document.createElement("p");
                cardAdditionalInfo.classList.add("card-text");
                cardAdditionalInfo.textContent = secret.additional_info;
                cardBody.appendChild(cardAdditionalInfo);

                // Create a delete button
                const deleteButton = document.createElement("button");
                deleteButton.classList.add("btn", "btn-danger", "float-end"); // Add Bootstrap styling classes
                deleteButton.textContent = "Delete";

                // Add click event listener to delete the secret
                deleteButton.addEventListener("click", function () {
                    const confirmed = confirm("Are you sure you want to delete this secret?");
                    if (confirmed) {
                        // Send a DELETE request to the API
                        fetch(`/secrets/${secret.id}/`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                "X-CSRFToken": csrftoken,
                            }
                        })
                        .then(response => {
                            if (response.ok) {
                                // Secret deleted successfully, refresh the page
                                window.location.reload();
                            } else {
                                // Handle error response
                                console.error("Error deleting secret:", response.statusText);
                            }
                        })
                        .catch(error => {
                            console.error("Error deleting secret:", error);
                        });
                    }
                });

                cardBody.appendChild(deleteButton);


                card.appendChild(cardBody);
                container.appendChild(card);
            });
        })
        .catch(error => console.error("Error fetching secrets:", error));
    }

    // Function to fetch and display secret details
    function fetchAndDisplaySecretDetails(secretId) {
        fetch(`/secrets/${secretId}/`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer YOUR_AUTH_TOKEN", // Replace with your authentication method
            },
        })
        .then(response => response.json())
        .then(secret => {
            // Select the container for displaying secret details
            const secretDetailContainer = document.querySelector("#secret-detail");

            // Create a Bootstrap card to display the secret details
            const card = document.createElement("div");
            card.classList.add("card", "shadow"); // Add shadow for depth effect

            // Create card body
            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            // Create card title (in bold)
            const cardTitle = document.createElement("h5");
            cardTitle.classList.add("card-title", "fw-bold", "text-primary"); // Apply Bootstrap styling
            cardTitle.textContent = secret.title;

            // Create card content
            const cardContent = document.createElement("div");
            cardContent.classList.add("card-text");

            // Display secret content like a password
            const contentName = document.createElement("strong");
            contentName.classList.add("fw-bold"); // Field name in bold
            contentName.textContent = "Secret Content: ";
            cardContent.appendChild(contentName);

            const contentValue = document.createElement("span");
            contentValue.textContent = "*".repeat(secret.decrypted_content.length); // Display asterisks
            contentValue.style.fontFamily = "monospace"; // Monospace font for uniform character width
            contentValue.style.display = "inline";

            const contentToggle = document.createElement("button");
            contentToggle.textContent = "Show"; // Button to reveal or hide content (initially "Show")
            contentToggle.classList.add("btn", "btn-link", "text-primary", "ms-2");
            let isContentHidden = true;

            contentToggle.addEventListener("click", function () {
                if (isContentHidden) {
                    contentValue.textContent = secret.decrypted_content;
                    contentToggle.textContent = "Hide"; // Change to "Hide"
                    isContentHidden = false;
                } else {
                    contentValue.textContent = "*".repeat(secret.decrypted_content.length);
                    contentToggle.textContent = "Show"; // Change to "Show"
                    isContentHidden = true;
                }
            });

            // Display additional info (name in bold)
            const additionalInfoName = document.createElement("strong");
            additionalInfoName.classList.add("fw-bold"); // Field name in bold
            additionalInfoName.textContent = "Additional Info: ";

            const additionalInfoValue = document.createElement("span");
            additionalInfoValue.textContent = secret.additional_info;

            // Format the creation date (name in bold)
            const creationDateName = document.createElement("strong");
            creationDateName.classList.add("fw-bold"); // Field name in bold
            creationDateName.textContent = "Creation Date: ";

            const creationDateValue = document.createElement("span");
            const createDate = new Date(secret.created_at);
            const formattedDate = createDate.toLocaleDateString("en-GB"); // Format as dd/mm/yyyy
            creationDateValue.textContent = formattedDate;

            // Create delete button
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("btn", "btn-danger", "float-end"); // Add Bootstrap styling classes
            deleteButton.textContent = "Delete";

            // Add click event listener to delete the secret
            deleteButton.addEventListener("click", function () {
                const confirmed = confirm("Are you sure you want to delete this secret?");
                if (confirmed) {
                    // Send a DELETE request to the API
                    fetch(`/secrets/${secret.id}/`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRFToken": csrftoken, // Replace with your CSRF token
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            // Secret deleted successfully, refresh the page or perform any other desired action
                            window.location.href = "/";
                        } else {
                            // Handle error response
                            console.error("Error deleting secret:", response.statusText);
                        }
                    })
                    .catch(error => {
                        console.error("Error deleting secret:", error);
                    });
                }
            });

            // Create card content container for the fields
            const fieldsContainer = document.createElement("div");
            fieldsContainer.classList.add("mb-3"); // Add margin at the bottom

            // Append fields to the fields container
            fieldsContainer.appendChild(contentName);
            fieldsContainer.appendChild(contentValue);
            fieldsContainer.appendChild(contentToggle);
            fieldsContainer.appendChild(document.createElement("br"));
            fieldsContainer.appendChild(additionalInfoName);
            fieldsContainer.appendChild(additionalInfoValue);
            fieldsContainer.appendChild(document.createElement("br"));
            fieldsContainer.appendChild(creationDateName);
            fieldsContainer.appendChild(creationDateValue);

            // Create delete button container
            const deleteButtonContainer = document.createElement("div");
            deleteButtonContainer.classList.add("d-flex", "justify-content-between", "align-items-center", "mt-3"); // Add space between fields and the button

            // Append delete button to its container
            deleteButtonContainer.appendChild(deleteButton);

            // Append both the fields container and delete button container to card content
            cardContent.appendChild(fieldsContainer);
            cardContent.appendChild(deleteButtonContainer);

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardContent);
            card.appendChild(cardBody);

            secretDetailContainer.appendChild(card);

            // Create a link to go back to the home page (outside of the Secret card)
            const backButton = document.createElement("a");
            backButton.textContent = "Go Back to Home";
            backButton.href = "/"; // Replace with the actual URL to go back to the home page
            backButton.classList.add("btn", "btn-secondary", "mt-3");

            secretDetailContainer.appendChild(backButton);
        })
        .catch(error => console.error("Error fetching secret details:", error));
    }


    // Check if the user is authenticated
    const isAuthenticated = Boolean(document.querySelector(".container-secrets"));

    if (isAuthenticated) {
        fetchAndDisplaySecrets(); // Fetch and display secrets if the user is logged in
    }

    // Check if the user is on the secret detail page
    const secretDetailContainer = document.querySelector("#secret-detail");
    if (secretDetailContainer) {
        // Extract the secret ID from the URL
        const urlParts = window.location.pathname.split("/");
        const secretId = urlParts[urlParts.length - 2]; // Assuming the URL structure is "/secrets/<secret_id>/"

        fetchAndDisplaySecretDetails(secretId); // Fetch and display the secret details if on the detail page
    }

});
