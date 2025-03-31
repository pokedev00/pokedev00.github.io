// Simple auth state management
const AUTH_KEY = 'isAuthenticated';

const auth = {
    // Check if user is authenticated
    isAuthenticated() {
        return localStorage.getItem(AUTH_KEY) === 'true';
    },

    // Sign in user
    signIn() {
        localStorage.setItem(AUTH_KEY, 'true');
        this.updateUIElements();
    },

    // Sign out user
    signOut() {
        localStorage.removeItem(AUTH_KEY);
        this.updateUIElements();
    },

    // Update UI elements based on auth state
    updateUIElements() {
        const headerIconsDiv = document.querySelector('.header-icons');
        if (!headerIconsDiv) return;

        if (this.isAuthenticated()) {
            // Get user data from localStorage
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            const username = userData.username || 'Profile';

            headerIconsDiv.innerHTML = `
                <a href="/profile.html" class="icon-link">
                    <span class="text-with-icon">
                        <i class="fas fa-user fa-lg"></i>
                        ${username}
                    </span>
                </a>
            `;
        } else {
            headerIconsDiv.innerHTML = `
                <a href="/login.html" class="icon-link">
                    <span class="text-with-icon">
                        <i class="fas fa-user fa-lg"></i>
                        Sign In
                    </span>
                </a>
            `;
        }
    }
};

// Update UI when page loads
document.addEventListener('DOMContentLoaded', () => {
    auth.updateUIElements();
});

// Export the auth object for use in other files
window.auth = auth;
