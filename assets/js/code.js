document.addEventListener('DOMContentLoaded', function() {
    const redeemButton = document.querySelector('.redeem-btn');
    
    redeemButton.addEventListener('click', function() {
        if (!window.auth || !window.auth.isAuthenticated()) {
            window.dialogManager.showAuthErrorDialog();
            return;
        }
        
        const inputX = document.querySelector('.code-input');
        
        if (!inputX.value.trim()) {
            inputX.placeholder = 'Please enter a code';
            inputX.style.color = '#dc3545';
            inputX.style.borderColor = '#dc3545';
            inputX.style.borderWidth = '3px';
            
            setTimeout(() => {
                inputX.placeholder = 'Enter code';
                inputX.style.color = '';
                inputX.style.borderColor = '';
                inputX.style.borderWidth = '';
            }, 3000);
            return;
        }

        redeemButton.disabled = true;
        
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

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

        const input = document.querySelector('.code-input');
        input.value = '';
        input.placeholder = 'Code redeemed successfully!';
        input.style.color = '#28a745';
        input.style.borderColor = '#28a745';
        input.style.borderWidth = '3px';
        
        input.classList.add('success-placeholder');
        
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
