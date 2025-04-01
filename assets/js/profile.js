document.addEventListener('DOMContentLoaded', function() {
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const userData = auth.getCurrentUser();
    
    if (userData) {
        document.querySelector('.card h2').textContent = userData.username;
        document.getElementById('player-id').textContent = userData.playerId || 'No Player ID';
        
        const textMutedElements = document.querySelectorAll('.card .text-muted');
        if (textMutedElements.length >= 3 && userData.email) {
            textMutedElements[2].textContent = userData.email;  
        }
        
    } else {
        console.error('Failed to retrieve user data');
        window.location.href = 'login.html';
    }
});

document.getElementById('signOutButton').addEventListener('click', function(event) {
    event.preventDefault();
    const button = this;
    const overlay = document.getElementById('loadingOverlay');
    
    button.disabled = true;
    overlay.style.display = 'flex';
    
    const audio = new Audio('https://www.myinstants.com/media/sounds/pokemon-heal.mp3');
    audio.play().catch(e => console.log('Audio failed to play'));
    
    auth.signOut();
    
    setTimeout(() => {
        window.location.href = '/';
    }, 2000);
});