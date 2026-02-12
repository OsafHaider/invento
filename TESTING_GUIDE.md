# Product API - Example Test Data

## Authentication Examples

### Sign Up
```json
{
  "email": "admin@invento.com",
  "password": "AdminPassword123",
  "name": "Admin User",
  "role": "admin"
}
```

### Sign In
```json
{
  "email": "admin@invento.com",
  "password": "AdminPassword123"
}
```

## Product Examples

### Create Product - Laptop
```json
{
  "name": "MacBook Pro 16\"",
  "description": "Powerful laptop with M3 Max chip, 36GB unified memory, and stunning Liquid Retina display",
  "price": 3499.00,
  "quantity": 15,
  "category": "Electronics",
  "image": "https://example.com/macbook-pro.jpg"
}
```

### Create Product - Mouse
```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse with precision tracking and long battery life",
  "price": 45.99,
  "quantity": 100,
  "category": "Accessories",
  "image": "https://example.com/wireless-mouse.jpg"
}
```

### Create Product - Keyboard
```json
{
  "name": "Mechanical Keyboard",
  "description": "RGB mechanical keyboard with Cherry MX switches and aluminum frame",
  "price": 129.99,
  "quantity": 50,
  "category": "Accessories",
  "image": "https://example.com/mechanical-keyboard.jpg"
}
```

### Create Product - Monitor
```json
{
  "name": "4K Monitor 27\"",
  "description": "Ultra HD 4K monitor with HDR support, 144Hz refresh rate, and USB-C connectivity",
  "price": 599.00,
  "quantity": 20,
  "category": "Electronics",
  "image": "https://example.com/4k-monitor.jpg"
}
```

### Create Product - Webcam
```json
{
  "name": "HD Webcam 1080p",
  "description": "Crystal clear HD webcam with built-in microphone and auto focus",
  "price": 79.99,
  "quantity": 75,
  "category": "Accessories",
  "image": "https://example.com/hd-webcam.jpg"
}
```

### Update Product (Partial Update)
```json
{
  "price": 4099.00,
  "quantity": 10
}
```

## Query Parameters

### Get All Products with Pagination
```
GET /api/products?page=1&limit=10
GET /api/products?page=2&limit=5
```

## Response Examples

### Successful Create Product (201)
```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "MacBook Pro 16\"",
    "description": "Powerful laptop with M3 Max chip...",
    "price": 3499.00,
    "quantity": 15,
    "category": "Electronics",
    "image": "https://example.com/macbook-pro.jpg",
    "createdBy": "user_id_here",
    "createdAt": "2025-02-12T10:30:00.000Z",
    "updatedAt": "2025-02-12T10:30:00.000Z"
  }
}
```

### Get All Products (200)
```json
{
  "products": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "MacBook Pro 16\"",
      "description": "Powerful laptop...",
      "price": 3499.00,
      "quantity": 15,
      "category": "Electronics",
      "image": "https://example.com/macbook-pro.jpg",
      "createdAt": "2025-02-12T10:30:00.000Z",
      "updatedAt": "2025-02-12T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### Error Responses

#### Validation Failed (400)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": "name",
      "message": "Product name is required"
    },
    {
      "path": "price",
      "message": "Price must be greater than 0"
    }
  ]
}
```

#### Unauthorized (401)
```json
{
  "error": "Unauthorized"
}
```

#### Not Found (404)
```json
{
  "error": "Product not found"
}
```

#### Forbidden (403)
```json
{
  "error": "Unauthorized to update this product"
}
```

#### Server Error (500)
```json
{
  "error": "Failed to create product"
}
```

## Headers

### Authorization Header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Content-Type Header
```
Content-Type: application/json
```

## Testing Steps

1. **Health Check** - Verify server is running
   - GET /health

2. **Sign Up** - Create a new user account
   - POST /api/auth/signup

3. **Sign In** - Get access token
   - POST /api/auth/signin
   - Copy the access token from response

4. **Create Product** - Add a new product
   - POST /api/products
   - Add Authorization header with token

5. **Get All Products** - List all products
   - GET /api/products
   - Add Authorization header

6. **Get Single Product** - Get product by ID
   - GET /api/products/{id}
   - Copy product ID from step 4

7. **Update Product** - Update the product
   - PUT /api/products/{id}
   - Add Authorization header

8. **Delete Product** - Remove the product
   - DELETE /api/products/{id}
   - Add Authorization header
