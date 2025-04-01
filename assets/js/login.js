function loginUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    // Validate form inputs
    if (!username) {
        window.dialogManager.showAuthErrorDialog("Login Error", "Username required.", false);
        return;
    } else if (!password) {
        window.dialogManager.showAuthErrorDialog("Login Error", "Password required.", false);
        return;
    }

    // Find user with matching credentials
    const user = auth.findUserByCredentials(username, password);

    if (!user) {
        window.dialogManager.showAuthErrorDialog("Login Error", "Invalid username or password.", false);
        return;
    }

    // Sign in the user with username and userId
    auth.signIn(username, user.userId);
    
    // Redirect to the dashboard or home page after a short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}