const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const productManager = require('./src/manager/productManager');
const viewsRouter = require('./src/routes/views.router');

const port = process.env.PORT || 8080;

const server = createServer(app);
const io = new Server(server);

app.use('/', viewsRouter);

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    socket.emit('products', await productManager.getProducts());

    socket.on('new-product', async (data) => {
        const newProduct = await productManager.addProduct(data.title, data.description, data.price, data.stock, data.category, data.thumbnails);
        if (newProduct.success) {
            io.emit('products', await productManager.getProducts());
        } else {
            console.log(newProduct.message);
        }
    });

    socket.on('delete-product', async (productId) => {
        const success = await productManager.deleteProduct(productId);
        if (success) {
            io.emit('products', await productManager.getProducts());
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
