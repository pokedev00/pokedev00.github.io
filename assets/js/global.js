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
        const userIcon = document.querySelector('.header-icons .icon-link i');
        
        if (this.isAuthenticated()) {
            userIcon?.classList.remove('fa-user');
            userIcon?.classList.add('fa-user-check');
        } else {
            userIcon?.classList.remove('fa-user-check');
            userIcon?.classList.add('fa-user');
        }
    }
};

// Update UI when page loads
document.addEventListener('DOMContentLoaded', () => {
    auth.updateUIElements();
});

// Export the auth object for use in other files
window.auth = auth;
