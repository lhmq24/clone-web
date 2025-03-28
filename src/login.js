document.getElementById('submit').addEventListener('click', async function(e) {
    e.preventDefault();

    // Get the input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Call the login function
    const result = await login(username, password);

    // If successful, redirect; otherwise, show an error
    if (result.success) {
        movetoMain();
    } else {
        alert(result.message); 
    }
});

async function login(username, password) {
    try {
        const response = await fetch('../API/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "username": username, "password": password })
        });
        
        const data = await response.json();
        return data;  // Return the response from PHP
    } catch (error) {
        console.error("Error during login:", error);
        return {
            success: false,
            message: "An error occurred during login. Please try again later."
        };
    }
}

function movetoMain() {
    window.location.href = "index.html";  // Redirect to the main page after successful login
}
