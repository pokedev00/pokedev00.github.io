// Carousel functionality
document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.getElementById('sale-dialog');
    const closeButton = document.querySelector('.close-button');
    const priceDisplay = document.getElementById('price-display');
    
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
        // Get existing cart items or initialize empty array
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        
        // Add new item to cart
        cartItems.push({
            name: itemName,
            image: imagePath,
            price: price,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
        
        // Save updated cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Show success feedback (you could use the dialog system or a toast notification)
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
        
        // Trigger animation
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
});