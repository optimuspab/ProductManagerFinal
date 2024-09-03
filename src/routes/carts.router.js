const express = require('express');
const router = express.Router();
const cartManager = require('../manager/cartManager');

router.post('/', async (req, res) => {
    console.log('Solicitud para crear un nuevo carrito recibida.');

    const result = await cartManager.createCart();

    if (result.success) {
        console.log('Carrito creado exitosamente:', result.cart);
        res.status(201).json(result.cart);
    } else {
        console.error('Error al crear el carrito:', result.message);
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
    console.log('Agregando producto al carrito:', { cartId, productId });

    const result = await cartManager.addProductToCart(cartId, productId);

    if (result.success) {
        console.log('Producto agregado exitosamente:', result.message);
        res.status(200).send(result.message);
    } else {
        console.error('Error al agregar producto al carrito:', result.message);
        res.status(404).send(result.message);
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const result = await cartManager.removeProductFromCart(cartId, productId);

    if (result.success) {
        res.status(200).send(result.message);
    } else {
        res.status(404).send(result.message);
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    const result = await cartManager.updateProductQuantity(cartId, productId, quantity);

    if (result.success) {
        res.status(200).send(result.message);
    } else {
        res.status(404).send(result.message);
    }
});

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const products = req.body.products;

    const result = await cartManager.updateCart(cartId, products);

    if (result.success) {
        res.status(200).send(result.message);
    } else {
        res.status(404).send(result.message);
    }
});

router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;

    const result = await cartManager.clearCart(cartId);

    if (result.success) {
        res.status(200).send(result.message);
    } else {
        res.status(404).send(result.message);
    }
});

module.exports = router;
