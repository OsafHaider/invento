# Invento - Inventory Management System

A modern, full-stack inventory management system built with **Next.js** and **Node.js/Express**.

## 🌟 Features

### Authentication
- ✅ User registration (Sign Up)
- ✅ User login (Sign In)
- ✅ JWT-based authentication
- ✅ Refresh token mechanism
- ✅ Role-based access control (Admin/User)
- ✅ Password hashing with bcrypt

### Product Management
- ✅ Create products
- ✅ Read products (with pagination)
- ✅ Update products
- ✅ Delete products
- ✅ Role-based filtering (Admins see all, Users see their own)
- ✅ Product search and filtering by category

### User Experience
- ✅ Responsive UI with Tailwind CSS
- ✅ Password visibility toggle
- ✅ Form validation (client & server-side)
- ✅ Error handling and messaging
- ✅ Loading states
- ✅ Protected routes

> **📖 For detailed token refresh API documentation**, see [REFRESH_TOKEN_GUIDE.md](./REFRESH_TOKEN_GUIDE.md)

## 🏗️ Project Structure

```
invento/
├── client/                 # Next.js Frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   │   ├── ui/           # UI components (Button, Input)
│   │   └── modules/      # Feature modules (Auth, Product)
│   ├── lib/              # Utilities and API calls
│   └── public/           # Static assets
│
└── server/               # Express.js Backend
    ├── src/
    │   ├── controllers/  # Business logic
    │   ├── models/       # MongoDB schemas
    │   ├── routes/       # API routes
    │   ├── middleware/   # Authentication, validation
    │   ├── schema/       # Zod validation schemas
    │   ├── lib/          # JWT utilities
    │   └── config/       # Database config
    └── .env             # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm or npm
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/OsafHaider/invento.git
cd invento
```

2. **Setup Environment Variables**

Create `.env` file in the `server` directory:
```env
PORT=8080
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/invento
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
CLIENT_URL=http://localhost:3000
```

Create `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. **Install Dependencies**

```bash
# Install all dependencies
pnpm install

# Or install separately
cd server && pnpm install
cd ../client && pnpm install
```

4. **Start the development servers**

```bash
# Terminal 1 - Start Backend
cd server
pnpm dev

# Terminal 2 - Start Frontend
cd client
pnpm dev
```

Backend runs on `http://localhost:8080`
Frontend runs on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication

#### Sign Up
```http
POST /auth/sign-up
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "user"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2025-02-13T10:00:00.000Z",
    "updatedAt": "2025-02-13T10:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Sign In
```http
POST /auth/sign-in
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2025-02-13T10:00:00.000Z",
    "updatedAt": "2025-02-13T10:00:00.000Z",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2025-02-13T10:00:00.000Z",
    "updatedAt": "2025-02-13T10:00:00.000Z"
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Products

#### Create Product
```http
POST /products
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "MacBook Pro 16\"",
  "description": "Powerful laptop with M3 Max chip, 36GB unified memory, and stunning Liquid Retina display",
  "price": 3499.00,
  "quantity": 15,
  "category": "Electronics",
  "sku_code": "SKU-MBPRO-001",
  "image": "https://example.com/macbook-pro.jpg"
}
```

**Response (201):**
```json
{
  "message": "Product created successfully"
}
```

#### Get All Products
```http
GET /products?page=1&limit=10
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "products": [
    {
      "_id": "product_id",
      "name": "MacBook Pro 16\"",
      "description": "Powerful laptop...",
      "price": 3499.00,
      "quantity": 15,
      "category": "Electronics",
      "sku_code": "SKU-MBPRO-001",
      "image": "https://example.com/macbook-pro.jpg",
      "createdBy": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2025-02-13T10:00:00.000Z",
      "updatedAt": "2025-02-13T10:00:00.000Z"
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

#### Get Product by ID
```http
GET /products/{productId}
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "product": {
    "_id": "product_id",
    "name": "MacBook Pro 16\"",
    "description": "Powerful laptop...",
    "price": 3499.00,
    "quantity": 15,
    "category": "Electronics",
    "sku_code": "SKU-MBPRO-001",
    "image": "https://example.com/macbook-pro.jpg",
    "createdAt": "2025-02-13T10:00:00.000Z",
    "updatedAt": "2025-02-13T10:00:00.000Z"
  }
}
```

#### Update Product
```http
PUT /products/{productId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "price": 4099.00,
  "quantity": 10
}
```

**Response (200):**
```json
{
  "message": "Product updated successfully",
  "product": {
    "_id": "product_id",
    "name": "MacBook Pro 16\"",
    "price": 4099.00,
    "quantity": 10
  }
}
```

#### Delete Product
```http
DELETE /products/{productId}
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

