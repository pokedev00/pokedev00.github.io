document.addEventListener('DOMContentLoaded', function() {
    const redeemButton = document.querySelector('.redeem-btn');
    
    redeemButton.addEventListener('click', function() {
        // Check if user is authenticated
        if (!window.auth || !window.auth.isAuthenticated()) {
            // Use the global dialogManager to show auth error
            window.dialogManager.showAuthErrorDialog();
            return;
        }
        
        // Get the input element
        const inputX = document.querySelector('.code-input');
        
        // Check if input is empty or only contains whitespace
        if (!inputX.value.trim()) {
            inputX.placeholder = 'Please enter a code';
            inputX.style.color = '#dc3545';
            inputX.style.borderColor = '#dc3545';
            inputX.style.borderWidth = '3px';
            
            // Reset error styling after 3 seconds
            setTimeout(() => {
                inputX.placeholder = 'Enter code';
                inputX.style.color = '';
                inputX.style.borderColor = '';
                inputX.style.borderWidth = '';
            }, 3000);
            return;
        }

        // Disable the button temporarily
        redeemButton.disabled = true;
        
        // Create a full screen celebration effect
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Fire multiple confetti bursts for a more dramatic effect
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
        }, 250);

        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });
        }, 400);

        // Get the input element
        const input = document.querySelector('.code-input');
        input.value = '';
        input.placeholder = 'Code redeemed successfully!';
        input.style.color = '#28a745';
        input.style.borderColor = '#28a745';
        input.style.borderWidth = '3px';
        
        // Add a class for the blue placeholder
        input.classList.add('success-placeholder');

        // Reset everything after 5 seconds
        setTimeout(() => {
            redeemButton.disabled = false;
            input.placeholder = 'Enter code';
            input.style.color = '';
            input.style.borderColor = '';
            input.style.borderWidth = '';
            input.classList.remove('success-placeholder');
        }, 5000);
    });
});
