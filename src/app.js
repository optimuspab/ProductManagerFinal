const express = require("express");
const exphbs = require("express-handlebars"); 
const path = require("path");
require('dotenv').config();
const mongoose = require("mongoose");
const app = express();
const routes = require('./routes/index');
const session = require('express-session');
const crypto = require('crypto');
const secret = process.env.SECRET_KEY || crypto.randomBytes(32).toString('hex');
const cartManager = require('./manager/cartManager');

const MONGO_CERT_PATH = path.resolve(__dirname, process.env.MONGO_CERT_PATH);

mongoose.connect(process.env.MONGO_URI, {
    tlsCertificateKeyFile: MONGO_CERT_PATH
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const handlebars = exphbs.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(async (req, res, next) => {
    if (!req.session.cartId) {
        try {
            const cartResult = await cartManager.createCart();
            if (cartResult.success) {
                req.session.cartId = cartResult.cart._id;
                console.log('Nuevo carrito guardado en session:', req.session.cartId);
            } else {
                console.error('Error al crear el carrito:', cartResult.message);
            }
        } catch (error) {
            console.error('Error al crear el carrito:', error);
        }
    } else {
        console.log('Carrito ya existente en session:', req.session.cartId);
    }
    next();
});

app.use(routes);

module.exports = app;
