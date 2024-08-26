const express = require('express');
const router = express.Router();
const cartManager = require('../manager/cartManager');

router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);

    if (cart.success) {
        res.status(200).json(cart.cart.products);
    } else {
        res.status(404).send(cart.message);
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const result = await cartManager.addProductToCart(cartId, productId);

    if (result.success) {
        res.status(200).send(result.message);
    } else {
        res.status(404).send(result.message);
    }
});

module.exports = router;
