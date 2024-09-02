const Cart = require('../models/carts');

class CartManager {
    
    async createCart() {
        try {
            const newCart = new Cart();
            const savedCart = await newCart.save();
            return { success: true, cart: savedCart };
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            return { success: false, message: 'Error al crear el carrito' };
        }
    }

    async getCartById(id) {
        try {
            const cart = await Cart.findById(id).populate('products.product').exec();
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

module.exports = new CartManager();
