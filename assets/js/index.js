document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.getElementById('sale-dialog');
    const closeButton = document.querySelector('.close-button');
    const priceDisplay = document.getElementById('price-display');
    
    const cartButton = document.getElementById('cartButton');
    const cartPanel = document.getElementById('cartPanel');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotalItems = document.getElementById('cartTotalItems');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const cartUsername = document.getElementById('cartUsername');
    
    function isUserAuthenticated() {
        return window.auth && window.auth.isAuthenticated();
    }
    
    function updateCartButtonVisibility() {
        if (isUserAuthenticated()) {
            cartButton.style.display = 'flex';
        } else {
            cartButton.style.display = 'none';
        }
    }
    
    function updateCartUsername() {
        if (isUserAuthenticated()) {
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
    
    updateCartUsername();
    updateCartButtonVisibility();
    
    const backdrop = document.createElement('div');
    backdrop.className = 'cart-backdrop';
    document.body.appendChild(backdrop);
    
    window.openDialog = function(itemName, imagePath, price) {
        dialog.querySelector('.dialog-image').src = imagePath;
        dialog.querySelector('.dialog-image').alt = itemName;
        dialog.querySelector('.dialog-title').textContent = itemName;
        priceDisplay.textContent = price;
        
        dialog.showModal();
        document.body.style.overflow = 'hidden';
    }
    
    window.addToCart = function(itemName, imagePath, price) {
        if (!isUserAuthenticated()) {
            if (window.dialogManager && typeof window.dialogManager.showAuthErrorDialog === 'function') {
                window.dialogManager.showAuthErrorDialog('Sign In Required', 'You need to be signed in to add items to your cart.');
            } else {
                alert('Please sign in to add items to your cart.');
            }
            return;
        }
        
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        
        const existingItemIndex = cartItems.findIndex(item => 
            item.name === itemName && item.image === imagePath
        );
        
        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity += 1;
        } else {
            cartItems.push({
                name: itemName,
                image: imagePath,
                price: price,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        updateCartUI();
        
        showAddToCartFeedback();
    }
    
    function showAddToCartFeedback() {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Item added to cart!</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    function updateCartUI() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        
        cartCount.textContent = itemCount;
        cartTotalItems.textContent = `(${itemCount})`;
        
        renderCartItems();
        
        updateSubtotal();
    }
    
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
    
    function increaseQuantity() {
        const index = this.dataset.index;
        const cartItemsData = JSON.parse(localStorage.getItem('cartItems') || '[]');
        
        cartItemsData[index].quantity += 1;
        localStorage.setItem('cartItems', JSON.stringify(cartItemsData));
        
        updateCartUI();
    }
    
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
    
    function removeItem() {
        const index = this.dataset.index;
        removeItemFromCart(index);
        updateCartUI();
    }
    
    function removeItemFromCart(index) {
        const cartItemsData = JSON.parse(localStorage.getItem('cartItems') || '[]');
        cartItemsData.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItemsData));
    }
    
    function updateSubtotal() {
        const cartItemsData = JSON.parse(localStorage.getItem('cartItems') || '[]');
        let total = 0;
        
        cartItemsData.forEach(item => {
            const priceValue = parseFloat(item.price.replace(/[^\d.-]/g, ''));
            total += priceValue * item.quantity;
        });
        
        subtotalAmount.textContent = `₱${total.toFixed(2)}`;
    }
    
    cartButton.addEventListener('click', () => {
        updateCartUsername();
        
        cartPanel.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
    
    closeCart.addEventListener('click', () => {
        cartPanel.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = 'auto';
    });
    
    backdrop.addEventListener('click', () => {
        cartPanel.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = 'auto';
    });
    
    clearCartBtn.addEventListener('click', () => {
        localStorage.setItem('cartItems', '[]');
        updateCartUI();
    });
    
    updateCartUI();
    
    closeButton.addEventListener('click', () => {
        dialog.close();
        document.body.style.overflow = 'auto';
    });
    
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

    const carousel = {
        currentSlideIndex: 0,
        slides: document.querySelectorAll('.carousel-slide'),
        dots: document.querySelectorAll('.dot'),
        prevButton: document.querySelector('.carousel-button.prev'),
        nextButton: document.querySelector('.carousel-button.next'),
        autoPlayInterval: null,

        init() {
            if (!this.slides.length) return;
            
            if (!document.querySelector('.carousel-slide.active')) {
                this.slides[0].classList.add('active');
            }
            
            if (!document.querySelector('.dot.active')) {
                this.dots[0].classList.add('active');
            }
            
            this.prevButton.addEventListener('click', () => this.moveSlide(-1));
            this.nextButton.addEventListener('click', () => this.moveSlide(1));

            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });
            
            document.querySelectorAll('.carousel-slide .items img').forEach(img => {
                img.style.pointerEvents = 'auto';
                img.style.cursor = 'pointer';
            });
            
            this.startAutoPlay();
        },

        showSlide(index) {
            const direction = index > this.currentSlideIndex ? 1 : -1;
            
            const currentSlide = this.slides[this.currentSlideIndex];
            
            this.slides.forEach(slide => {
                slide.classList.remove('active', 'prev');
            });
            
            this.dots.forEach(dot => dot.classList.remove('active'));
            this.dots[index].classList.add('active');
            
            if (direction < 0) {
                currentSlide.classList.add('prev');
            }
            
            this.slides[index].classList.add('active');
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
            }, 5000);
        },

        resetAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.startAutoPlay();
            }
        }
    };

    carousel.init();

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
    
    const paymentCloseBtn = paymentDialog.querySelector('.payment-close-btn');
    const paymentOptions = paymentDialog.querySelectorAll('.payment-option');
    const proceedPaymentBtn = paymentDialog.querySelector('.proceed-payment-btn');
    let selectedPaymentMethod = null;
    
    paymentCloseBtn.addEventListener('click', () => {
        paymentDialog.close();
        document.body.style.overflow = 'auto';
    });
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            
            option.classList.add('selected');
            
            selectedPaymentMethod = option.dataset.method;
            proceedPaymentBtn.removeAttribute('disabled');
        });
    });
    
    proceedPaymentBtn.addEventListener('click', () => {
        if (selectedPaymentMethod) {
            paymentDialog.close();
            
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
            
            const closeSuccessBtn = successDialog.querySelector('.close-success-dialog');
            closeSuccessBtn.addEventListener('click', () => {
                successDialog.close();
                successDialog.remove();
                cartPanel.classList.remove('open');
                backdrop.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
            
            successDialog.showModal();
            
            localStorage.setItem('cartItems', '[]');
            updateCartUI();
        }
    });
    
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        const cartItemsData = JSON.parse(localStorage.getItem('cartItems') || '[]');
        if (cartItemsData.length === 0) {
            if (window.dialogManager && typeof window.dialogManager.showErrorDialog === 'function') {
                window.dialogManager.showErrorDialog('Empty Cart', 'Your cart is empty. Add items before checkout.');
            } else {
                alert('Your cart is empty. Add items before checkout.');
            }
            return;
        }
        
        selectedPaymentMethod = null;
        paymentOptions.forEach(opt => opt.classList.remove('selected'));
        proceedPaymentBtn.setAttribute('disabled', 'true');
        paymentDialog.showModal();
    });
});