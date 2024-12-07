# Inventory Management System

A Node.js-based Inventory Management System with role-based access control, product and category management.

## Features

- User Authentication with JWT
- Role-based Access Control
- Category Management
- Product Management
- SQLite Database Integration
- RESTful API

## Prerequisites

- Node.js (v14 or higher)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```
   JWT_SECRET=your_secret_key
   PORT=3000
   ```

## Default Super Admin Credentials

```
Email: superadmin@example.com
Password: Admin123!
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- POST /auth/register - Register a new user
- POST /auth/login - Authenticate user

### Role Management
- POST /roles - Create a new role
- POST /roles/assign - Assign role to user

### Category Management
- POST /categories - Create category
- PUT /categories/:id - Update category
- DELETE /categories/:id - Delete category
- GET /categories - List categories

### Product Management
- POST /products - Create product
- PUT /products/:id - Update product
- DELETE /products/:id - Delete product
- GET /products/:id - Get product details
- GET /products/category/:id - Get category products

## License

MIT