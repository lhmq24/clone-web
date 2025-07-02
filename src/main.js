// Login check
fetch('../API/login_check.php')
    .then(response => response.json())  // Convert the response to JSON
    .then(data => {
        if (!data.success) {
            window.location.href = 'login.html';  // Redirect to login page if not logged in
        } else {

            // Logged in successfully
            const cartcount = document.getElementById('cartcount');
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            let count = 0;
            cart.forEach(product => {
                count += parseInt(product.quantity || 1, 10);
            });
            cartcount.setAttribute("data-count", count);

            const login = document.getElementById('login');
            const signup = document.getElementById('signup');
            const user = document.getElementById('user');
            const logoutButton = document.getElementById('logout');

            login.style.display = 'none';
            signup.style.display = 'none';

            user.style.display = 'block';
            user.textContent = 'Welcome, ' + data.user;
            logoutButton.style.display = 'block';
            logoutButton.textContent = 'Log out';

            // Logout button event handler
            logoutButton.addEventListener('click', () => {
                fetch('../API/logout.php')
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            login.style.display = 'block';
                            signup.style.display = 'block';
                            user.style.display = 'none';
                            logoutButton.style.display = 'none';
                            localStorage.removeItem("cart");
                            cartcount.setAttribute("data-count", 0);
                            window.location.href = '../src/login.html';
                        } else {
                            console.error('Server error during logout:', data.message);
                        }
                    })
                    .catch(error => console.error('Error during logout request:', error));
            });
        }
    })
    .catch(error => {
        console.error('Error during login check request:', error);
    });

// Search function
const searchbox = document.getElementById('searchbox');
const searchButton = document.getElementById('elements--searchbutton');

let matchedProducts = [];
let offset = 0;
let limit = 5;
let currentProducts = [];

searchButton.addEventListener('click', () => {
    let input = searchbox.value;
    searchProduct(input);
});

async function searchProduct(input) {
    const response = await fetch(`../API/search_product.php?product=${input}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    matchedProducts = await response.json();

    if (matchedProducts != null) {
        offset = 0;
        limit = 5;
        currentProducts = matchedProducts.slice(offset, offset + limit);
        displayProducts();
    } else {
        console.log('No matching products');
    }
}

function displayProducts() {
    const title = document.getElementById('best-seller__title');
    title.textContent = `There are ${matchedProducts.length} products that matched the name`;
    title.style.fontSize = '20px';

    const bestSellerContainer = document.getElementById("products_container");
    bestSellerContainer.innerHTML = '';

    const showPreviousButton = document.createElement("img");
    showPreviousButton.setAttribute("id", "best-seller--previous-button");
    showPreviousButton.setAttribute("src", "../assets/left-arrow.svg");
    showPreviousButton.setAttribute("alt", "Previous");
    bestSellerContainer.appendChild(showPreviousButton);

    currentProducts = matchedProducts.slice(offset, offset + limit);

    currentProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("card");

        const cardBorder = document.createElement("div");
        cardBorder.classList.add("card__border");
        productCard.appendChild(cardBorder);

        const cardImageContainer = document.createElement("div");
        cardImageContainer.classList.add("product--img_container");
        productCard.appendChild(cardImageContainer);

        const cardImage = document.createElement("img");
        cardImage.classList.add("product--img");
        cardImage.setAttribute("src", product.image);
        cardImageContainer.appendChild(cardImage);

        const cardTitleContainer = document.createElement("div");
        cardTitleContainer.classList.add("card_title__container");
        productCard.appendChild(cardTitleContainer);

        const cardTitle = document.createElement("a");
        cardTitle.classList.add("card_title");
        let truncatedName = product.name.length > 45 
            ? product.name.slice(0, 42) + "..." 
            : product.name; // Truncate name if too long
        cardTitle.textContent = truncatedName; // Set product name as the card title
        cardTitleContainer.appendChild(cardTitle);

        const cardParagraph1 = document.createElement("p");
        cardParagraph1.classList.add("card_paragraph");
        cardParagraph1.textContent = `RAM: ${product.ram}`;
        cardTitleContainer.appendChild(cardParagraph1);

        const cardParagraph2 = document.createElement("p");
        cardParagraph2.classList.add("card_paragraph");
        cardParagraph2.textContent = `SSD: ${product.ssd}`;
        cardTitleContainer.appendChild(cardParagraph2);

        const line = document.createElement("hr");
        line.classList.add("line");
        productCard.appendChild(line);

        const button = document.createElement("button");
        button.classList.add("button");
        button.textContent = "Add to Cart";
        productCard.appendChild(button);

        button.addEventListener("click", () => {
            button.style.backgroundColor = "#4CAF50"; // Change color on click
            addToCart(product);
        });

        const cardList = document.createElement("ul");
        cardList.classList.add("card__list");

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

            const checkIcon = document.createElement("span");
            checkIcon.classList.add("check");

            const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgIcon.setAttribute("class", "check_svg");
            svgIcon.setAttribute("fill", "currentColor");
            svgIcon.setAttribute("viewBox", "0 0 16 16");

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("clip-rule", "evenodd");
            path.setAttribute("d", "M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z");

            svgIcon.appendChild(path);
            checkIcon.appendChild(svgIcon);
            listItem.appendChild(checkIcon);

            const listText = document.createElement("span");
            listText.classList.add("list_text");
            listText.textContent = spec;
            listItem.appendChild(listText);

            cardList.appendChild(listItem);
        });

        productCard.appendChild(cardList);
        bestSellerContainer.appendChild(productCard);
    });

    const showMoreButton = document.createElement("img");
    showMoreButton.setAttribute("id", "best-seller--button");
    showMoreButton.setAttribute("src", "../assets/right-arrow.svg");
    showMoreButton.setAttribute("alt", "Next");
    bestSellerContainer.appendChild(showMoreButton);

    showPreviousButton.style.display = offset === 0 ? "none" : "inline-block";
    showMoreButton.style.display = offset + limit >= matchedProducts.length ? "none" : "inline-block";

    showPreviousButton.removeEventListener("click", handlePreviousClick);
    showPreviousButton.addEventListener("click", handlePreviousClick);

    showMoreButton.removeEventListener("click", handleNextClick);
    showMoreButton.addEventListener("click", handleNextClick);
}

function handlePreviousClick() {
    if (offset >= limit) {
        offset -= limit;
        displayProducts();
    }
}

function handleNextClick() {
    if (offset + limit < matchedProducts.length) {
        offset += limit;
        displayProducts();
    }
}

function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Update cart in local storage 
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update cart count in the cart icon
    const cartcount = document.getElementById('cartcount');
    let count = 0;
    cart.forEach(product => {
        count += parseInt(product.quantity, 10);
    });
    cartcount.setAttribute("data-count", count);

    // Log and alert if success
    console.log("Product added to cart:", product);
    alert(`${product.name} has been added to your cart!`);

    // Retrieve username from cookies
    const username = getCookie("username");

    if (username) {
        // Prepare cart data to send to API
        const cartData = {
            username: username,
            cart: cart
        };

        // Call the addCart.php API
        fetch('../API/addCart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Cart updated successfully");
            } else {
                console.error("Failed to update cart");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    } else {
        console.error("Username not found in cookies");
    }
}

// Helper function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

