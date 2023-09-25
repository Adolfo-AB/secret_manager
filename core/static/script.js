document.addEventListener("DOMContentLoaded", function () {
    console.log("test")
    // Function to fetch and display secrets
    function fetchAndDisplaySecrets() {
        fetch("/secrets/", {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector(".container-secrets");
            container.innerHTML = "";

            data.forEach(secret => {
                // Create a Bootstrap card for each secret
                const card = document.createElement("div");
                card.classList.add("card", "mb-3");

                const cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                const secretLink = document.createElement("a");
                secretLink.classList.add("text-decoration-none");

                secretLink.href = `/secrets/details/${secret.id}/`;
                secretLink.style.textDecoration = "none";
                secretLink.style.color = "inherit";

                const cardTitle = document.createElement("h5");
                cardTitle.classList.add("card-title");
                cardTitle.textContent = secret.title;

                secretLink.appendChild(cardTitle);
                cardBody.appendChild(secretLink);

                const cardAdditionalInfo = document.createElement("p");
                cardAdditionalInfo.classList.add("card-text");
                cardAdditionalInfo.textContent = secret.additional_info;
                cardBody.appendChild(cardAdditionalInfo);

                const deleteButton = document.createElement("button");
                deleteButton.classList.add("btn", "btn-danger", "float-end");
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener("click", function () {
                    const confirmed = confirm("Are you sure you want to delete this secret?");
                    if (confirmed) {
                        fetch(`/secrets/${secret.id}/`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                "X-CSRFToken": csrftoken,
                            }
                        })
                        .then(response => {
                            if (response.ok) {
                                window.location.reload();
                            } else {
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
                "Authorization": "Bearer YOUR_AUTH_TOKEN",
            },
        })
        .then(response => response.json())
        .then(secret => {
            const secretDetailContainer = document.querySelector("#secret-detail");

            const card = document.createElement("div");
            card.classList.add("card", "shadow");

            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            const cardTitle = document.createElement("h5");
            cardTitle.classList.add("card-title", "fw-bold", "text-primary");
            cardTitle.textContent = secret.title;

            const cardContent = document.createElement("div");
            cardContent.classList.add("card-text");

            const contentName = document.createElement("strong");
            contentName.classList.add("fw-bold");
            contentName.textContent = "Secret Content: ";
            cardContent.appendChild(contentName);

            const contentValue = document.createElement("span");
            contentValue.textContent = "*".repeat(secret.decrypted_content.length);
            contentValue.style.fontFamily = "monospace";
            contentValue.style.display = "inline";

            const contentToggle = document.createElement("button");
            contentToggle.textContent = "Show";
            contentToggle.classList.add("btn", "btn-link", "text-primary", "ms-2");
            let isContentHidden = true;

            contentToggle.addEventListener("click", function () {
                if (isContentHidden) {
                    contentValue.textContent = secret.decrypted_content;
                    contentToggle.textContent = "Hide";
                    isContentHidden = false;
                } else {
                    contentValue.textContent = "*".repeat(secret.decrypted_content.length);
                    contentToggle.textContent = "Show";
                    isContentHidden = true;
                }
            });

            const additionalInfoName = document.createElement("strong");
            additionalInfoName.classList.add("fw-bold");
            additionalInfoName.textContent = "Additional Info: ";

            const additionalInfoValue = document.createElement("span");
            additionalInfoValue.textContent = secret.additional_info;

            const creationDateName = document.createElement("strong");
            creationDateName.classList.add("fw-bold");
            creationDateName.textContent = "Creation Date: ";

            const creationDateValue = document.createElement("span");
            const createDate = new Date(secret.created_at);
            const formattedDate = createDate.toLocaleDateString("en-GB"); // Format as dd/mm/yyyy
            creationDateValue.textContent = formattedDate;

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("btn", "btn-danger", "float-end");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function () {
                const confirmed = confirm("Are you sure you want to delete this secret?");
                if (confirmed) {
                    fetch(`/secrets/${secret.id}/`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRFToken": csrftoken,
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            window.location.href = "/";
                        } else {
                            console.error("Error deleting secret:", response.statusText);
                        }
                    })
                    .catch(error => {
                        console.error("Error deleting secret:", error);
                    });
                }
            });

            const fieldsContainer = document.createElement("div");
            fieldsContainer.classList.add("mb-3");

            fieldsContainer.appendChild(contentName);
            fieldsContainer.appendChild(contentValue);
            fieldsContainer.appendChild(contentToggle);
            fieldsContainer.appendChild(document.createElement("br"));
            fieldsContainer.appendChild(additionalInfoName);
            fieldsContainer.appendChild(additionalInfoValue);
            fieldsContainer.appendChild(document.createElement("br"));
            fieldsContainer.appendChild(creationDateName);
            fieldsContainer.appendChild(creationDateValue);

            const deleteButtonContainer = document.createElement("div");
            deleteButtonContainer.classList.add("d-flex", "justify-content-between", "align-items-center", "mt-3");

            deleteButtonContainer.appendChild(deleteButton);

            cardContent.appendChild(fieldsContainer);
            cardContent.appendChild(deleteButtonContainer);

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardContent);
            card.appendChild(cardBody);

            secretDetailContainer.appendChild(card);

            const backButton = document.createElement("a");
            backButton.textContent = "Go Back to Home";
            backButton.href = "/";
            backButton.classList.add("btn", "btn-secondary", "mt-3");

            secretDetailContainer.appendChild(backButton);
        })
        .catch(error => console.error("Error fetching secret details:", error));
    }

    const isAuthenticated = Boolean(document.querySelector(".container-secrets"));

    if (isAuthenticated) {
        fetchAndDisplaySecrets();
    }

    const secretDetailContainer = document.querySelector("#secret-detail");
    if (secretDetailContainer) {
        // Extract the secret ID from the URL
        const urlParts = window.location.pathname.split("/");
        const secretId = urlParts[urlParts.length - 2];

        fetchAndDisplaySecretDetails(secretId);
    }

    const generateSecretButton = document.getElementById("generate-secret-button");
    const contentField = document.getElementById("id_content");

    if (generateSecretButton && contentField) {
        generateSecretButton.addEventListener("click", function () {
          const secureSecret = generateSecureSecret();
          contentField.value = secureSecret;
        });
      }

    // Function to generate a secure secret
    function generateSecureSecret() {
        // Generate a random secure secret (e.g., 12 characters with a mix of letters, numbers, and special characters)
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?";
        const secureSecretLength = 12;
        let secureSecret = "";

        for (let i = 0; i < secureSecretLength; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          secureSecret += characters.charAt(randomIndex);
        }

        return secureSecret;
    }

});
