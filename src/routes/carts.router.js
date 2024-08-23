const express = require('express');
const router = express.Router();
const cartManager = require('../manager/cartManager');

router.post('/', (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCartById(cartId);

    if (cart) {
        res.status(200).json(cart.products);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const result = cartManager.addProductToCart(cartId, productId);

    if (result.success) {
        res.status(200).send('Producto agregado al carrito');
    } else {
        res.status(404).send(result.message);
    }
});

module.exports = router;