// Users database object to hold registered users
let users = {};

// Toggle between login and signup form
let isSignup = true;

function toggleForm() {
    const formTitle = document.getElementById("formTitle");
    const toggleLink = document.getElementById("toggleLink");
    const message = document.getElementById("message");
    message.textContent = ''; // Clear any message

    if (isSignup) {
        formTitle.textContent = "Login";
        toggleLink.textContent = "Don't have an account? Signup";
    } else {
        formTitle.textContent = "Signup";
        toggleLink.textContent = "Already have an account? Login";
    }
    isSignup = !isSignup;  // Toggle the state
}

// Handle form submission
function submitForm() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    if (!username || !password) {
        message.textContent = "Please fill in both fields.";
        return;
    }

    // For signup logic
    if (isSignup) {
        if (users[username]) {
            message.textContent = "Username already exists. Try logging in.";
        } else {
            users[username] = password;
            message.textContent = "Signup successful! You can now login.";
            toggleForm();  // Switch to login after successful signup
        }
    }
    // For login logic
    else {
        if (users[username] && users[username] === password) {
            message.textContent = "Login successful! Welcome, " + username;
        } else {
            message.textContent = "Invalid username or password.";
        }
    }

    // Clear the input fields
    document.getElementById("username").value = '';
    document.getElementById("password").value = '';
}
