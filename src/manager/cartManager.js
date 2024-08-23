const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class Cart {
    constructor(id) {
        this.id = id;
        this.products = [];
    }
}

class CartManager {
    constructor() {
        this.carts = [];
        this.filePath = path.join(__dirname, '..', 'data', 'carrito.json');
        this.loadCarts();
    }

    loadCarts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            console.log('No se encontraron datos existentes, comenzando con una lista de carritos vacía.');
        }
    }

    saveCarts() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2));
    }

    createCart() {
        const newCart = new Cart(uuidv4());
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    getCartById(id) {
        const cart = this.carts.find(cart => cart.id === id);
        if (!cart) {
            return { success: false, message: 'Carrito no encontrado' };
        }
        return { success: true, cart };
    }

    addProductToCart(cartId, productId) {
        const cartResult = this.getCartById(cartId);
        if (!cartResult.success) {
            return cartResult;
        }

        const cart = cartResult.cart;
        const productInCart = cart.products.find(p => p.product === productId);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        this.saveCarts();
        return { success: true, message: 'Producto agregado al carrito' };
    }
}

const cartManager = new CartManager();
module.exports = cartManager;
