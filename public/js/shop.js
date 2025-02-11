let cart = [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const size = document.querySelector(`#${productId} .size-select`)?.value;
    
    cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        size: size,
        quantity: 1
    });
    
    updateCartDisplay();
    saveCart();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>${item.size ? `Size: ${item.size}` : ''}</span>
            <span>$${(item.price * item.quantity / 100).toFixed(2)}</span>
            <button onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = (total / 100).toFixed(2);
    
    // Update cart count in navigation
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('navCartCount').textContent = cartCount;
    document.getElementById('mobileCartCount').textContent = cartCount;
}

async function checkout() {
    try {
        const response = await fetch('/shop/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items: cart })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Order placed successfully!');
            cart = [];
            updateCartDisplay();
            saveCart();
        } else {
            alert('Failed to place order. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    }
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCartDisplay();
        saveCart();
    }
}

// Load cart from localStorage if available
window.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
});

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

async function processCheckout(event) {
    event.preventDefault();
    
    const form = event.target;
    const customerInfo = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        address: form.address.value
    };

    try {
        const response = await fetch('/shop/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cart,
                customerInfo: customerInfo
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Store order ID in localStorage for success page
            localStorage.setItem('lastOrderId', result.orderId);
            // Clear cart
            cart = [];
            saveCart();
            // Redirect to success page
            window.location.href = '/shop/success';
        } else {
            alert('Failed to place order: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    }
}

// Function to update detailed cart view
function updateDetailedCart() {
    const cartItemsContainer = document.getElementById('cart-items-detailed');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item-detailed">
            <div class="item-image">
                <img src="/images/merchandise/${item.id}.jpg" alt="${item.name}">
            </div>
            <div class="item-info">
                <h3>${item.name}</h3>
                ${item.size ? `<p>Size: ${item.size}</p>` : ''}
            </div>
            <div class="item-quantity">
                <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <div class="item-price">
                $${(item.price * item.quantity / 100).toFixed(2)}
            </div>
            <button onclick="removeFromCart('${item.id}')" class="remove-btn">Remove</button>
        </div>
    `).join('');

    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    document.getElementById('cart-subtotal').textContent = `$${(subtotal / 100).toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${(tax / 100).toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${(total / 100).toFixed(2)}`;
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateDetailedCart();
        saveCart();
    }
}

// Initialize cart page if we're on it
if (window.location.pathname === '/shop/cart') {
    updateDetailedCart();
}

// Display order ID on success page
if (window.location.pathname === '/shop/success') {
    const orderId = localStorage.getItem('lastOrderId');
    if (orderId) {
        document.getElementById('orderId').textContent = orderId;
        localStorage.removeItem('lastOrderId');
    }
} 