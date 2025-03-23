// Dialog functionality
document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.getElementById('sale-dialog');
    const closeButton = document.querySelector('.close-button');
    const purchaseLink = document.getElementById('purchase-link');
    
    // Function to open dialog with item details
    window.openDialog = function(itemName, imagePath, price) {
        // Update dialog content
        dialog.querySelector('.dialog-image').src = imagePath;
        dialog.querySelector('.dialog-image').alt = itemName;
        dialog.querySelector('.dialog-title').textContent = itemName;
        dialog.querySelector('.purchase-button').textContent = price;
        
        // Create URL with parameters
        const params = new URLSearchParams();
        params.append('name', itemName);
        params.append('image', imagePath);
        params.append('price', price);
        purchaseLink.href = `/addcart.html?${params.toString()}`;
        
        // Show dialog
        dialog.showModal();
        document.body.style.overflow = 'hidden';
    }
    
    // Close dialog when clicking the close button
    closeButton.addEventListener('click', () => {
        dialog.close();
        document.body.style.overflow = 'auto';
    });
    
    // Close dialog when clicking outside
    dialog.addEventListener('click', (e) => {
        const dialogDimensions = dialog.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            dialog.close();
            document.body.style.overflow = 'auto';
        }
    });
});