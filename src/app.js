const express = require("express");
const exphbs = require("express-handlebars"); 
const path = require("path");
require('dotenv').config();
const mongoose = require("mongoose");
const app = express();
const routes = require('./routes/index');

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

app.use(routes);

module.exports = app;
