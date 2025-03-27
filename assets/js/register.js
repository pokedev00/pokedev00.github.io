document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("player-id").textContent = generatePlayerID();
});

function generatePlayerID() {
    let id = "";
    for (let i = 0; i < 4; i++) {
        id += Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
        if (i < 3) id += "-"; // Add hyphen between sections
    }
    return id;
}

function isValidEmail(email) {
// Regular expression for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
}

function registerUser(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (username === "") {
    alert("Username required.");
    return;
} else if (email === "") {
    alert("Email required.");
    return;
} else if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
} else if (password === "") {
    alert("Password required.");
    return;
} else if (confirmPassword === "") {
    alert("Confirm Password required.");
    return;
} else if (password !== confirmPassword) {
    alert("Passwords don't match. Retype your password.");
    return;
}

    const user = {
        username,
        email,
        password
    };

    localStorage.setItem('user', JSON.stringify(user));
    alert(email + "  Thanks for registration. \nTry to login Now");

    document.getElementById('username').value = "";
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
    document.getElementById('confirm-password').value = "";

    window.location.href = 'login.html';
}