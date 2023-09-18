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
