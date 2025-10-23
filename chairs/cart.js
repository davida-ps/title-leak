// Shopping Cart Management for FurniLux Store

const Cart = {
    // Get cart from sessionStorage
    getCart() {
        const cart = sessionStorage.getItem('furnilux_cart');
        return cart ? JSON.parse(cart) : [];
    },

    // Save cart to sessionStorage
    saveCart(cart) {
        sessionStorage.setItem('furnilux_cart', JSON.stringify(cart));
        this.updateCartCount();
    },

    // Add item to cart
    addItem(product) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        this.saveCart(cart);
        return cart;
    },

    // Remove item from cart
    removeItem(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
        return cart;
    },

    // Update item quantity
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);

        if (item) {
            if (quantity <= 0) {
                return this.removeItem(productId);
            }
            item.quantity = quantity;
            this.saveCart(cart);
        }

        return cart;
    },

    // Get cart count
    getCartCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Update cart count badge in header
    updateCartCount() {
        const countElements = document.querySelectorAll('.cart-count');
        const count = this.getCartCount();

        countElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'inline-block' : 'none';
        });
    },

    // Calculate subtotal
    getSubtotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Calculate discount (30% off - Store Happening)
    getDiscount() {
        return this.getSubtotal() * 0.30;
    },

    // Calculate total
    getTotal() {
        return this.getSubtotal() - this.getDiscount();
    },

    // Clear cart
    clearCart() {
        sessionStorage.removeItem('furnilux_cart');
        this.updateCartCount();
    }
};

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    Cart.updateCartCount();
});

// Add to cart button handler
function addToCart(productId, productName, productPrice, productImage) {
    Cart.addItem({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage
    });

    // Show confirmation
    showNotification(`${productName} added to cart!`);
}

// Show notification
function showNotification(message) {
    // Remove existing notification if any
    const existing = document.querySelector('.cart-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles
if (!document.querySelector('#cart-animations')) {
    const style = document.createElement('style');
    style.id = 'cart-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
