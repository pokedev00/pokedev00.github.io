function loginUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser) {
        alert("No registered user found. Please sign up first.");
        return;
    }

    if (username === storedUser.username && password === storedUser.password) {
        // Use the global auth system to sign in
        auth.signIn();
        alert(username + " you are logged in now. Welcome to our website.");
        // Redirect to the dashboard or home page
        window.location.href = 'index.html';
    } else {
        alert("Invalid username or password.");
    }
}