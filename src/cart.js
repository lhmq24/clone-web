//Login check
fetch('../API/login_check.php')
    .then(response => response.json())  // Convert the response to JSON
    .then(data => {
        if (!data.success) {
            window.location.href = 'login.html';  // Redirect to login page if not logged in
        } else {
            // Logged in successfully
            updateCartCount();

            // Display username and Logout when logged in
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
                    .then(response => response.json())  // Convert logout response to JSON
                    .then(data => {
                        if (data.success) {
                            //Update right nav buttons
                            login.style.display = 'block';
                            signup.style.display = 'block';
                            user.style.display = 'none';
                            logoutButton.style.display = 'none';

                            // Reset cart when log out
                            localStorage.removeItem("cart");
                            document.getElementById("cartcount").setAttribute("data-count", 0);
                            // Redirect to login page after logout
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

// Initialize the cart count and show cart items when the page loads
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    showCartItems();  
});

// Add event listener to the checkout button
const checkoutButton = document.getElementById('checkout-btn');
const modal = document.getElementById('checkout-modal');
const closeModal = document.getElementById('close-modal');

checkoutButton.addEventListener('click', () => {
    modal.style.display = 'block'; // Show the modal
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind the modal
});


// Close the modal when the close button (×) is clicked
closeModal.addEventListener('click', () => {
    modal.style.display = 'none'; // Hide the modal
    document.body.style.overflow = 'auto'; // Restore scrolling
});

// Close the modal if the user clicks outside the modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none'; // Hide the modal
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
});

// Add listener to the Buy now button
    const buyNowButtons = document.getElementById('submit');
    buyNowButtons.addEventListener('click', async function(e) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
            alert("Your cart is empty! Please add items to your cart before proceeding to checkout.");
            return;
        }  else {
            // Proceed with the checkout process
            e.preventDefault();

            // Get the input values
            const name = document.getElementById('name').value.trim();
            const phone_number = document.getElementById('phone_number').value.trim();
            const address = document.getElementById('address').value.trim();
            const username = getCookie("username"); // Get the username from cookies
            
            // Validate input fields
            const name_regex = /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)*$/; // Using non-capturing characters to make middle/ last name optional
            const phone_regex = /^[0-9]{10,11}$/; 
            const address_regex = /^[a-zA-Z0-9\s,.'-]{10,70}$/; 

            if (!name || !phone_number || !address) {
                alert("Please fill out all fields.");
                return;
            }            

            if (!name_regex.test(name)) {
                alert("Your name is not valid!");
                return;
            }

            if (!phone_regex.test(phone_number)) {
                alert("Your phone number is not valid!");
                return;
            }
            if (!address_regex.test(address)) {
                alert("Your address is not valid!");
                return;
            }
            if( username === null) {
                alert("Please login before checkout!");
                return;
            }

            // Call the payCart function
            const result = await payCart(username, name, phone_number, address);

            // If successful, redirect; otherwise, show an error
            if (result.success) {
                clearCart(); // Clear the cart after successful payment
                alert("Payment successful! Thank you for your purchase.");
                movetoMain();
            } else {
                alert(result.message); 
            }
        }
    });



//----------------------------Function Section ----------------------------

async function payCart(username, name, phone_number, address) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.forEach(product => {
        product.id = parseInt(product.id, 10);  // Ensure id is an integer
    });
    
    // Fixing the total_price conversion to a number
    const total_price = parseFloat(document.getElementById('total_price').textContent.replace(/[^0-9.]/g, '')); // Remove non-numeric characters and parse to float

    const data = {
        "cart": cart,
        "name": name,
        "phone_number": phone_number,
        "address": address,
        "total_price": total_price,
        "username": username
    };

    return fetch('../API/pay_cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())  // Parsing the JSON response from the server
    .catch(error => {
        console.error("Error during payment:", error);
        return {
            success: false,
            message: "An error occurred during payment. Please try again later."
        };
    });
}


function clearCart(){
    localStorage.removeItem("cart");
    updateCartCount();
    showCartItems();
}

function movetoMain() {
    window.location.href = "index.html"; 
}

function updateCartCount(){
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartcount = document.getElementById('cartcount');
    let count = 0 ;
    // Iterate through cart to calculate total quantity
    cart.forEach(product => {
        count += parseInt(product.quantity,10); // Ensure quantity is an integer
    });
    cartcount.setAttribute("data-count", count); 
}

