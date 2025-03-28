document.getElementById('form-submit').addEventListener('click', async function(e) {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    // Get the input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmpassword').value;

    // Confirm password
    if (password !== confirmPassword) {
        alert("Password do not match!");
        return;
    }

    // Call the sign_up function
    const result = await sign_up(username, password);

    // If successful, redirect; otherwise, show an error
    if (result.success) {
        console.log("User registered successfully!");
        movetoMain();
    } else {
        alert(result.message); 
    }
});

async function sign_up(username, password) {
    try {
        const response = await fetch('../API/sign_up.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "username": username,
                "password": password })
            })

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
