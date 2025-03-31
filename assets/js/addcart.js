document.addEventListener('DOMContentLoaded', () => {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const itemName = params.get('name');
    const imagePath = params.get('image');
    const price = params.get('price');

    // Update the content if parameters exist
    if (itemName && imagePath && price) {
        document.querySelector('.item-image').src = imagePath;
        document.querySelector('.item-image').alt = itemName;
        document.querySelector('.item-name').textContent = itemName;
        document.querySelector('.item-price').textContent = price;
    }

    // Card number formatting (add spaces every 4 digits)
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
        e.target.value = formattedValue;
    });

    // CVV limitation
    document.getElementById('cvv').addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });
});

function showPaymentContainer() {
    document.querySelector('.checkout-page').style.display = 'none';
    document.querySelector('.payment-container').style.display = 'block';
}

function handlePaymentSubmit(event) {
    event.preventDefault();
    
    // Trigger confetti
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

    // Hide payment form and show success message
    document.querySelector('.payment-container').style.display = 'none';
    document.querySelector('.success-container').style.display = 'block';
}