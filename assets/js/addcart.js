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
});