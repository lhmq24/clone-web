document.addEventListener("DOMContentLoaded", function () {
    const bestSellerContainer = document.getElementById("products_container");

    let offset = 0;  // Track number of products loaded
    const limit = 5; // Load 5 products per page

    let allBestSellers = [];  // Array to store all products
    let currentProducts = [];  // Array to store the current set of products to display

    // Function to load all products once
    async function loadAllBestSellers() {
        try {
            // Fetch all products with max 100
            const response = await fetch(`../API/get_best_sellers.php?offset=${offset}&limit=100`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
             
            allBestSellers = await response.json();
            currentProducts = allBestSellers.slice(offset, offset + limit); // Get the first set of products
            displayBestSellers();  // Display products after fetching
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    // Function to display products on the page
    function displayBestSellers() {
        bestSellerContainer.innerHTML = ''; // Clear the container before adding new content

        // Append previous button 
        const showPreviousButton = document.createElement("img");
        showPreviousButton.setAttribute("id", "best-seller--previous-button");
        showPreviousButton.setAttribute("src", "../assets/left-arrow.svg");
        showPreviousButton.setAttribute("alt", "Previous");

        bestSellerContainer.appendChild(showPreviousButton);

        // Append product cards to the container
        currentProducts.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("card"); // Add the card class to the product card

            // Create the card border (decorative border behind the card)
            const cardBorder = document.createElement("div");
            cardBorder.classList.add("card__border");
            productCard.appendChild(cardBorder);

            // Add card image container
            const cardImageContainer = document.createElement("div");
            cardImageContainer.classList.add("product--img_container");
            productCard.appendChild(cardImageContainer);

            // Add card image
            const cardImage = document.createElement("img");
            cardImage.classList.add("product--img");
            cardImage.setAttribute("src", product.image); // Set product image
            cardImageContainer.appendChild(cardImage);

            // Create card title container
            const cardTitleContainer = document.createElement("div");
            cardTitleContainer.classList.add("card_title__container");
            productCard.appendChild(cardTitleContainer);

            // Add title
            const cardTitle = document.createElement("a");
            cardTitle.classList.add("card_title");
            let truncatedName = product.name.length > 45 
            ? product.name.slice(0, 42) + "..." 
            : product.name; // Truncate name if too long
            cardTitle.textContent = truncatedName; // Set product name as the card title
            cardTitleContainer.appendChild(cardTitle);

            // Add paragraph (description)
            const cardParagraph1 = document.createElement("p");
            cardParagraph1.classList.add("card_paragraph");
            cardParagraph1.textContent = `RAM: ${product.ram}`; // Short description for product specs
            cardTitleContainer.appendChild(cardParagraph1);

            // Add paragraph (description)
            const cardParagraph2 = document.createElement("p");
            cardParagraph2.classList.add("card_paragraph");
            cardParagraph2.textContent = `SSD: ${product.ssd}`; // Short description for product specs
            cardTitleContainer.appendChild(cardParagraph2);

            // Horizontal line
            const line = document.createElement("hr");
            line.classList.add("line");
            productCard.appendChild(line);

            // Add the button
            const button = document.createElement("button");
            button.classList.add("button");
            button.textContent = "Add to Cart"; 
            productCard.appendChild(button);

            // Add button listeners
            button.addEventListener("click", () => {
                // Add the product to the cart
                addToCart(product);
            });

            // Create the list of features/specifications
            const cardList = document.createElement("ul");
            cardList.classList.add("card__list");

            // Add product specifications (e.g., CPU, screen size, GPU)
            const specifications = [
                `CPU: ${product.cpu}`,
                `Screen: ${product.screen}`,
                `GPU: ${product.gpu}`,
                `Weight: ${product.weight}`,
                `Material: ${product.material}`
            ];

            specifications.forEach(spec => {
                const listItem = document.createElement("li");
                listItem.classList.add("card__list_item");

                // Check icon
                const checkIcon = document.createElement("span");
                checkIcon.classList.add("check");
                const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svgIcon.setAttribute("class", "check_svg");
                svgIcon.setAttribute("fill", "currentColor");
                svgIcon.setAttribute("viewBox", "0 0 16 16");
                svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("clip-rule", "evenodd");
                path.setAttribute("d", "M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z");
                svgIcon.appendChild(path);
                checkIcon.appendChild(svgIcon);
                listItem.appendChild(checkIcon);

                // List text
                const listText = document.createElement("span");
                listText.classList.add("list_text");
                listText.textContent = spec;
                listItem.appendChild(listText);

                // Append list item to the card list
                cardList.appendChild(listItem);
            });

            // Append the specifications list to the product card
            productCard.appendChild(cardList);

            // Append the product card to the best seller container
            bestSellerContainer.appendChild(productCard);
        });

        // Append navigation buttons (next)
        const showMoreButton = document.createElement("img");
        showMoreButton.setAttribute("id", "best-seller--button");
        showMoreButton.setAttribute("src", "../assets/right-arrow.svg");
        showMoreButton.setAttribute("alt", "Next");

        bestSellerContainer.appendChild(showMoreButton);

        // Toggle visibility of buttons
        if (offset === 0) {
            showPreviousButton.style.display = "none";  // Hide Previous button on first page
        } else {
            showPreviousButton.style.display = "inline-block"; // Show Previous button when not on the first page
        }

        if (offset + limit >= allBestSellers.length) {
            showMoreButton.style.display = "none";  // Hide Next button if no more products
        } else {
            showMoreButton.style.display = "inline-block"; // Show Next button if more products available
        }

        // Add event listeners for buttons
        showPreviousButton.removeEventListener("click", handlePreviousClick);
        showPreviousButton.addEventListener("click", handlePreviousClick);

        showMoreButton.removeEventListener("click", handleNextClick);
        showMoreButton.addEventListener("click", handleNextClick);
    }

    // Handle Previous button click
    function handlePreviousClick() {
        if (offset >= limit) {
            offset -= limit;  // Decrease offset to go to the previous set of products
            currentProducts = allBestSellers.slice(offset, offset + limit); // Get the previous set of products
            displayBestSellers();  // Display updated products
        }
    }

    // Handle Next button click
    function handleNextClick() {
        if (offset + limit < allBestSellers.length) {
            offset += limit;  // Increase offset to load the next set of products
            currentProducts = allBestSellers.slice(offset, offset + limit); // Get the next set of products
            displayBestSellers();  // Display updated products
        }
    }

    // Initial load of all products (just once)
    loadAllBestSellers();
});
