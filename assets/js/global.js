const AUTH_KEY = 'isAuthenticated';
const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

const auth = {
    isAuthenticated() {
        return localStorage.getItem(AUTH_KEY) === 'true';
    },

    signIn(username = '', userId = null) {
        localStorage.setItem(AUTH_KEY, 'true');
        
        if (username) {
            const currentUser = { username, userId };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
        }
        
        this.updateUIElements();
        
        dialogManager.showSuccessDialog('Login Successful', 'You have successfully signed in!');
    },

    signOut() {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
        this.updateUIElements();
    },

    registerUser(userData) {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        
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
        
        userData.userId = this.generateUserId();
        
        users.push(userData);
        
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        return {
            success: true,
            userId: userData.userId
        };
    },
    
    findUserByCredentials(username, password) {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        return users.find(user => 
            user.username === username && 
            user.password === password
        );
    },
    
    getCurrentUser() {
        if (!this.isAuthenticated()) return null;
        
        const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
        if (!currentUser.userId) return null;
        
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        return users.find(user => user.userId === currentUser.userId) || null;
    },
    
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    updateUIElements() {
        const headerIconsDiv = document.querySelector('.header-icons-x');
        if (!headerIconsDiv) return;

        if (this.isAuthenticated()) {
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

const dialogManager = {
    showAuthErrorDialog(title = 'Sign In Required', message = 'You need to be signed in to redeem codes.', showSignInButton = true) {
        this.removeExistingDialogs();
        
        const dialog = document.createElement('div');
        dialog.className = 'dialog error-dialog';
        
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
        
        document.body.appendChild(dialog);
        
        this.showDialogWithAnimation(dialog);
        
        this.setupDialogEventListeners(dialog);
    },
    
    showSuccessDialog(title = 'Success', message = 'Operation completed successfully') {
        this.removeExistingDialogs();
        
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
        
        document.body.appendChild(dialog);
        
        this.showDialogWithAnimation(dialog);
        
        this.setupDialogEventListeners(dialog);
        
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
    
    removeExistingDialogs() {
        const existingDialogs = document.querySelectorAll('.dialog');
        existingDialogs.forEach(dialog => dialog.remove());
    },
    
    showDialogWithAnimation(dialog) {
        setTimeout(() => {
            dialog.classList.add('show');
        }, 10);
    },
    
    setupDialogEventListeners(dialog) {
        const cancelBtn = dialog.querySelector('.dialog-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                dialog.classList.remove('show');
                setTimeout(() => {
                    dialog.remove();
                }, 300);
            });
        }
        
        const actionBtn = dialog.querySelector('.dialog-action-btn:not(a)');
        if (actionBtn) {
            actionBtn.addEventListener('click', () => {
                dialog.classList.remove('show');
                setTimeout(() => {
                    dialog.remove();
                }, 300);
            });
        }
        
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

document.addEventListener('DOMContentLoaded', () => {
    auth.updateUIElements();
    
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'login_success') {
        dialogManager.showSuccessDialog('Login Successful', 'You have successfully signed in!');
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (action === 'register_success') {
        dialogManager.showSuccessDialog('Registration Successful', 'Your account has been created successfully!');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

window.auth = auth;
window.dialogManager = dialogManager;
