document.addEventListener("DOMContentLoaded", function () {
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

                secretLink.href = `/secrets/${secret.id}/`; // Replace with your URL structure
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

    // Check if the user is authenticated
    const isAuthenticated = Boolean(document.querySelector(".container-secrets"));

    if (isAuthenticated) {
        fetchAndDisplaySecrets(); // Fetch and display secrets if the user is logged in
    }
});

// Function to get the CSRF token from cookies
function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}