### Stock Transactions

#### Create Stock Transaction
```http
POST /stock
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "productId": "product_id",
  "type": "IN",
  "quantity": 50
}
```

**Response (201):**
```json
{
  "message": "Stock transaction created successfully",
  "transaction": {
    "_id": "transaction_id",
    "productId": "product_id",
    "type": "IN",
    "quantity": 50,
    "performedBy": "user_id",
    "createdAt": "2025-02-14T10:00:00.000Z",
    "updatedAt": "2025-02-14T10:00:00.000Z"
  }
}
```

**Error Cases:**
- `404` - Product not found
- `400` - Insufficient stock for OUT transactions

#### Get Transaction History
```http
GET /stock/{productId}?page=1&limit=10
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "transactions": [
    {
      "_id": "transaction_id",
      "productId": "product_id",
      "type": "IN",
      "quantity": 50,
      "performedBy": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2025-02-14T10:00:00.000Z",
      "updatedAt": "2025-02-14T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "pages": 2
  }
}
```

## 🧪 Testing

### Using Postman

1. Import `postman-collection.json` into Postman
2. Set the base URL: `http://localhost:8080`
3. Follow the requests in order:
   - Sign Up to create an account
   - Sign In to get tokens
   - Use the access token for Product API requests

### Using cURL

**Sign Up:**
```bash
curl -X POST http://localhost:8080/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure123",
    "role": "user"
  }'
```

**Create Product:**
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM",
    "price": 999.99,
    "quantity": 50,
    "category": "Electronics",
    "sku_code": "SKU-LAP-001",
    "image": "https://example.com/laptop.jpg"
  }'
```

## ✅ Validation Rules

### Product Validation

| Field | Type | Rules |
|-------|------|-------|
| name | string | Required, 1-100 characters |
| description | string | Required, 10-500 characters |
| price | number | Required, must be > 0 |
| quantity | number | Required, must be ≥ 0 |
| category | string | Required |
| sku_code | string | Required, must be unique |
| image | string | Optional, must be valid URL |

### Authentication Validation

| Field | Type | Rules |
|-------|------|-------|
| email | string | Required, valid email format |
| password | string | Required, min 6 characters |
| name | string | Required |
| role | string | Optional (default: "user") |

## 🔒 Security Features

- ✅ JWT token-based authentication
- ✅ Refresh token rotation
- ✅ Password hashing with bcrypt
- ✅ CORS enabled for frontend
- ✅ HTTP-only cookies for refresh tokens
- ✅ Role-based access control
- ✅ Request validation middleware
- ✅ Protected routes

## 📁 Frontend Routes

| Route | Description | Protected |
|-------|-------------|-----------|
| `/` | Home page | No |
| `/sign-up` | User registration | No |
| `/sign-in` | User login | No |
| `/profile` | User profile | Yes |
| `/products` | Products dashboard | Yes |
| `/products/create` | Create product | Yes |
| `/products/[id]` | View product | Yes |
| `/products/[id]/edit` | Edit product | Yes |

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Package Manager:** pnpm

### Backend
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **Authentication:** JWT
- **Validation:** Zod
- **Password Hashing:** Bcrypt

## 📝 Environment Variables

### Server (.env)
```
PORT=8080
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/invento
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
CLIENT_URL=http://localhost:3000
```

### Client (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 8080 (backend)
lsof -ti:8080 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### MongoDB connection error
- Ensure MongoDB is running locally or check your connection string
- Test connection: `mongosh "mongodb://localhost:27017"`

### CORS errors
- Check `CLIENT_URL` in server `.env`
- Ensure CORS middleware is properly configured in `app.ts`

### Token expired
- Use the refresh token endpoint to get a new access token
- The refresh token is stored in HTTP-only cookies and localStorage

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 👥 Contributors

- **Osaf Haider** - Initial project setup and development

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request to the `main` branch.

## 📞 Support

For issues and questions, please create an issue on GitHub.

---

**Built with ❤️ by Osaf Haider**