function showCartItems() {
    // Get the products container
    const productsContainer = document.getElementById('products');
    
    // Get the cart items from localStorage and parse it
    const items = JSON.parse(localStorage.getItem('cart')) || [];

    // Clear existing products (if any)
    productsContainer.innerHTML = '';

    // Loop through each item in the cart
    items.forEach(item => {
        // Create the product div
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        
        // Create the product image
        const Image = `<img class="product--img" src="${item.image}">`;

        // Create the product text and quantity
        let price = parseInt(item.price,10)*parseInt(item.quantity,10)
        let locale_price = price.toLocaleString();
        const productInfo = `
            <div>
                <span>${item.name}</span>
                <div class="product-details">
                    <ul class="card__list">
                        <li class="card__list_item">CPU: ${item.cpu}</li>
                        <li class="card__list_item">Screen: ${item.screen}</li>
                        <li class="card__list_item">GPU: ${item.gpu}</li>
                        <li class="card__list_item">Weight: ${item.weight}</li>
                        <li class="card__list_item">Material: ${item.material}</li>
                    </ul>
                </div>
            </div>
            <div class="quantity">
                <button class="decrease-btn" data-id="${item.id}">
                    <svg fill="none" viewBox="0 0 24 24" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" stroke="#47484b" d="M20 12L4 12"></path>
                    </svg>
                </button>
                <label>${item.quantity}</label>
                <button class="increase-btn" data-id="${item.id}">
                    <svg fill="none" viewBox="0 0 24 24" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" stroke="#47484b" d="M12 4V20M20 12H4"></path>
                    </svg>
                </button>
            </div>
            <label class="price small">${locale_price} đ</label>
            <button id="delete-btn">
                <i class="fa-solid fa-xmark"></i>
            </button>`;
        
        // Add the product to the product div
        productDiv.innerHTML = Image + productInfo;

        // Add event listeners for increase, decrease and delete buttons
        const increaseBtn = productDiv.querySelector('.increase-btn');
        const decreaseBtn = productDiv.querySelector('.decrease-btn');
        const deleteBtn = productDiv.querySelector('#delete-btn');

        // Add event listener to increase button
        increaseBtn.addEventListener('click', () => {
            increaseProductQuantity(item);
        });

        // Add event listener to decrease button
        decreaseBtn.addEventListener('click', () => {
            decreaseProductQuantity(item);
        });

        // Add event listener to delete button
        deleteBtn.addEventListener('click', () => {
            removeCartItem(item);
        });
        // Append the product div to the container
        productsContainer.appendChild(productDiv);
    });

    updateCheckout(); // Update the checkout section with the current cart items
}

function increaseProductQuantity(product) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        showCartItems(); // Re-render the cart
        console.log("Product quantity increased: ", product);
    } else {
        alert("Product not found in the cart");
    }
}

function decreaseProductQuantity(product) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            showCartItems(); // Re-render the cart
            console.log("Product quantity decreased: ", product);
        } else {
            alert("Product quantity is 1, please remove instead!");
        }
    } else {
        alert("Product not found in the cart");
    }
}

function removeCartItem(product) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Show confirmation prompt before removing the item
    const isConfirmed = confirm(`Are you sure you want to remove ${product.name} from your cart?`);
    
    if (isConfirmed) {
        // Filter out the item from the cart
        const updatedCart = cart.filter(item => item.id !== product.id);
        
        if (cart.length === updatedCart.length) {
            alert("Product not found in the cart");
        } else {
            // Update the local storage with the modified cart
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            updateCartCount();
            showCartItems(); // Re-render the cart
            console.log("Product deleted from cart:", product);
            alert(`${product.name} has been deleted from your cart!`);
        }
    } else {
        console.log("Removal cancelled");
    }
}

function updateCheckout() {
    const subtotal = document.getElementById('subtotal');
    const shipping_fees = document.getElementById('shipping-fees');
    const total_price = document.getElementById('total_price');

    let sub_total = 0;
    const shippingfees = 30000; // Default shipping fees

    // Fetch the cart from localStorage, defaulting to an empty array if not found
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Calculate subtotal
    cart.forEach(item => {
        const price = parseInt(item.price, 10);
        const quantity = parseInt(item.quantity, 10);

        if (!isNaN(price) && !isNaN(quantity)) {
            sub_total += price * quantity;
        }
    });

    // Update subtotal display
    subtotal.textContent = `${sub_total.toLocaleString()} đ`;

    // Update shipping fees display
    shipping_fees.textContent = sub_total > 0 ? `${shippingfees.toLocaleString()} đ` : `0 đ`;

    // Calculate and display total price
    const total = sub_total + (sub_total > 0 ? shippingfees : 0);
    total_price.textContent = `${total.toLocaleString()} đ`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}