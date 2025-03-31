// Check authentication status when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (!auth.isAuthenticated()) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
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
        window.location.href = 'login.html';
    }, 2000);
});