# Comisión 70095 - Programación Backend I: Proyecto Final

## Descripción del Proyecto

Este es el proyecto final de la Comisión 70095 de Programación Backend I, el cual engloba las funcionalidades desarrolladas en las dos entregas anteriores y expande su funcionalidad mediante la profesionalización de la base de datos utilizando MongoDB.

- **Primer entrega:**
  - https://github.com/optimuspab/ProductManager

- **Segunda entrega:**
  - https://github.com/optimuspab/WebSocketsProductManager

### Características del Proyecto

- **Sistema de Persistencia con MongoDB:**
  - MongoDB ha sido integrado como sistema de persistencia principal, reemplazando el uso del file system.
  - Los endpoints para productos y carritos han sido ajustados para trabajar con MongoDB.

- **Consultas Profesionales de Productos:**
  - Se ha mejorado la gestión de productos con filtros avanzados, paginación y opciones de ordenamiento.
  - Las consultas permiten filtrar productos por categoría o disponibilidad y ordenarlos por precio en orden ascendente o descendente.

- **Gestión Avanzada de Carritos:**
  - Se han añadido nuevos endpoints para la gestión avanzada de carritos, incluyendo la posibilidad de eliminar productos, actualizar el carrito completo o solo la cantidad de productos, y eliminar todos los productos del carrito.
  - El carrito ahora referencia directamente a los productos mediante ObjectId, y al consultarlo, se utiliza `populate` para obtener la información completa del producto.

### Rutas de Productos

#### Base URL: `/api/products/`

- **GET `/`:** Devuelve una lista paginada de productos con soporte para filtros y ordenamiento. Soporta los siguientes query params:
  - `limit`: Número de productos por página (default: 10).
  - `page`: Número de página (default: 1).
  - `sort`: Orden por precio (`asc` o `desc`).
  - `query`: Filtro por categoría o disponibilidad.

  **Ejemplo de petición:**
  ```http
  GET /api/products?limit=5&page=2&sort=asc&query=category:Electronics
     ```

  **Ejemplo de respuesta:**
  ```json
  {
    "status": "success",
    "payload": [
      {
        "_id": "66d4b02994c9aa10d900d82e",
        "title": "Smartphone",
        "description": "Latest model",
        "price": 699.99,
        "stock": 50,
        "category": "Electronics",
        "thumbnails": ["/files/uploads/phone.jpg"]
      },
      {
        "_id": "66d4b02994c9aa10d900d82f",
        "title": "Laptop",
        "description": "High performance laptop",
        "price": 1299.99,
        "stock": 20,
        "category": "Electronics",
        "thumbnails": ["/files/uploads/laptop.jpg"]
      }
    ],
    "totalPages": 3,
    "prevPage": 1,
    "nextPage": 3,
    "page": 2,
    "hasPrevPage": true,
    "hasNextPage": true,
    "prevLink": "/api/products?limit=5&page=1&sort=asc&query=category:Electronics",
    "nextLink": "/api/products?limit=5&page=3&sort=asc&query=category:Electronics"
  }
  ```

### GET `/products/:pid`: Devuelve los detalles de un producto específico.

**Ejemplo de petición:**

```http
GET /api/products/66d4b02994c9aa10d900d82e
 ```

**Ejemplo de respuesta:**

 ```json
{
  "status": "success",
  "product": {
    "_id": "66d4b02994c9aa10d900d82e",
    "title": "Smartphone",
    "description": "Latest model",
    "price": 699.99,
    "stock": 50,
    "category": "Electronics",
    "thumbnails": ["/files/uploads/phone.jpg"]
  }
}
 ```
### Rutas de Carritos

#### Base URL: `/api/carts/`

- **POST /:** Crea un nuevo carrito.

**Ejemplo de petición:**

```http
POST /api/carts/
 ```

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "cart": {
    "_id": "66d51d702d868867cf46f728",
    "products": [],
    "__v": 0
  }
}
```

- **GET /:cid:** Devuelve los productos de un carrito específico.

**Ejemplo de petición:**

```http
GET /api/carts/66d51d702d868867cf46f728
 ```

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "products": [
    {
      "product": {
        "_id": "66d4b02994c9aa10d900d82e",
        "title": "Smartphone",
        "price": 699.99
      },
      "quantity": 1
    },
    {
      "product": {
        "_id": "66d4fd1f98319027f8781ba3",
        "title": "Laptop",
        "price": 1299.99
      },
      "quantity": 1
    }
  ]
}
```

- **POST /:cid/product/:pid:** Agrega un producto al carrito.

**Ejemplo de petición:**

```http
POST /api/carts/66d51d702d868867cf46f728/product/66d4b02994c9aa10d900d82e
```

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "message": "Producto agregado al carrito"
}
```

- **DELETE /:cid/products/:pid:** Elimina un producto del carrito.

**Ejemplo de petición:**

```http
DELETE /api/carts/66d51d702d868867cf46f728/products/66d4b02994c9aa10d900d82e
```

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "message": "Producto eliminado del carrito"
}
```

- **PUT /:cid:** Actualiza el carrito completo.

**Ejemplo de petición:**

```http
PUT /api/carts/66d51d702d868867cf46f728
Content-Type: application/json
```

```json
{
  "products": [
    { "product": "66d4b02994c9aa10d900d82e", "quantity": 2 },
    { "product": "66d4fd1f98319027f8781ba3", "quantity": 1 }
  ]
}
```

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "message": "Carrito actualizado"
}
```

- **PUT /:cid/products/:pid:** Actualiza solo la cantidad de un producto en el carrito.

**Ejemplo de petición:**

```http
PUT /api/carts/66d51d702d868867cf46f728/products/66d4b02994c9aa10d900d82e
Content-Type: application/json
```
```json
{
  "quantity": 5
}
```

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "message": "Cantidad actualizada"
}
```

- **DELETE /:cid:** Elimina todos los productos del carrito.

**Ejemplo de petición:**

```http
DELETE /api/carts/66d51d702d868867cf46f728
```
**Ejemplo de respuesta:**

```json
{
  "success": true,
  "message": "Carrito eliminado"
}
```

## Vistas con Handlebars

- **Ruta:** `/products`
- **Descripción:** Muestra todos los productos con paginación. Cada producto tiene un botón para ver detalles o agregar directamente al carrito.

- **Ruta:** `/products/:pid`
- **Descripción:** Muestra la información detallada de un producto.

- **Ruta:** `/carts/:cid`
- **Descripción:** Muestra los productos en un carrito específico.

## Persistencia de la Información
La persistencia de la información se maneja a través de MongoDB, almacenando los productos y carritos en colecciones dedicadas.

## Instalación

Sigue estos pasos para clonar el repositorio, instalar las dependencias y ejecutar el proyecto:

1. Clona el repositorio:
    ```sh
    git clone https://github.com/optimuspab/ProductManagerWebsockets.git
    ```

2. Navega al directorio del proyecto:
    ```sh
    cd tu-repositorio
    ```

3. Instala las dependencias:
    ```sh
    npm install
    ```

4. Configura las variables de entorno en un archivo .env:
    ```sh
    MONGO_URI=tu_uri_de_mongodb
    MONGO_CERT_PATH=./config/cert.pem
    SECRET_KEY=tu_clave_secreta
    Inicia el servidor:
    ```
5. Inicia el servidor:
    ```sh
    npm start
    ```

El servidor se ejecutará en `http://localhost:8080`.

## Ejemplo de Uso
Puedes utilizar Postman o cualquier cliente HTTP para interactuar con las rutas de productos y carritos. Además, las vistas en tiempo real y de home están disponibles en el navegador.