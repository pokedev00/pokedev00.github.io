function loginUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    if (!username) {
        window.dialogManager.showAuthErrorDialog("Login Error", "Username required.", false);
        return;
    } else if (!password) {
        window.dialogManager.showAuthErrorDialog("Login Error", "Password required.", false);
        return;
    }

    const user = auth.findUserByCredentials(username, password);

    if (!user) {
        window.dialogManager.showAuthErrorDialog("Login Error", "Invalid username or password.", false);
        return;
    }

    auth.signIn(username, user.userId);
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}