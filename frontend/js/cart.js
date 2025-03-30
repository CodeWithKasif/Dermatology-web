class CartAPI {
    constructor() {
        this.cart = []; // Initialize empty array
        this.initCart();
    }

    initCart() {
        this.setupEventListeners();
        this.updateCartCounter();
        this.renderCart();
    }

    addItem(item) {
        const existingItem = this.cart.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({ 
                ...item,
                quantity: 1,
                id: String(item.id)
            });
        }
        this.updateCartCounter();
        this.renderCart();
    }

    removeItem(itemId) {
        this.cart = this.cart.filter(i => i.id !== itemId);
        this.updateCartCounter();
        this.renderCart();
    }

    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(i => i.id === itemId);
        if (item) {
            item.quantity = Math.max(0, newQuantity);
            if (item.quantity <= 0) this.removeItem(itemId);
            this.renderCart();
        }
    }

    calculateTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartCounter() {
        const counter = document.getElementById('cart-counter');
        if (counter) {
            counter.textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;
        
        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Rs${item.price.toFixed(2)}</p>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="cartAPI.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="cartAPI.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="cartAPI.removeItem('${item.id}')">Remove</button>
            </div>
        `).join('');
        
        document.getElementById('cartTotal').textContent = this.calculateTotal().toFixed(2);
    }

    setupEventListeners() {
        document.body.addEventListener('click', (e) => {
            const button = e.target.closest('.add-to-cart');
            if (button) {
                const productCard = button.closest('.card');
                const priceText = productCard.querySelector('.price').textContent;
                
                const item = {
                    id: productCard.dataset.productId,
                    name: productCard.querySelector('h3').textContent,
                    price: parseFloat(priceText.replace('Rs', '')),
                    image: productCard.querySelector('img').src
                };
                this.addItem(item);
            }
        });

        document.querySelector('.checkout-btn')?.addEventListener('click', () => {
            this.toggleCart();
            window.location.href = '/frontend/chckout.html';
        });
    }

    toggleCart() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : 'auto';
        }
    }
}

window.cartAPI = new CartAPI();