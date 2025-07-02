document.getElementById('form-submit').addEventListener('click', async function(e) {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    // Get the input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmpassword').value;

    if (validateInputs(username, password, confirmPassword)) {
        // Call the sign_up function
        const result = await sign_up(username, password);

        // If successful, redirect; otherwise, show an error
        if (result.success) {
            console.log("User registered successfully!");
            movetoMain();
        } else {
            alert(result.message); 
        }
    }
});

async function sign_up(username, password) {
    try {
        const response = await fetch('../API/sign_up.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "username": username, "password": password })
        });

        const data = await response.json();
        console.log(data);
        return data;  // Return the response from PHP
    } catch (error) {
        console.error("Error during signup:", error);
        return {
            success: false,
            message: "An error occurred during signup. Please try again later."
        };
    }
}

function movetoMain() {
    window.location.href = "index.html";  // Redirect to the main page after successful signup
}

function validateInputs(username, password, confirmPassword) {
    // Check if the username is provided and valid
    if (!username) {
        alert("Username cannot be empty!");
        return false;
    }
    if (username.length < 3 || username.length > 15) {
        alert("Username must be between 3 and 15 characters long!");
        return false;
    }
    const usernameRegex = /^[a-zA-Z0-9]+$/;  // Alphanumeric username without special characters
    if (!usernameRegex.test(username)) {
        alert("Username can only contain letters and numbers!");
        return false;
    }

    // Check if the password is provided and valid
    if (!password) {
        alert("Password cannot be empty!");
        return false;
    }
    if (password.length < 8) {
        alert("Password must be at least 8 characters long!");
        return false;
    }

    // Check if confirm password is provided and matches the password
    if (!confirmPassword) {
        alert("Please confirm your password!");
        return false;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return false;
    }

    return true;  
}
