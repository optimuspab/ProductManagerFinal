const express = require('express');
const router = express.Router();
const cartManager = require('../manager/cartManager');

router.post('/', async (req, res) => {
    const result = await cartManager.createCart();
    if (result.success) {
        res.status(201).json(result.cart);
    } else {
        res.status(500).send(result.message);
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const result = await cartManager.getCartById(cartId);

    if (result.success) {
        res.status(200).json(result.cart.products);
    } else {
        res.status(404).send(result.message);
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
