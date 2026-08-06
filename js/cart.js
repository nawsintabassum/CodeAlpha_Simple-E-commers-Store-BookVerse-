/**
 * BookVerse - Shopping Cart Module
 * Handles adding books to cart, updating quantities, recalculating totals, and storage.
 */

// Retrieve cart items from LocalStorage
function getCart() {
    return JSON.parse(localStorage.getItem('bv_cart')) || [];
}

// Save current cart array to LocalStorage and update badge UI
function saveCart(cart) {
    localStorage.setItem('bv_cart', JSON.stringify(cart));
    updateCartCountBadge();
}

// Update the cart item count badge displayed in the navigation header
function updateCartCountBadge() {
    const cartCountElement = document.getElementById('cartCount');
    if (!cartCountElement) return;

    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

// Add a book to the shopping cart
function addToCart(book, quantity = 1) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === book.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: book.id,
            title: book.title,
            author: book.author,
            price: parseFloat(book.price),
            image: book.image,
            quantity: quantity
        });
    }

    saveCart(cart);
    showToastNotification(`"${book.title}" added to your cart!`);
}

// Update quantity for a specific book item in cart
function updateCartQuantity(bookId, newQuantity) {
    let cart = getCart();
    const parsedQty = parseInt(newQuantity, 10);

    if (parsedQty <= 0) {
        removeFromCart(bookId);
        return;
    }

    const item = cart.find(i => i.id === bookId);
    if (item) {
        item.quantity = parsedQty;
        saveCart(cart);
        renderCartPage();
    }
}

// Remove an item entirely from the cart
function removeFromCart(bookId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== bookId);
    saveCart(cart);
    renderCartPage();
}

// Clear all items from cart
function clearCart() {
    localStorage.removeItem('bv_cart');
    updateCartCountBadge();
}

// Calculate cart totals (subtotal, shipping, tax, total)
function calculateCartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5.00 : 0.00;
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + shipping + tax;

    return {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    };
}

// Render dynamic elements on cart.html page
function renderCartPage() {
    const cartTableBody = document.getElementById('cartTableBody');
    const emptyCartView = document.getElementById('emptyCartView');
    const cartContentView = document.getElementById('cartContentView');

    if (!cartTableBody) return; // Not on cart.html page

    const cart = getCart();

    if (cart.length === 0) {
        if (cartContentView) cartContentView.style.display = 'none';
        if (emptyCartView) emptyCartView.style.display = 'block';
        return;
    }

    if (cartContentView) cartContentView.style.display = 'grid';
    if (emptyCartView) emptyCartView.style.display = 'none';

    cartTableBody.innerHTML = cart.map(item => `
        <tr>
            <td class="cart-product-cell">
                <img src="${item.image}" alt="${item.title}" class="cart-thumb">
                <div>
                    <h4 class="cart-title">${item.title}</h4>
                    <span class="cart-author">by ${item.author}</span>
                </div>
            </td>
            <td class="cart-price">$${item.price.toFixed(2)}</td>
            <td class="cart-quantity">
                <div class="quantity-control">
                    <button type="button" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateCartQuantity(${item.id}, this.value)">
                    <button type="button" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </td>
            <td class="cart-subtotal">$${(item.price * item.quantity).toFixed(2)}</td>
            <td class="cart-actions">
                <button type="button" class="btn-remove" onclick="removeFromCart(${item.id})">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Update Summary Box Values
    const totals = calculateCartTotals();
    if (document.getElementById('cartSubtotal')) document.getElementById('cartSubtotal').textContent = `$${totals.subtotal}`;
    if (document.getElementById('cartShipping')) document.getElementById('cartShipping').textContent = `$${totals.shipping}`;
    if (document.getElementById('cartTax')) document.getElementById('cartTax').textContent = `$${totals.tax}`;
    if (document.getElementById('cartTotal')) document.getElementById('cartTotal').textContent = `$${totals.total}`;
}

// Toast notification trigger
function showToastNotification(message) {
    let toast = document.getElementById('bvToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'bvToast';
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Initialize Cart UI on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    updateCartCountBadge();
    renderCartPage();
});