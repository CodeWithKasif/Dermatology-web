class CartAPI {
    constructor() {
      this.cart = JSON.parse(localStorage.getItem('cart')) || [];
      this.initCart();
    }
  
    initCart() {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupEventListeners();
        this.updateCartCounter();
        this.renderCart();
      });
    }
  
  
    addItem(item) {
      const existingItem = this.cart.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cart.push({ ...item, quantity: 1 });
      }
      this.saveCart();
      this.updateCartCounter();
      this.renderCart();
    }
  
    removeItem(itemId) {
        const itemIndex = this.cart.findIndex(i => i.id === itemId);
        if (itemIndex > -1) {
          this.cart.splice(itemIndex, 1);
          this.saveCart();
          this.updateCartCounter();
          this.renderCart();
          if (this.cart.length === 0) this.toggleCart();
        }
      }
  
    updateQuantity(itemId, newQuantity) {
      const item = this.cart.find(i => i.id === itemId);
      if (item) {
        item.quantity = newQuantity;
        if (item.quantity <= 0) this.removeItem(itemId);
        this.saveCart();
        this.renderCart();
      }
    }
  
    calculateTotal() {
      return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
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
            <p>$${item.price.toFixed(2)}</p>
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
        if (e.target.closest('.add-to-cart')) {
          const button = e.target.closest('.add-to-cart');
          const productCard = button.closest('.card');
          const item = {
            id: productCard.dataset.productId,
            name: productCard.querySelector('h3').textContent,
            price: parseFloat(productCard.querySelector('.price').textContent.replace('$', '')),
            image: productCard.querySelector('img').src
          };
          this.addItem(item);
        }
      });
    }
  
    toggleCart() {
      const sidebar = document.getElementById('cartSidebar');
      const overlay = document.getElementById('overlay');
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    }
  }
  
  // Initialize the cart API
  window.cartAPI = new CartAPI();
  