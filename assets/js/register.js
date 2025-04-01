document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("player-id").textContent = generatePlayerID();
});

function generatePlayerID() {
    let id = "";
    for (let i = 0; i < 4; i++) {
        id += Math.floor(1000 + Math.random() * 9000);
        if (i < 3) id += "-";
    }
    return id;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function registerUser(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const playerId = document.getElementById('player-id').textContent;

    if (username === "") {
        window.dialogManager.showAuthErrorDialog("Registration Error", "Username required.", false);
        return;
    } else if (email === "") {
        window.dialogManager.showAuthErrorDialog("Registration Error", "Email required.", false);
        return;
    } else if (!isValidEmail(email)) {
        window.dialogManager.showAuthErrorDialog("Registration Error", "Please enter a valid email address.", false);
        return;
    } else if (password === "") {
        window.dialogManager.showAuthErrorDialog("Registration Error", "Password required.", false);
        return;
    } else if (confirmPassword === "") {
        window.dialogManager.showAuthErrorDialog("Registration Error", "Confirm Password required.", false);
        return;
    } else if (password !== confirmPassword) {
        window.dialogManager.showAuthErrorDialog("Registration Error", "Passwords don't match. Retype your password.", false);
        return;
    }

    const userData = {
        username,
        email,
        password,
        playerId,
        registrationDate: new Date().toISOString()
    };

    const result = auth.registerUser(userData);
    
    if (!result.success) {
        window.dialogManager.showAuthErrorDialog("Registration Error", result.message, false);
        return;
    }

    auth.signIn(username, result.userId);
    
    document.getElementById('username').value = "";
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
    document.getElementById('confirm-password').value = "";

    window.dialogManager.showSuccessDialog('Registration Successful', 'Your account has been created successfully!');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}