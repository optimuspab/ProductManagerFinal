const Cart = require('../models/carts');
const { v4: uuidv4 } = require('uuid');

class CartManager {
    constructor() {
        this.carts = [];
    }

    async createCart() {
        const newCart = new Cart({
            id: uuidv4(),
            products: []
        });

        try {
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            return { success: false, message: 'Error al crear el carrito' };
        }
    }

    async getCartById(id) {
        try {
            const cart = await Cart.findOne({ id }).populate('products.product').exec();
            if (!cart) {
                return { success: false, message: 'Carrito no encontrado' };
            }
            return { success: true, cart };
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            return { success: false, message: 'Error al obtener el carrito' };
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cartResult = await this.getCartById(cartId);
            if (!cartResult.success) {
                return cartResult;
            }

            const cart = cartResult.cart;
            const productInCart = cart.products.find(p => p.product.toString() === productId);

            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();
            return { success: true, message: 'Producto agregado al carrito' };
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return { success: false, message: 'Error al agregar producto al carrito' };
        }
    }
}

const cartManager = new CartManager();
module.exports = cartManager;
