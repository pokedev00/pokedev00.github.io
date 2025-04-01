// Carousel functionality
document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.getElementById('sale-dialog');
    const closeButton = document.querySelector('.close-button');
    const priceDisplay = document.getElementById('price-display');
    
    // Cart elements
    const cartButton = document.getElementById('cartButton');
    const cartPanel = document.getElementById('cartPanel');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotalItems = document.getElementById('cartTotalItems');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const cartUsername = document.getElementById('cartUsername');
    
    // Check if user is authenticated
    function isUserAuthenticated() {
        return window.auth && window.auth.isAuthenticated();
    }
    
    // Set cart button visibility based on auth status
    function updateCartButtonVisibility() {
        if (isUserAuthenticated()) {
            cartButton.style.display = 'flex';
        } else {
            cartButton.style.display = 'none';
        }
    }
    
    // Set the username in the cart header
    function updateCartUsername() {
        // Check if user is authenticated
        if (isUserAuthenticated()) {
            // Get current user data
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (currentUser.username) {
                cartUsername.textContent = currentUser.username + "'s";
            } else {
                cartUsername.textContent = "My";
            }
        } else {
            cartUsername.textContent = "My";
        }
    }
    
    // Call these functions to initialize the UI
    updateCartUsername();
    updateCartButtonVisibility();
    
    // Create backdrop for cart
    const backdrop = document.createElement('div');
    backdrop.className = 'cart-backdrop';
    document.body.appendChild(backdrop);
    
    // Function to open dialog with item details
    window.openDialog = function(itemName, imagePath, price) {
        // Update dialog content
        dialog.querySelector('.dialog-image').src = imagePath;
        dialog.querySelector('.dialog-image').alt = itemName;
        dialog.querySelector('.dialog-title').textContent = itemName;
        priceDisplay.textContent = price;
        
        // Show dialog
        dialog.showModal();
        document.body.style.overflow = 'hidden';
    }
    
    // Function to add item to cart
    window.addToCart = function(itemName, imagePath, price) {
        // Check if user is authenticated
        if (!isUserAuthenticated()) {
            // Show error for non-authenticated users
            if (window.dialogManager && typeof window.dialogManager.showAuthErrorDialog === 'function') {
                window.dialogManager.showAuthErrorDialog('Sign In Required', 'You need to be signed in to add items to your cart.');
            } else {
                alert('Please sign in to add items to your cart.');
            }
            return;
        }
        
        // Get existing cart items or initialize empty array
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        
        // Check if item already exists in cart
        const existingItemIndex = cartItems.findIndex(item => 
            item.name === itemName && item.image === imagePath
        );
        
        if (existingItemIndex !== -1) {
            // Increment quantity if item already exists
            cartItems[existingItemIndex].quantity += 1;
        } else {
            // Add new item to cart
            cartItems.push({
                name: itemName,
                image: imagePath,
                price: price,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Update cart UI
        updateCartUI();
        
        // Show success feedback
        showAddToCartFeedback();
    }
    
    // Function to show feedback when item is added to cart
    function showAddToCartFeedback() {
        // Create a toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Item added to cart!</span>
        `;
        
        // Add to document
        document.body.appendChild(toast);
        
        // Trigger animation with a small delay
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Function to update cart UI
    function updateCartUI() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart count
        cartCount.textContent = itemCount;
        cartTotalItems.textContent = `(${itemCount})`;
        
        // Render cart items
        renderCartItems();
        
        // Calculate and update subtotal
        updateSubtotal();
    }
    
    // Function to render cart items
    function renderCartItems() {
        const cartItemsData = JSON.parse(localStorage.getItem('cartItems') || '[]');
        cartItems.innerHTML = '';
        
        if (cartItemsData.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }
        
        cartItemsData.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">${item.price}</p>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn minus" data-index="${index}">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn plus" data-index="${index}">+</button>
                        </div>
                        <span class="remove-item" data-index="${index}">remove</span>
                    </div>
                </div>
            `;
            
            cartItems.appendChild(itemElement);
        });
        
        // Add event listeners to quantity buttons and remove links
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.remove-item').forEach(link => {
            link.addEventListener('click', removeItem);
        });
    }
    
    // Function to increase item quantity
    function increaseQuantity() {
        const index = this.dataset.index;
        const cartItemsData = JSON.parse(localStorage.getItem('cartItems') || '[]');
        
        cartItemsData[index].quantity += 1;
        localStorage.setItem('cartItems', JSON.stringify(cartItemsData));
        
        updateCartUI();
    }
    
    // Function to decrease item quantity
    function decreaseQuantity() {
        const index = this.dataset.index;
        const cartItemsData = JSON.parse(localStorage.getItem('cartItems') || '[]');
        
        if (cartItemsData[index].quantity > 1) {
            cartItemsData[index].quantity -= 1;
            localStorage.setItem('cartItems', JSON.stringify(cartItemsData));
        } else {
            removeItemFromCart(index);
        }
        
        updateCartUI();
    }
    
    // Function to remove item from cart
    function removeItem() {
        const index = this.dataset.index;
        removeItemFromCart(index);
        updateCartUI();
    }
    
    // Helper function to remove item from cart
    function removeItemFromCart(index) {
        const cartItemsData = JSON.parse(localStorage.getItem('cartItems') || '[]');
        cartItemsData.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItemsData));
    }
    
    // Function to update subtotal
    function updateSubtotal() {
        const cartItemsData = JSON.parse(localStorage.getItem('cartItems') || '[]');
        let total = 0;
        
        cartItemsData.forEach(item => {
            // Extract numeric value from price (remove currency symbol and commas)
            const priceValue = parseFloat(item.price.replace(/[^\d.-]/g, ''));
            total += priceValue * item.quantity;
        });
        
        // Format with peso sign and two decimal places
        subtotalAmount.textContent = `₱${total.toFixed(2)}`;
    }
    
    // Toggle cart panel
    cartButton.addEventListener('click', () => {
        // Update username before showing the cart
        updateCartUsername();
        
        cartPanel.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
    
    // Close cart panel
    closeCart.addEventListener('click', () => {
        cartPanel.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = 'auto';
    });
    
    // Close cart when clicking on backdrop
    backdrop.addEventListener('click', () => {
        cartPanel.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = 'auto';
    });
    
    // Clear cart button
    clearCartBtn.addEventListener('click', () => {
        localStorage.setItem('cartItems', '[]');
        updateCartUI();
    });
    
    // Initialize cart UI
    updateCartUI();
    
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

    // Fixed carousel functionality
    const carousel = {
        currentSlideIndex: 0,
        slides: document.querySelectorAll('.carousel-slide'),
        dots: document.querySelectorAll('.dot'),
        prevButton: document.querySelector('.carousel-button.prev'),
        nextButton: document.querySelector('.carousel-button.next'),
        autoPlayInterval: null,

        init() {
            if (!this.slides.length) return;
            
            // Make sure there's an active slide
            if (!document.querySelector('.carousel-slide.active')) {
                this.slides[0].classList.add('active');
            }
            
            // Make sure there's an active dot
            if (!document.querySelector('.dot.active')) {
                this.dots[0].classList.add('active');
            }
            
            // Add event listeners for buttons
            this.prevButton.addEventListener('click', () => this.moveSlide(-1));
            this.nextButton.addEventListener('click', () => this.moveSlide(1));

            // Add event listeners for dots
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });
            
            // Enable item image interactivity
            document.querySelectorAll('.carousel-slide .items img').forEach(img => {
                img.style.pointerEvents = 'auto';
                img.style.cursor = 'pointer';
            });
            
            this.startAutoPlay();
        },

        showSlide(index) {
            this.slides.forEach(slide => slide.classList.remove('active'));
            this.dots.forEach(dot => dot.classList.remove('active'));

            this.slides[index].classList.add('active');
            this.dots[index].classList.add('active');
            this.currentSlideIndex = index;
        },

        moveSlide(direction) {
            const newIndex = (this.currentSlideIndex + direction + this.slides.length) % this.slides.length;
            this.goToSlide(newIndex);
        },

        goToSlide(index) {
            this.showSlide(index);
            this.resetAutoPlay();
        },

        startAutoPlay() {
            this.autoPlayInterval = setInterval(() => {
                this.moveSlide(1);
            }, 5000); // Change slide every 5 seconds
        },

        resetAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.startAutoPlay();
            }
        }
    };

    // Initialize carousel
    carousel.init();

    // Add payment method dialog creation
    const paymentDialog = document.createElement('dialog');
    paymentDialog.className = 'payment-dialog';
    paymentDialog.innerHTML = `
        <button class="close-button payment-close-btn">
            <i class="fas fa-times fa-lg"></i>
        </button>
        
        <div class="payment-dialog-content">
            <h2>Select Payment Method</h2>
            <div class="payment-options">
                <div class="payment-option" data-method="credit">
                    <i class="fas fa-credit-card"></i>
                    <span>Credit Card</span>
                </div>
                <div class="payment-option" data-method="paypal">
                    <i class="fab fa-paypal"></i>
                    <span>PayPal</span>
                </div>
                <div class="payment-option" data-method="gcash">
                    <i class="fas fa-wallet"></i>
                    <span>GCash</span>
                </div>
                <div class="payment-option" data-method="bank">
                    <i class="fas fa-university"></i>
                    <span>Bank Transfer</span>
                </div>
            </div>
            <button class="proceed-payment-btn" disabled>Proceed to Payment</button>
        </div>
    `;
    document.body.appendChild(paymentDialog);
    
    // Add event listeners for payment dialog
    const paymentCloseBtn = paymentDialog.querySelector('.payment-close-btn');
    const paymentOptions = paymentDialog.querySelectorAll('.payment-option');
    const proceedPaymentBtn = paymentDialog.querySelector('.proceed-payment-btn');
    let selectedPaymentMethod = null;
    
    paymentCloseBtn.addEventListener('click', () => {
        paymentDialog.close();
        document.body.style.overflow = 'auto';
    });
    
    // Handle payment option selection
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selection from all options
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selection to clicked option
            option.classList.add('selected');
            
            // Enable proceed button
            selectedPaymentMethod = option.dataset.method;
            proceedPaymentBtn.removeAttribute('disabled');
        });
    });
    
    // Handle proceed button click
    proceedPaymentBtn.addEventListener('click', () => {
        if (selectedPaymentMethod) {
            // Close the payment method dialog
            paymentDialog.close();
            
            // Create and show a persistent success dialog
            const successDialog = document.createElement('dialog');
            successDialog.className = 'payment-success-dialog';
            successDialog.innerHTML = `
                <div class="payment-success-content">
                    <h2>Order Completed</h2>
                    <p>Your order has been processed.</p>
                    <button class="close-success-dialog">Close</button>
                </div>
            `;
            document.body.appendChild(successDialog);
            
            // Add event listener for the close button
            const closeSuccessBtn = successDialog.querySelector('.close-success-dialog');
            closeSuccessBtn.addEventListener('click', () => {
                successDialog.close();
                successDialog.remove();
                // Close the cart panel after closing success dialog
                cartPanel.classList.remove('open');
                backdrop.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
            
            // Show the success dialog
            successDialog.showModal();
            
            // Clear the cart after successful payment
            localStorage.setItem('cartItems', '[]');
            updateCartUI();
        }
    });
    
    // Handle checkout button click
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        // Check if cart is empty
        const cartItemsData = JSON.parse(localStorage.getItem('cartItems') || '[]');
        if (cartItemsData.length === 0) {
            if (window.dialogManager && typeof window.dialogManager.showErrorDialog === 'function') {
                window.dialogManager.showErrorDialog('Empty Cart', 'Your cart is empty. Add items before checkout.');
            } else {
                alert('Your cart is empty. Add items before checkout.');
            }
            return;
        }
        
        // Show payment method selection dialog
        selectedPaymentMethod = null;
        paymentOptions.forEach(opt => opt.classList.remove('selected'));
        proceedPaymentBtn.setAttribute('disabled', 'true');
        paymentDialog.showModal();
    });
});