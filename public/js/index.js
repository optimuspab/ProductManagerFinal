const socket = io();

socket.on('products', (products) => {
    console.log('Lista de productos recibida:', products);
});

socket.on('product-updated', (product) => {
    console.log('Producto actualizado:', product);
});

socket.on('product-deleted', (productId) => {
    console.log('Producto eliminado:', productId);
});

const addProductForm = document.getElementById('addProductForm');

if (addProductForm && !addProductForm.dataset.listenerAdded) {
    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const productData = {
            title: document.getElementById('productName').value,
            price: document.getElementById('productPrice').value,
        };
        socket.emit('new-product', productData);

        addProductForm.reset();
    });

    addProductForm.dataset.listenerAdded = true;
}





