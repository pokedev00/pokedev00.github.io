// Simple auth state management
const AUTH_KEY = 'isAuthenticated';
const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

const auth = {
    // Check if user is authenticated
    isAuthenticated() {
        return localStorage.getItem(AUTH_KEY) === 'true';
    },

    // Sign in user
    signIn(username = '', userId = null) {
        localStorage.setItem(AUTH_KEY, 'true');
        
        // Store current user info
        if (username) {
            const currentUser = { username, userId };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
        }
        
        this.updateUIElements();
        
        // Show success dialog
        dialogManager.showSuccessDialog('Login Successful', 'You have successfully signed in!');
    },

    // Sign out user
    signOut() {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
        this.updateUIElements();
    },

    // Register a new user
    registerUser(userData) {
        // Get existing users or initialize empty array
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        
        // Check if username or email already exists
        const userExists = users.some(user => 
            user.username === userData.username || 
            user.email === userData.email
        );
        
        if (userExists) {
            return {
                success: false,
                message: 'Username or email already exists'
            };
        }
        
        // Add userId to the user data
        userData.userId = this.generateUserId();
        
        // Add the new user
        users.push(userData);
        
        // Save to localStorage
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        return {
            success: true,
            userId: userData.userId
        };
    },
    
    // Find user by credentials
    findUserByCredentials(username, password) {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        return users.find(user => 
            user.username === username && 
            user.password === password
        );
    },
    
    // Get current user data
    getCurrentUser() {
        if (!this.isAuthenticated()) return null;
        
        const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
        if (!currentUser.userId) return null;
        
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        return users.find(user => user.userId === currentUser.userId) || null;
    },
    
    // Generate a unique user ID
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Update UI elements based on auth state
    updateUIElements() {
        const headerIconsDiv = document.querySelector('.header-icons-x');
        if (!headerIconsDiv) return;

        if (this.isAuthenticated()) {
            // Get current user data from localStorage
            const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
            const username = currentUser.username || 'Profile';

            headerIconsDiv.innerHTML = `
                <a href="/profile.html" class="icon-link-x">
                    <span class="text-with-icon-x">
                        <i class="fas fa-user fa-lg"></i>
                        ${username}
                    </span>
                </a>
            `;
        } else {
            headerIconsDiv.innerHTML = `
                <a href="/login.html" class="icon-link-x">
                    <span class="text-with-icon-x">
                        <i class="fas fa-user fa-lg"></i>
                        Sign In
                    </span>
                </a>
            `;
        }
    }
};

// Dialog manager for all types of dialogs
const dialogManager = {
    // Show auth error dialog
    showAuthErrorDialog(title = 'Sign In Required', message = 'You need to be signed in to redeem codes.', showSignInButton = true) {
        // Remove any existing dialogs
        this.removeExistingDialogs();
        
        // Create the error dialog
        const dialog = document.createElement('div');
        dialog.className = 'dialog error-dialog';
        
        // Prepare buttons HTML based on showSignInButton flag
        let buttonsHtml = '';
        if (showSignInButton) {
            buttonsHtml = `
                <div class="dialog-buttons">
                    <button class="dialog-cancel-btn">Cancel</button>
                    <a href="/login.html" class="dialog-action-btn">Sign In</a>
                </div>
            `;
        } else {
            buttonsHtml = `
                <div class="dialog-buttons">
                    <button class="dialog-action-btn">OK</button>
                </div>
            `;
        }
        
        dialog.innerHTML = `
            <div class="dialog-content error-dialog-content">
                <div class="dialog-header error-header">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>${title}</h3>
                </div>
                <p>${message}</p>
                ${buttonsHtml}
            </div>
        `;
        
        // Add to the document
        document.body.appendChild(dialog);
        
        // Show the dialog with animation
        this.showDialogWithAnimation(dialog);
        
        // Setup event listeners
        this.setupDialogEventListeners(dialog);
    },
    
    // Show success dialog
    showSuccessDialog(title = 'Success', message = 'Operation completed successfully') {
        // Remove any existing dialogs
        this.removeExistingDialogs();
        
        // Create the success dialog
        const dialog = document.createElement('div');
        dialog.className = 'dialog success-dialog';
        dialog.innerHTML = `
            <div class="dialog-content success-dialog-content">
                <div class="dialog-header success-header">
                    <i class="fas fa-check-circle"></i>
                    <h3>${title}</h3>
                </div>
                <p>${message}</p>
                <div class="dialog-buttons">
                    <button class="dialog-action-btn">OK</button>
                </div>
            </div>
        `;
        
        // Add to the document
        document.body.appendChild(dialog);
        
        // Show the dialog with animation
        this.showDialogWithAnimation(dialog);
        
        // Setup event listeners
        this.setupDialogEventListeners(dialog);
        
        // Auto close after 3 seconds
        setTimeout(() => {
            if (document.body.contains(dialog)) {
                dialog.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(dialog)) {
                        dialog.remove();
                    }
                }, 300);
            }
        }, 3000);
    },
    
    // Helper method to remove any existing dialogs
    removeExistingDialogs() {
        const existingDialogs = document.querySelectorAll('.dialog');
        existingDialogs.forEach(dialog => dialog.remove());
    },
    
    // Helper method to show dialog with animation
    showDialogWithAnimation(dialog) {
        setTimeout(() => {
            dialog.classList.add('show');
        }, 10);
    },
    
    // Helper method to setup dialog event listeners
    setupDialogEventListeners(dialog) {
        // Handle cancel button if it exists
        const cancelBtn = dialog.querySelector('.dialog-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                dialog.classList.remove('show');
                setTimeout(() => {
                    dialog.remove();
                }, 300);
            });
        }
        
        // Handle action button if it's not a link
        const actionBtn = dialog.querySelector('.dialog-action-btn:not(a)');
        if (actionBtn) {
            actionBtn.addEventListener('click', () => {
                dialog.classList.remove('show');
                setTimeout(() => {
                    dialog.remove();
                }, 300);
            });
        }
        
        // Close when clicking outside the dialog
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.classList.remove('show');
                setTimeout(() => {
                    dialog.remove();
                }, 300);
            }
        });
    }
};

// Update UI when page loads
document.addEventListener('DOMContentLoaded', () => {
    auth.updateUIElements();
    
    // Check URL params for success messages
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'login_success') {
        dialogManager.showSuccessDialog('Login Successful', 'You have successfully signed in!');
        // Clean URL after showing dialog
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (action === 'register_success') {
        dialogManager.showSuccessDialog('Registration Successful', 'Your account has been created successfully!');
        // Clean URL after showing dialog
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// Export the objects for use in other files
window.auth = auth;
window.dialogManager = dialogManager;
