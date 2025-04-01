// Check authentication status when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (!auth.isAuthenticated()) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }

    // Get the complete user data using the new helper method
    const userData = auth.getCurrentUser();
    
    if (userData) {
        // Update profile information
        document.querySelector('.card h2').textContent = userData.username;
        document.getElementById('player-id').textContent = userData.playerId || 'No Player ID';
        
        // Update email if available (3rd text-muted paragraph)
        const textMutedElements = document.querySelectorAll('.card .text-muted');
        if (textMutedElements.length >= 3 && userData.email) {
            textMutedElements[2].textContent = userData.email;
        }
        
        // If there's more user info you want to display, add it here
    } else {
        console.error('Failed to retrieve user data');
        // Optionally redirect to login if user data can't be found
        // window.location.href = 'login.html';
    }
});

document.getElementById('signOutButton').addEventListener('click', function(event) {
    event.preventDefault();
    const button = this;
    const overlay = document.getElementById('loadingOverlay');
    
    // Disable button and show overlay
    button.disabled = true;
    overlay.style.display = 'flex';
    
    // Play Pokemon sound (optional)
    const audio = new Audio('https://www.myinstants.com/media/sounds/pokemon-heal.mp3');
    audio.play().catch(e => console.log('Audio failed to play'));
    
    // Sign out using the global auth system
    auth.signOut();
    
    // Redirect after animation
    setTimeout(() => {
        window.location.href = '/';
    }, 2000);
});